import { Suspense } from 'react';
import { TaskCard } from '@/components/TaskCard';

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  // TODO: Fetch and display entity details by ID
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Task Details</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Example: <TaskCard id={params.id} /> */}
      </Suspense>
    </main>
  );
}