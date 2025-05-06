

export interface Task {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Add additional properties based on entity analysis
  
  
  
  
  
  
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTask = Partial<Task>;