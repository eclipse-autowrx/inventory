'use server';

import { apiConfig } from '@/configs/api';
import { attachAuthApiFetch } from '@/lib/attach-auth-api-fetch';
import { List } from '@/types/common.type';
import {
  InventorySchema,
  InventorySchemaFormData,
} from '@/types/inventory.type';
import { revalidatePath } from 'next/cache';

export async function getInventorySchemas() {
  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/schemas`
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to fetch schemas:', errorData);
    throw new Error(errorData.message || 'Failed to fetch schemas');
  }

  return res.json() as Promise<List<InventorySchema>>;
}

export async function getInventorySchema(schemaId: string) {
  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/schemas/${schemaId}`
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to fetch schema:', errorData);
    throw new Error(errorData.message || 'Failed to fetch schema');
  }

  return res.json() as Promise<InventorySchema>;
}

export async function createInventorySchema(formData: InventorySchemaFormData) {
  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/schemas`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to create schema:', errorData);
    throw new Error(errorData.message || 'Failed to create schema');
  }

  revalidatePath('/schema', 'page');
  return res.json() as Promise<InventorySchema>;
}

export async function updateInventorySchema(
  schemaId: string,
  formData: InventorySchemaFormData
) {
  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/schemas/${schemaId}`,
    {
      method: 'PATCH',
      body: formData,
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to update schema:', errorData);
    throw new Error(errorData.message || 'Failed to update schema');
  }

  revalidatePath(`/schema/${schemaId}`, 'page');
  revalidatePath(`/schema`, 'page');
  return res.json() as Promise<InventorySchema>;
}

export async function deleteInventorySchema(schemaId: string) {
  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/schemas/${schemaId}`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to delete schema:', errorData);
    throw new Error(errorData.message || 'Failed to delete schema');
  }

  revalidatePath('/schema', 'page');
}
