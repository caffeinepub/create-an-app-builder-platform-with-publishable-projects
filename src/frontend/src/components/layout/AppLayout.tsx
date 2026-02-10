import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { Sparkles } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { data: userProfile } = useGetCallerUserProfile();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">AppForge</h1>
              <p className="text-xs text-muted-foreground">Build & Publish</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userProfile && (
              <span className="text-sm font-medium text-muted-foreground">
                Hello, <span className="text-foreground">{userProfile.name}</span>
              </span>
            )}
            <LoginButton />
          </div>
        </div>
      </header>
      <main className="container py-8">{children}</main>
      <footer className="border-t border-border/40 py-6 mt-16">
        <div className="container text-center text-sm text-muted-foreground">
          © 2026. Built with <span className="text-red-500">♥</span> using{' '}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
