'use client';

import { Task } from '@/types/task';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTaskStore } from '@/store/taskStore';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const router = useRouter();
  const { deleteTask } = useTaskStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTask(task.id);
        // No need to navigate as the store will update the UI
      } catch (error) {
        console.error('Failed to delete task:', error);
        alert('Failed to delete task');
        setIsDeleting(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'todo': return 'bg-slate-500';
      case 'in-progress': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      default: return 'bg-slate-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="line-clamp-1">{task.name}</CardTitle>
          <div className="flex gap-2">
            <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
            <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
          </div>
        </div>
        <CardDescription className="line-clamp-2">
          {task.description || 'No description provided'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {task.assignedToName && (
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-1" />
            <span>Assigned to: {task.assignedToName}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1" />
            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
        <p className="text-xs text-gray-400">
          Created by {task.createdByName} {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link href={`/tasks/${task.id}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </Link>
        <div className="flex space-x-2">
          <Link href={`/tasks/${task.id}/edit`}>
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
