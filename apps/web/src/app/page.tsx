'use client';

import Link from 'next/link';
import { Button } from '@/components/ui';
import { 
  FileText, 
  Kanban, 
  MessageSquare, 
  Video, 
  Users, 
  Shield,
  ArrowRight,
  Zap,
  Globe
} from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Real-time Documents',
    description: 'Collaborate on documents with your team in real-time, just like Google Docs.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Kanban,
    title: 'Kanban Boards',
    description: 'Organize tasks with drag-and-drop boards like Trello.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: MessageSquare,
    title: 'Team Chat',
    description: 'Instant messaging with channels, threads, and direct messages.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Video,
    title: 'Video Calling',
    description: 'Face-to-face meetings with screen sharing and group calls.',
    color: 'from-orange-500 to-amber-500',
  },
  {
    icon: Users,
    title: 'Team Workspaces',
    description: 'Create workspaces for different teams and projects.',
    color: 'from-red-500 to-rose-500',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    description: 'Enterprise-grade security with role-based access control.',
    color: 'from-indigo-500 to-violet-500',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">CB</span>
          </div>
          <span className="text-xl font-semibold text-white">CollabBoard</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost">Sign in</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm mb-8">
          <Zap className="h-4 w-4" />
          Built with Next.js, Express & Socket.IO
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          The All-in-One
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Collaboration Platform
          </span>
        </h1>

        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
          Documents, Kanban boards, real-time chat, and video calling - all in one place.
          Built for modern teams who want to work smarter.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start for Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="gap-2">
              <Globe className="h-5 w-5" />
              View Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything you need to collaborate
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            One platform with all the tools your team needs to work together effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-slate-800/30 border border-slate-700/50 hover:border-slate-600/50 transition-all hover:-translate-y-1"
            >
              <div className={`inline-flex h-12 w-12 rounded-xl bg-gradient-to-br ${feature.color} items-center justify-center mb-4`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 max-w-7xl mx-auto">
        <div className="rounded-2xl bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform how your team works?
          </h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-8">
            Join thousands of teams already using CollabBoard to collaborate better.
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">CB</span>
            </div>
            <span className="text-white font-medium">CollabBoard</span>
          </div>
          <p className="text-slate-500 text-sm">
            © 2026 CollabBoard. Built by Sambu Sairaju.
          </p>
        </div>
      </footer>
    </div>
  );
}
