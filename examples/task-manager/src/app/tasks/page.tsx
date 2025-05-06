import { Suspense } from 'react';
import { TaskCard } from '@/components/TaskCard';

export default function TaskListPage() {
  // TODO: Fetch and display list of entities
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">All Tasks</h1>
      <div className="grid gap-4">
        {/* Render entity cards here */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* Example: <TaskCard /> */}
        </Suspense>
      </div>
    </main>
  );
}