import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import ThemePicker from './ThemePicker';
import type { Theme } from '../../backend';

interface EditorFormProps {
  title: string;
  tagline: string;
  body: string;
  theme: Theme;
  onTitleChange: (value: string) => void;
  onTaglineChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  onThemeChange: (value: Theme) => void;
}

export default function EditorForm({
  title,
  tagline,
  body,
  theme,
  onTitleChange,
  onTaglineChange,
  onBodyChange,
  onThemeChange,
}: EditorFormProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Page Title</Label>
            <Input
              id="title"
              placeholder="Welcome to My App"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tagline">Tagline</Label>
            <Input
              id="tagline"
              placeholder="A brief description of your app"
              value={tagline}
              onChange={(e) => onTaglineChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="body">Body Content (Markdown supported)</Label>
            <Textarea
              id="body"
              placeholder="Write your content here... You can use **markdown** for formatting."
              value={body}
              onChange={(e) => onBodyChange(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Theme</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemePicker value={theme} onChange={onThemeChange} />
        </CardContent>
      </Card>
    </div>
  );
}
