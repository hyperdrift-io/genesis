'use client';

import { User } from '../types/user';
import { supabase, getFromTable, getById, insertItem, updateItem, deleteItem, isSupabaseConfigured } from '../utils/supabase';

const TABLE_NAME = 'users';

/**
 * Get all users using Supabase
 */
export async function getAllUsers(): Promise<User[]> {
  try {
    return await getFromTable<User>(TABLE_NAME, {
      orderBy: {
        column: 'created_at',
        ascending: false
      }
    });
  } catch (error) {
    console.error('Failed to fetch users:', error);
    throw error;
  }
}

/**
 * Get a user by ID using Supabase
 */
export async function getUserById(id: string): Promise<User> {
  try {
    return await getById<User>(TABLE_NAME, id);
  } catch (error) {
    console.error(`Failed to fetch user with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Create a new user using Supabase
 */
export async function createUser(data: Partial<User>): Promise<User> {
  try {
    // Add timestamps
    const itemWithTimestamps = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    return await insertItem<User>(TABLE_NAME, itemWithTimestamps);
  } catch (error) {
    console.error('Failed to create user:', error);
    throw error;
  }
}

/**
 * Update a user using Supabase
 */
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
  try {
    // Update timestamp
    const updatedItem = {
      ...data,
      id,
      updated_at: new Date().toISOString()
    };

    return await updateItem<User>(TABLE_NAME, updatedItem);
  } catch (error) {
    console.error(`Failed to update user with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a user using Supabase
 */
export async function deleteUser(id: string): Promise<void> {
  try {
    await deleteItem(TABLE_NAME, id);
  } catch (error) {
    console.error(`Failed to delete user with ID ${id}:`, error);
    throw error;
  }
}

/**
 * Check if the table exists and create it if it doesn't
 * This is useful for development but should be replaced with proper migrations in production
 */
export async function ensureUserTableExists(): Promise<void> {
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