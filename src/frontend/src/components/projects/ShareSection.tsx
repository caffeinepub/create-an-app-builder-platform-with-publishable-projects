import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ShareSectionProps {
  projectId: bigint;
}

export default function ShareSection({ projectId }: ShareSectionProps) {
  const [copied, setCopied] = useState(false);
  const publicUrl = `${window.location.origin}/p/${projectId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  return (
    <Card className="mb-6 border-primary/20 bg-primary/5">
      <CardHeader>
        <CardTitle>Share Your Project</CardTitle>
        <CardDescription>Your project is published! Share this link with anyone.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Input value={publicUrl} readOnly className="font-mono text-sm" />
          <Button onClick={handleCopy} variant="outline" className="shrink-0">
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
