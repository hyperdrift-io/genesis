import { UserForm } from '@/components/UserForm';

export default function NewUserPage() {
  // TODO: Implement entity creation logic
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Create New User</h1>
      <UserForm />
    </main>
  );
}