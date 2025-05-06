'use client';



import { User } from '@/types/user';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/userStore';
import { useState } from 'react';

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const router = useRouter();
  const { deleteUser } = useUserStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm('Are you sure you want to delete this user?')) {
      setIsDeleting(true);
      try {
        await deleteUser(user.id);
        // No need to navigate as the store will update the UI
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="line-clamp-1">user.name</CardTitle>
        <CardDescription className="line-clamp-2">
          user.description || 'No description provided'
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Created: {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <p className="text-sm text-gray-500">
          Updated: {new Date(user.updatedAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/users/user.id`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Link href={`/users/user.id/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-1"
          >
            <Trash2 className="h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}