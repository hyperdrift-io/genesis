export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: 'admin' | 'manager' | 'member';
  description?: string;
  department?: string;
  createdAt: string;
  updatedAt: string;
  // Add additional properties based on entity analysis






}

export type NewUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateUser = Partial<User>;
