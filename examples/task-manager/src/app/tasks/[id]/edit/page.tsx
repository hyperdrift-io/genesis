'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTaskStore } from '@/store/taskStore';
import TaskForm from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchTaskById, selectedTask, isLoading, error } = useTaskStore();
  const taskId = params.id as string;

  useEffect(() => {
    fetchTaskById(taskId);
  }, [fetchTaskById, taskId]);

  const handleSuccess = () => {
    router.push(`/tasks/${taskId}`);
  };

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
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

        <div className="max-w-2xl mx-auto p-4 border border-red-300 rounded bg-red-50 text-red-800">
          <p>{error || 'Task not found'}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => router.push('/tasks')}
          >
            Return to Tasks
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href={`/tasks/${taskId}`}>
          <Button variant="ghost" className="flex items-center gap-1 -ml-3">
            <ArrowLeft className="h-4 w-4" />
            Back to Task
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <TaskForm initialData={selectedTask} onSuccess={handleSuccess} />
      </div>
    </main>
  );
}
