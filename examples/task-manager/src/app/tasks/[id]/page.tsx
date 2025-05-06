'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTaskStore } from '@/store/taskStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Trash2, User, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchTaskById, selectedTask, isLoading, error, deleteTask } = useTaskStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const taskId = params.id as string;

  useEffect(() => {
    fetchTaskById(taskId);
  }, [fetchTaskById, taskId]);

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTask(taskId);
        router.push('/tasks');
      } catch (error) {
        console.error('Failed to delete task:', error);
        setIsDeleting(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </main>
    );
  }

  if (error || !selectedTask) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/tasks">
            <Button variant="ghost" className="flex items-center gap-1 -ml-3">
              <ArrowLeft className="h-4 w-4" />
              Back to Tasks
            </Button>
          </Link>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="flex items-center justify-center text-red-500 h-40 flex-col gap-4">
              <AlertCircle className="h-10 w-10" />
              <p>{error || 'Task not found'}</p>
              <Button variant="outline" onClick={() => router.push('/tasks')}>
                Return to Tasks
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/tasks">
          <Button variant="ghost" className="flex items-center gap-1 -ml-3">
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start mb-4">
              <div>
                <CardTitle className="text-2xl">{selectedTask.name}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Badge className={getStatusColor(selectedTask.status)}>{selectedTask.status}</Badge>
                <Badge className={getPriorityColor(selectedTask.priority)}>{selectedTask.priority}</Badge>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Link href={`/tasks/${taskId}/edit`}>
                <Button variant="outline" className="flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
              </Link>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="font-medium mb-2">Description</h3>
              <p className="text-gray-700 whitespace-pre-line">
                {selectedTask.description || 'No description provided'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-4">
              <div>
                <h3 className="font-medium mb-2">Details</h3>
                <div className="space-y-2">
                  {selectedTask.assignedToName && (
                    <div className="flex items-center text-sm text-gray-700">
                      <User className="h-4 w-4 mr-2" />
                      <span>Assigned to: {selectedTask.assignedToName}</span>
                    </div>
                  )}
                  {selectedTask.dueDate && (
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Due: {new Date(selectedTask.dueDate).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Activity</h3>
                <div className="text-sm text-gray-700">
                  <p>Created by: {selectedTask.createdByName}</p>
                  <p>Created: {new Date(selectedTask.createdAt).toLocaleString()}</p>
                  <p>Last updated: {new Date(selectedTask.updatedAt).toLocaleString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
