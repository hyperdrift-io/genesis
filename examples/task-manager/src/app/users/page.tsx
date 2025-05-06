import { Suspense } from 'react';
import UserListWrapper from '@/components/UserListWrapper';

export default function UsersPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="p-8 flex justify-center">Loading users...</div>}>
        <UserListWrapper />
      </Suspense>
    </main>
  );
}
