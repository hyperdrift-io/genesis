

export interface User {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  // Add additional properties based on entity analysis
  
  
  
  
  
  
}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUser = Partial<User>;