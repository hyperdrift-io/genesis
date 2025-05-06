import { Suspense } from 'react';
import TaskListWrapper from '@/components/TaskListWrapper';

export default function TaskListPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="p-8 flex justify-center">Loading tasks...</div>}>
        <TaskListWrapper />
      </Suspense>
    </main>
  );
}
