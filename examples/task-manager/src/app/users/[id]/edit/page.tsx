import { UserForm } from '@/components/UserForm';

export default function EditUserPage({ params }: { params: { id: string } }) {
  // TODO: Implement entity edit logic
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Edit User</h1>
      <UserForm id={params.id} />
    </main>
  );
}