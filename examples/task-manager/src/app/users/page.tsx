import { Suspense } from 'react';
import { UserCard } from '@/components/UserCard';

export default function UserListPage() {
  // TODO: Fetch and display list of entities
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">All Users</h1>
      <div className="grid gap-4">
        {/* Render entity cards here */}
        <Suspense fallback={<div>Loading...</div>}>
          {/* Example: <UserCard /> */}
        </Suspense>
      </div>
    </main>
  );
}