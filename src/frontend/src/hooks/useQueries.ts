import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Project, UserProfile, Theme } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetUserProjects() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<Project[]>({
    queryKey: ['userProjects', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return [];
      return actor.getUserProjects(identity.getPrincipal());
    },
    enabled: !!actor && !actorFetching && !!identity,
  });
}

export function useCreateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description }: { name: string; description?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProject(name, description || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });
}

export function useUpdateProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ projectId, name, description }: { projectId: bigint; name: string; description?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProject(projectId, name, description || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
      queryClient.invalidateQueries({ queryKey: ['project'] });
    },
  });
}

export function useDeleteProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteProject(projectId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });
}

export function useGetProject(projectId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Project>({
    queryKey: ['project', projectId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProject(projectId);
    },
    enabled: !!actor && !actorFetching && !!projectId,
  });
}

export function useSaveProjectState() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      projectId,
      title,
      tagline,
      body,
      theme,
    }: {
      projectId: bigint;
      title: string;
      tagline: string;
      body: string;
      theme: Theme;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveProjectState(projectId, title, tagline, body, theme);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['project', variables.projectId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });
}

export function usePublishProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.publishProject(projectId);
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });
}

export function useUnpublishProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (projectId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.unpublishProject(projectId);
    },
    onSuccess: (_, projectId) => {
      queryClient.invalidateQueries({ queryKey: ['project', projectId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['userProjects'] });
    },
  });
}

export function useGetProjectPublic(projectId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Project>({
    queryKey: ['publicProject', projectId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProjectPublic(projectId);
    },
    enabled: !!actor && !actorFetching && !!projectId,
    retry: false,
  });
}
