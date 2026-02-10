import { useNavigate } from '@tanstack/react-router';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { FileText, MoreVertical, Edit, Trash2, Eye, Globe } from 'lucide-react';
import type { Project } from '../../backend';

interface ProjectListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export default function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  const navigate = useNavigate();

  if (projects.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
          <p className="text-sm text-muted-foreground mb-6">Create your first project to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card key={project.id.toString()} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="truncate">{project.name}</CardTitle>
                <CardDescription className="line-clamp-2 mt-1">
                  {project.description || 'No description'}
                </CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-2 shrink-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate({ to: '/projects/$projectId', params: { projectId: project.id.toString() } })}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {project.publishStatus === 'published' && (
                    <DropdownMenuItem onClick={() => navigate({ to: '/p/$projectId', params: { projectId: project.id.toString() } })}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Public
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => onEdit(project)}>
                    <FileText className="mr-2 h-4 w-4" />
                    Rename
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onDelete(project)} className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge variant={project.publishStatus === 'published' ? 'default' : 'secondary'}>
                {project.publishStatus === 'published' ? (
                  <>
                    <Globe className="mr-1 h-3 w-3" />
                    Published
                  </>
                ) : (
                  'Draft'
                )}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate({ to: '/projects/$projectId', params: { projectId: project.id.toString() } })}
              >
                Open
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
