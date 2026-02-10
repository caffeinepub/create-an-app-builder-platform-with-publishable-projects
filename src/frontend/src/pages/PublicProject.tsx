import { useParams } from '@tanstack/react-router';
import { useGetProjectPublic } from '../hooks/useQueries';
import { Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

function parseMarkdown(text: string): string {
  let html = text;
  
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline font-medium">$1</a>');
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  html = '<p>' + html + '</p>';
  
  return html;
}

export default function PublicProject() {
  const { projectId } = useParams({ from: '/p/$projectId' });
  const { data: project, isLoading, error } = useGetProjectPublic(BigInt(projectId));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            This project is not found or not published. Please check the URL and try again.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const getThemeClasses = () => {
    switch (project.state.theme) {
      case 'light':
        return 'bg-white text-gray-900';
      case 'dark':
        return 'bg-gray-950 text-gray-50';
      case 'custom':
        return 'bg-gradient-to-br from-primary/5 to-accent/10 text-foreground';
      default:
        return 'bg-background text-foreground';
    }
  };

  const getProseClasses = () => {
    switch (project.state.theme) {
      case 'light':
        return 'prose-gray';
      case 'dark':
        return 'prose-invert';
      case 'custom':
        return 'prose-gray';
      default:
        return 'prose-gray';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeClasses()}`}>
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-3xl mx-auto">
          {project.state.title && (
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {project.state.title}
            </h1>
          )}
          {project.state.tagline && (
            <p className="text-xl md:text-2xl opacity-80 mb-8">
              {project.state.tagline}
            </p>
          )}
          {project.state.body && (
            <div
              className={`prose prose-lg max-w-none ${getProseClasses()}`}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(project.state.body) }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
