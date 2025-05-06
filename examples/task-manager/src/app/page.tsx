import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Users, PlusCircle, List } from 'lucide-react';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Task Manager</h1>
        <p className="text-xl text-gray-600 mb-8">A simple task management app to organize your work</p>

        <div className="flex justify-center gap-4">
          <Link href="/tasks">
            <Button className="flex items-center gap-2">
              <List className="h-5 w-5" />
              View All Tasks
            </Button>
          </Link>
          <Link href="/tasks/new">
            <Button variant="outline" className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5" />
              Create New Task
            </Button>
          </Link>
        </div>
      </section>

      <section>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <CardTitle>Task Management</CardTitle>
              </div>
              <CardDescription>Create and manage tasks with status tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Easily create tasks, set priorities, due dates, and track progress with status updates.</p>
              <Link href="/tasks">
                <Button variant="secondary" size="sm" className="w-full">Manage Tasks</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-500" />
                <CardTitle>Task Assignment</CardTitle>
              </div>
              <CardDescription>Assign tasks to team members</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Assign tasks to specific team members and track who is responsible for each item.</p>
              <Link href="/users">
                <Button variant="secondary" size="sm" className="w-full">Manage Users</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <List className="h-6 w-6 text-purple-500" />
                <CardTitle>Progress Tracking</CardTitle>
              </div>
              <CardDescription>Keep track of task progress</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Monitor task progress with status updates and prioritize your work effectively.</p>
              <Link href="/tasks">
                <Button variant="secondary" size="sm" className="w-full">View Dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
