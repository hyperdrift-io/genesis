'use client';

import { Task } from '../types/task';
import { supabase, getFromTable, getById, insertItem, updateItem, deleteItem, isSupabaseConfigured } from '../utils/supabase';

const TABLE_NAME = 'tasks';

/**
 * Get all tasks using Supabase
 */
export async function getAllTasks(): Promise<Task[]> {
  try {
    return await getFromTable<Task>(TABLE_NAME, {
      orderBy: {
        column: 'created_at',
        ascending: false
      }
    });
  } catch (error) {
    console.error('Failed to fetch tasks:', error);
    throw error;
  }
}

/**
 * Get a task by ID using Supabase
 */
export async function getTaskById(id: string): Promise<Task> {
  try {
    return await getById<Task>(TABLE_NAME, id);
  } catch (error) {
    console.error(`Failed to fetch task with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new task using Supabase
 */
export async function createTask(data: Partial<Task>): Promise<Task> {
  try {
    // Add timestamps
    const itemWithTimestamps = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await insertItem<Task>(TABLE_NAME, itemWithTimestamps);
  } catch (error) {
    console.error('Failed to create task:', error);
    throw error;
  }
}

/**
 * Update a task using Supabase
 */
export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
  try {
    // Update timestamp
    const updatedItem = {
      ...data,
      id,
      updated_at: new Date().toISOString()
    };

    return await updateItem<Task>(TABLE_NAME, updatedItem);
  } catch (error) {
    console.error(`Failed to update task with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a task using Supabase
 */
export async function deleteTask(id: string): Promise<void> {
  try {
    await deleteItem(TABLE_NAME, id);
  } catch (error) {
    console.error(`Failed to delete task with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Check if the table exists and create it if it doesn't
 * This is useful for development but should be replaced with proper migrations in production
 */
export async function ensureTaskTableExists(): Promise<void> {
  // Only attempt if Supabase is properly configured
  if (!isSupabaseConfigured()) {
    console.log(`Supabase not configured - skipping ${TABLE_NAME} table creation check`);
    return;
  }

  const { error } = await supabase
    .from(TABLE_NAME)
    .select('id')
    .limit(1);

  if (error && error.code === '42P01') { // Table doesn't exist
    console.log(`${TABLE_NAME} table doesn't exist. Creating it...`);

    // Note: This is a simplified example. In a real app, use proper migrations.
    const { error: createError } = await supabase.rpc(`create_${TABLE_NAME}_table`);

    if (createError) {
      console.error(`Failed to create ${TABLE_NAME} table:`, createError);
    } else {
      console.log(`${TABLE_NAME} table created successfully`);
    }
  }
}