import Map "mo:core/Map";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type ProjectId = Nat;
  type Theme = { #light; #dark; #custom };

  type ProjectState = {
    title : Text;
    tagline : Text;
    body : Text;
    theme : Theme;
    lastEdited : Time.Time;
  };

  type Project = {
    id : ProjectId;
    owner : Principal;
    name : Text;
    description : ?Text;
    createdAt : Time.Time;
    updatedAt : Time.Time;
    publishStatus : {
      #draft;
      #published;
    };
    urlSlug : ?Text;
    state : ProjectState;
  };

  public type UserProfile = {
    name : Text;
  };

  module Project {
    public func equal(p1 : Project, p2 : Project) : Bool {
      p1.id == p2.id;
    };
  };

  let projects = Map.empty<ProjectId, Project>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextProjectId = 1;

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Project management
  public shared ({ caller }) func createProject(name : Text, description : ?Text) : async ProjectId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create projects");
    };

    let id = nextProjectId;
    nextProjectId += 1;

    let project : Project = {
      id;
      owner = caller;
      name;
      description;
      createdAt = Time.now();
      updatedAt = Time.now();
      publishStatus = #draft;
      urlSlug = null;
      state = {
        title = "";
        tagline = "";
        body = "";
        theme = #light;
        lastEdited = Time.now();
      };
    };

    projects.add(id, project);
    id;
  };

  public shared ({ caller }) func updateProject(projectId : ProjectId, name : Text, description : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update projects");
    };

    let project = getOwnerProjectInternal(projectId, caller);
    let updatedProject : Project = {
      project with
      name;
      description;
      updatedAt = Time.now();
    };
    projects.add(projectId, updatedProject);
  };

  public query ({ caller }) func getProject(projectId : ProjectId) : async Project {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view projects");
    };

    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (project.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own projects");
        };
        project;
      };
    };
  };

  public query ({ caller }) func getProjectPublic(projectId : ProjectId) : async Project {
    // No authentication required - anyone can view published projects
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (project.publishStatus != #published) {
          Runtime.trap("Project is not published");
        };
        project;
      };
    };
  };

  public query ({ caller }) func getUserProjects(user : Principal) : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view projects");
    };

    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own projects");
    };

    projects.values().toArray().filter(func(p : Project) : Bool { p.owner == user });
  };

  public shared ({ caller }) func deleteProject(projectId : ProjectId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete projects");
    };

    ignore getOwnerProjectInternal(projectId, caller);
    projects.remove(projectId);
  };

  public shared ({ caller }) func saveProjectState(
    projectId : ProjectId,
    title : Text,
    tagline : Text,
    body : Text,
    theme : Theme,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can edit projects");
    };

    let project = getOwnerProjectInternal(projectId, caller);
    let updatedState = {
      title;
      tagline;
      body;
      theme;
      lastEdited = Time.now();
    };

    let updatedProject : Project = {
      project with
      state = updatedState;
      updatedAt = Time.now();
    };
    projects.add(projectId, updatedProject);
  };

  public shared ({ caller }) func publishProject(projectId : ProjectId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can publish projects");
    };

    let project = getOwnerProjectInternal(projectId, caller);
    let urlSlug = ?("p-" # Nat.toText(projectId));
    let updatedProject : Project = {
      project with
      publishStatus = #published;
      urlSlug;
      updatedAt = Time.now();
    };
    projects.add(projectId, updatedProject);
  };

  public shared ({ caller }) func unpublishProject(projectId : ProjectId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can unpublish projects");
    };

    let project = getOwnerProjectInternal(projectId, caller);
    let updatedProject : Project = {
      project with
      publishStatus = #draft;
      updatedAt = Time.now();
    };
    projects.add(projectId, updatedProject);
  };

  public query ({ caller }) func listPublicProjects() : async [Project] {
    // No authentication required - anyone can list published projects
    projects.values().toArray().filter(func(p : Project) : Bool { p.publishStatus == #published });
  };

  func getOwnerProjectInternal(projectId : ProjectId, owner : Principal) : Project {
    switch (projects.get(projectId)) {
      case (null) { Runtime.trap("Project not found") };
      case (?project) {
        if (project.owner != owner) {
          Runtime.trap("Unauthorized: Only the project owner can perform this action");
        };
        project;
      };
    };
  };
};
