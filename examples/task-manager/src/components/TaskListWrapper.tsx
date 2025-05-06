'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the TaskList component in a client component
const TaskList = dynamic(() => import('@/components/TaskList'), {
  ssr: false,
  loading: () => <div className="p-8 flex justify-center">Loading tasks...</div>
});

export default function TaskListWrapper() {
  return <TaskList />;
}
