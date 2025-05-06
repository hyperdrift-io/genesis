export interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignedToId?: string;
  assignedToName?: string;
  createdById: string;
  createdByName: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  // Add additional properties based on entity analysis






}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTask = Partial<Task>;
