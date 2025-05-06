'use client';

import { Task } from '../types/task';

// Local storage key
const STORAGE_KEY = 'tasks';

/**
 * Get all tasks from local storage
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    // In client component, we can use localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}

/**
 * Get a task by ID from local storage
 */
export async function getTaskById(id: string): Promise<Task> {
  try {
    if (typeof window !== 'undefined') {
      const items = await getAllTasks();
      const item = items.find(item => item.id === id);

      if (!item) {
        throw new Error(`Task with ID ${id} not found`);
      }

      return item;
    }
    throw new Error('Cannot access localStorage (not in browser)');
  } catch (error) {
    console.error(`Failed to fetch task with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new task in local storage
 */
export async function createTask(data: Partial<Task>): Promise<Task> {
  try {
    if (typeof window !== 'undefined') {
      const items = await getAllTasks();
      const newItem: Task = {
        id: crypto.randomUUID(),
        name: data.name || '',
        description: data.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...data
      } as Task;

      items.push(newItem);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

      return newItem;
    }
    throw new Error('Cannot access localStorage (not in browser)');
  } catch (error) {
    console.error('Failed to create task:', error);
    throw error;
  }
}

/**
 * Update a task in local storage
 */
export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  try {
    if (typeof window !== 'undefined') {
      const items = await getAllTasks();
      const index = items.findIndex(item => item.id === id);

      if (index === -1) {
        throw new Error(`Task with ID ${id} not found`);
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
    console.error(`Failed to update task with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a task from local storage
 */
export async function deleteTask(id: string): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      const items = await getAllTasks();
      const filteredItems = items.filter(item => item.id !== id);

      if (filteredItems.length === items.length) {
        throw new Error(`Task with ID ${id} not found`);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredItems));
    } else {
      throw new Error('Cannot access localStorage (not in browser)');
    }
  } catch (error) {
    console.error(`Failed to delete task with ID ${id}:`, error);
    throw error;
  }
}

// This comment is a marker for Cursor rules to replace with Supabase implementation
// CURSOR_RULE: REPLACE_WITH_SUPABASE when persistence is needed