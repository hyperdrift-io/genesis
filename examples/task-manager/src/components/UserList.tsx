'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { User } from '@/types/user';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, UserPlus } from 'lucide-react';
import Link from 'next/link';

export default function UserList() {
  const { users, fetchUsers, isLoading } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-gray-500">Manage team members</p>
        </div>
        <Link href="/users/new">
          <Button className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            New User
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center p-10 border border-dashed rounded-lg">
          <p className="text-gray-500">No users found. Create a new user to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}

function UserCard({ user }: { user: User }) {
  const initials = user.name
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="bg-primary text-white">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">{user.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {user.description && (
          <p className="text-sm text-gray-500 mb-4">{user.description}</p>
        )}
        <div className="flex justify-end">
          <Link href={`/users/${user.id}`}>
            <Button variant="outline" size="sm">View Profile</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
