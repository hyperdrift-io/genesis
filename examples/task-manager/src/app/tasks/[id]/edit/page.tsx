import { TaskForm } from '@/components/TaskForm';

export default function EditTaskPage({ params }: { params: { id: string } }) {
  // TODO: Implement entity edit logic
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit Task</h1>
      <TaskForm id={params.id} />
    </main>
  );
}