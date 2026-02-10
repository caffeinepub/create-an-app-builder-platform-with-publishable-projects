import LoginButton from '../components/auth/LoginButton';
import { Sparkles, Zap, Globe, Rocket } from 'lucide-react';

export default function SignedOut() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 shadow-2xl">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold tracking-tight text-foreground">AppForge</h1>
              <p className="text-lg text-muted-foreground">Build & Publish Apps</p>
            </div>
          </div>

          <div className="max-w-3xl mb-12">
            <img
              src="/assets/generated/builder-hero.dim_1600x900.png"
              alt="App Builder Platform"
              className="w-full rounded-2xl shadow-2xl border border-border"
            />
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Create. Build. Publish.
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            The easiest way to build and publish beautiful web apps. No coding required. Sign in to get started.
          </p>

          <div className="mb-16">
            <LoginButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-card-foreground">Fast & Easy</h3>
              <p className="text-sm text-muted-foreground">Build apps in minutes with our intuitive editor</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-card-foreground">Publish Instantly</h3>
              <p className="text-sm text-muted-foreground">Share your apps with the world in one click</p>
            </div>

            <div className="flex flex-col items-center p-6 rounded-xl bg-card border border-border shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Rocket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-card-foreground">Fully Decentralized</h3>
              <p className="text-sm text-muted-foreground">Built on the Internet Computer blockchain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
