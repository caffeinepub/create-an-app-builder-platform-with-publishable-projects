import { Card } from '@/components/ui/card';
import type { Theme } from '../../backend';

interface ProjectPreviewProps {
  title: string;
  tagline: string;
  body: string;
  theme: Theme;
}

function parseMarkdown(text: string): string {
  let html = text;
  
  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-primary hover:underline">$1</a>');
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraphs
  html = '<p>' + html + '</p>';
  
  return html;
}

export default function ProjectPreview({ title, tagline, body, theme }: ProjectPreviewProps) {
  const getThemeClasses = () => {
    switch (theme) {
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
    switch (theme) {
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
    <Card className="overflow-hidden">
      <div className={`p-8 md:p-12 min-h-[600px] ${getThemeClasses()}`}>
        <div className="max-w-3xl mx-auto">
          {title && (
            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {title || 'Your Title Here'}
            </h1>
          )}
          {tagline && (
            <p className="text-xl md:text-2xl opacity-80 mb-8">
              {tagline || 'Your tagline here'}
            </p>
          )}
          {body && (
            <div
              className={`prose prose-lg max-w-none ${getProseClasses()}`}
              dangerouslySetInnerHTML={{ __html: parseMarkdown(body) }}
            />
          )}
          {!title && !tagline && !body && (
            <div className="text-center py-16 opacity-50">
              <p className="text-lg">Your content will appear here</p>
              <p className="text-sm mt-2">Start editing to see your changes</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
