import { useState } from 'react';
import { useGetUserProjects } from '../hooks/useQueries';
import ProjectList from '../components/projects/ProjectList';
import { CreateProjectDialog, EditProjectDialog, DeleteProjectDialog } from '../components/projects/ProjectDialogs';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import type { Project } from '../backend';

export default function Dashboard() {
  const { data: projects, isLoading } = useGetUserProjects();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">My Projects</h1>
          <p className="text-muted-foreground">Create, manage, and publish your apps</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)} size="lg">
          <Plus className="mr-2 h-5 w-5" />
          New Project
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <ProjectList
          projects={projects || []}
          onEdit={setEditingProject}
          onDelete={setDeletingProject}
        />
      )}

      <CreateProjectDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      {editingProject && (
        <EditProjectDialog
          project={editingProject}
          open={!!editingProject}
          onOpenChange={(open) => !open && setEditingProject(null)}
        />
      )}
      {deletingProject && (
        <DeleteProjectDialog
          project={deletingProject}
          open={!!deletingProject}
          onOpenChange={(open) => !open && setDeletingProject(null)}
        />
      )}
    </div>
  );
}
