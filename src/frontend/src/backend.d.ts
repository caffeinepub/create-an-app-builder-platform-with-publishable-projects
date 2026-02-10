import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type ProjectId = bigint;
export interface Project {
    id: ProjectId;
    owner: Principal;
    name: string;
    createdAt: Time;
    publishStatus: Variant_published_draft;
    description?: string;
    updatedAt: Time;
    state: ProjectState;
    urlSlug?: string;
}
export interface UserProfile {
    name: string;
}
export interface ProjectState {
    lastEdited: Time;
    theme: Theme;
    title: string;
    tagline: string;
    body: string;
}
export enum Theme {
    custom = "custom",
    dark = "dark",
    light = "light"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export enum Variant_published_draft {
    published = "published",
    draft = "draft"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProject(name: string, description: string | null): Promise<ProjectId>;
    deleteProject(projectId: ProjectId): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProject(projectId: ProjectId): Promise<Project>;
    getProjectPublic(projectId: ProjectId): Promise<Project>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserProjects(user: Principal): Promise<Array<Project>>;
    isCallerAdmin(): Promise<boolean>;
    listPublicProjects(): Promise<Array<Project>>;
    publishProject(projectId: ProjectId): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveProjectState(projectId: ProjectId, title: string, tagline: string, body: string, theme: Theme): Promise<void>;
    unpublishProject(projectId: ProjectId): Promise<void>;
    updateProject(projectId: ProjectId, name: string, description: string | null): Promise<void>;
}
