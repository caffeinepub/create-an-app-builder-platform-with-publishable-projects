import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetProject, useSaveProjectState, usePublishProject, useUnpublishProject } from '../hooks/useQueries';
import EditorForm from '../components/editor/EditorForm';
import ProjectPreview from '../components/editor/ProjectPreview';
import ShareSection from '../components/projects/ShareSection';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Loader2, Save, Globe, GlobeLock } from 'lucide-react';
import { toast } from 'sonner';
import type { Theme } from '../backend';

export default function ProjectEditor() {
  const { projectId } = useParams({ from: '/projects/$projectId' });
  const navigate = useNavigate();
  const { data: project, isLoading } = useGetProject(BigInt(projectId));
  const saveProjectState = useSaveProjectState();
  const publishProject = usePublishProject();
  const unpublishProject = useUnpublishProject();

  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [body, setBody] = useState('');
  const [theme, setTheme] = useState<Theme>('light' as Theme);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.state.title);
      setTagline(project.state.tagline);
      setBody(project.state.body);
      setTheme(project.state.theme);
      setIsDirty(false);
    }
  }, [project]);

  const handleSave = async () => {
    if (!project) return;

    try {
      await saveProjectState.mutateAsync({
        projectId: project.id,
        title,
        tagline,
        body,
        theme,
      });
      toast.success('Project saved successfully!');
      setIsDirty(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project');
    }
  };

  const handlePublish = async () => {
    if (!project) return;

    try {
      if (project.publishStatus === 'published') {
        await unpublishProject.mutateAsync(project.id);
        toast.success('Project unpublished');
      } else {
        await publishProject.mutateAsync(project.id);
        toast.success('Project published! Share your link.');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to update publish status');
    }
  };

  useEffect(() => {
    if (project) {
      const hasChanges =
        title !== project.state.title ||
        tagline !== project.state.tagline ||
        body !== project.state.body ||
        theme !== project.state.theme;
      setIsDirty(hasChanges);
    }
  }, [title, tagline, body, theme, project]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Project not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate({ to: '/' })}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handlePublish}
            disabled={publishProject.isPending || unpublishProject.isPending}
          >
            {publishProject.isPending || unpublishProject.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : project.publishStatus === 'published' ? (
              <>
                <GlobeLock className="mr-2 h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>
                <Globe className="mr-2 h-4 w-4" />
                Publish
              </>
            )}
          </Button>
          <Button onClick={handleSave} disabled={!isDirty || saveProjectState.isPending}>
            {saveProjectState.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save
              </>
            )}
          </Button>
        </div>
      </div>

      <Card className="p-6 mb-6">
        <h1 className="text-2xl font-bold mb-2">{project.name}</h1>
        {project.description && <p className="text-muted-foreground">{project.description}</p>}
      </Card>

      {project.publishStatus === 'published' && <ShareSection projectId={project.id} />}

      <Tabs defaultValue="edit" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>
        <TabsContent value="edit" className="mt-6">
          <EditorForm
            title={title}
            tagline={tagline}
            body={body}
            theme={theme}
            onTitleChange={setTitle}
            onTaglineChange={setTagline}
            onBodyChange={setBody}
            onThemeChange={setTheme}
          />
        </TabsContent>
        <TabsContent value="preview" className="mt-6">
          <ProjectPreview title={title} tagline={tagline} body={body} theme={theme} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
