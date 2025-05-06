import { Suspense } from 'react';
import { UserCard } from '@/components/UserCard';

export default function UserDetailPage({ params }: { params: { id: string } }) {
  // TODO: Fetch and display entity details by ID
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">User Details</h1>
      <Suspense fallback={<div>Loading...</div>}>
        {/* Example: <UserCard id={params.id} /> */}
      </Suspense>
    </main>
  );
}