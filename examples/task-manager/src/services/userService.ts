'use client';

import { User } from '../types/user';

// Local storage key
const STORAGE_KEY = 'users';

/**
 * Get all users from local storage
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    // In client component, we can use localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}

/**
 * Get a user by ID from local storage
 */
export async function getUserById(id: string): Promise<User> {
  try {
    if (typeof window !== 'undefined') {
      const items = await getAllUsers();
      const item = items.find(item => item.id === id);

      if (!item) {
        throw new Error(`User with ID ${id} not found`);
      }

      return item;
    }
    throw new Error('Cannot access localStorage (not in browser)');
  } catch (error) {
    console.error(`Failed to fetch user with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new user in local storage
 */
export async function createUser(data: Partial<User>): Promise<User> {
  try {
    if (typeof window !== 'undefined') {
      const items = await getAllUsers();
      const newItem: User = {
        id: crypto.randomUUID(),
        name: data.name || '',
        description: data.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      } as User;

      items.push(newItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

      return newItem;
    }
    throw new Error('Cannot access localStorage (not in browser)');
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

/**
 * Update a user in local storage
 */
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  try {
    if (typeof window !== 'undefined') {
      const items = await getAllUsers();
      const index = items.findIndex(item => item.id === id);

      if (index === -1) {
        throw new Error(`User with ID ${id} not found`);
      }

      const updatedItem = {
        ...items[index],
        ...data,
        updatedAt: new Date().toISOString()
      };

      items[index] = updatedItem;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

      return updatedItem;
    }
    throw new Error('Cannot access localStorage (not in browser)');
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a user from local storage
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      const items = await getAllUsers();
      const filteredItems = items.filter(item => item.id !== id);

      if (filteredItems.length === items.length) {
        throw new Error(`User with ID ${id} not found`);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
    } else {
      throw new Error('Cannot access localStorage (not in browser)');
    }
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error);
    throw error;
  }
}

// This comment is a marker for Cursor rules to replace with Supabase implementation
// CURSOR_RULE: REPLACE_WITH_SUPABASE when persistence is needed