'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import UserForm from '@/components/UserForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewUserPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = () => {
    setIsSubmitting(false);
    router.push('/users');
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/users">
          <Button variant="ghost" className="flex items-center gap-1 -ml-3">
            <ArrowLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </Link>
      </div>

      <div className="max-w-2xl mx-auto">
        <UserForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
}
