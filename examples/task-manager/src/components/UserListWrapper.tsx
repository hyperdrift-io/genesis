'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the UserList component in a client component
const UserList = dynamic(() => import('@/components/UserList'), {
  ssr: false,
  loading: () => <div className="p-8 flex justify-center">Loading users...</div>
});

export default function UserListWrapper() {
  return <UserList />;
}
