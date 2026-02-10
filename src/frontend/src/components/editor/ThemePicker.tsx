import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Palette } from 'lucide-react';
import type { Theme } from '../../backend';

interface ThemePickerProps {
  value: Theme;
  onChange: (value: Theme) => void;
}

export default function ThemePicker({ value, onChange }: ThemePickerProps) {
  const themes: { value: Theme; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'light' as Theme, label: 'Light', icon: <Sun className="h-5 w-5" />, description: 'Clean and bright' },
    { value: 'dark' as Theme, label: 'Dark', icon: <Moon className="h-5 w-5" />, description: 'Easy on the eyes' },
    { value: 'custom' as Theme, label: 'Custom', icon: <Palette className="h-5 w-5" />, description: 'Unique style' },
  ];

  return (
    <RadioGroup value={value} onValueChange={(val) => onChange(val as Theme)}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themes.map((theme) => (
          <Label
            key={theme.value}
            htmlFor={theme.value}
            className="cursor-pointer"
          >
            <Card className={`p-4 hover:border-primary transition-colors ${value === theme.value ? 'border-primary ring-2 ring-primary/20' : ''}`}>
              <div className="flex items-start gap-3">
                <RadioGroupItem value={theme.value} id={theme.value} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {theme.icon}
                    <span className="font-semibold">{theme.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{theme.description}</p>
                </div>
              </div>
            </Card>
          </Label>
        ))}
      </div>
    </RadioGroup>
  );
}
