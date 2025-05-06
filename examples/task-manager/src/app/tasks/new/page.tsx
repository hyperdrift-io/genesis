import { TaskForm } from '@/components/TaskForm';

export default function NewTaskPage() {
  // TODO: Implement entity creation logic
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Create New Task</h1>
      <TaskForm />
    </main>
  );
}