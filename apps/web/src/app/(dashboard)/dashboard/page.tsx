'use client';

import { DashboardLayout } from '@/components/layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';
import { FileText, Kanban, MessageSquare, Users, TrendingUp, Clock } from 'lucide-react';

const stats = [
  { name: 'Documents', value: '12', icon: FileText, change: '+2 this week', color: 'from-blue-500 to-cyan-500' },
  { name: 'Boards', value: '4', icon: Kanban, change: '+1 this week', color: 'from-purple-500 to-pink-500' },
  { name: 'Messages', value: '156', icon: MessageSquare, change: '+23 today', color: 'from-green-500 to-emerald-500' },
  { name: 'Team Members', value: '8', icon: Users, change: '+2 this month', color: 'from-orange-500 to-amber-500' },
];

const recentActivity = [
  { id: 1, action: 'Created new document', item: 'Project Roadmap Q1', time: '2 hours ago', icon: FileText },
  { id: 2, action: 'Moved card', item: 'Fix login bug', time: '4 hours ago', icon: Kanban },
  { id: 3, action: 'Sent message in', item: '#general', time: '5 hours ago', icon: MessageSquare },
  { id: 4, action: 'Updated document', item: 'API Documentation', time: 'Yesterday', icon: FileText },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 mt-1">Welcome back! Here&apos;s what&apos;s happening in your workspace.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400">{stat.name}</p>
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                  <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              {/* Gradient accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-800/50 transition-colors"
                >
                  <div className="h-10 w-10 rounded-lg bg-slate-800 flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-slate-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      {activity.action}{' '}
                      <span className="text-indigo-400 font-medium">{activity.item}</span>
                    </p>
                    <p className="text-xs text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-left">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">New Document</p>
                <p className="text-xs text-slate-500">Create a new document</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-left">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Kanban className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">New Board</p>
                <p className="text-xs text-slate-500">Create a kanban board</p>
              </div>
            </button>

            <button className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors text-left">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Invite Team</p>
                <p className="text-xs text-slate-500">Add team members</p>
              </div>
            </button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
