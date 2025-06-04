'use server';

import { apiConfig } from '@/configs/api';
import { attachAuthApiFetch } from '@/lib/attach-auth-api-fetch';
import { List } from '@/types/common.type';
import {
  InventoryInstance,
  InventoryInstanceCreatePayload,
  InventoryInstanceDetail,
  InventoryInstanceFormData,
  InventoryInstanceUpdatePayload,
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

export async function getInventoryInstance(id: string) {
  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/instances/${id}`,
    {
      method: 'GET',
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to fetch instance:', errorData);
    throw new Error(errorData.message || 'Failed to fetch instance');
  }

  return res.json() as Promise<InventoryInstanceDetail>;
}

export async function getInventoryInstances(searchParams?: string) {
  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/instances${
      searchParams ? `?${searchParams}` : ''
    }`,
    {
      method: 'GET',
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to fetch instances:', errorData);
    throw new Error(errorData.message || 'Failed to fetch instances');
  }

  return res.json() as Promise<List<InventoryInstance>>;
}

export async function createInventoryInstance(
  schemaId: string,
  formData: InventoryInstanceFormData
) {
  const payload: InventoryInstanceCreatePayload = {
    ...formData,
    data: JSON.stringify(formData.data),
    schema: schemaId,
  };

  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/instances`,
    {
      method: 'POST',
      body: payload,
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to create instance:', errorData);
    throw new Error(errorData.message || 'Failed to create instance');
  }

  revalidatePath('/instance', 'page');
  return res.json() as Promise<InventoryInstance>;
}

export async function updateInventoryInstance(
  instanceId: string,
  formData: InventoryInstanceFormData
) {
  const payload: InventoryInstanceUpdatePayload = {
    ...formData,
    ...(formData.data && {
      data: JSON.stringify(formData.data),
    }),
  };

  if (!payload.data) {
    delete payload.data;
  }

  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/instances/${instanceId}`,
    {
      method: 'PATCH',
      body: payload,
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to update instance:', errorData);
    throw new Error(errorData.message || 'Failed to update instance');
  }

  revalidatePath('/instance', 'page');
  revalidatePath(`/instance/${instanceId}`, 'page');
  return res.json() as Promise<InventoryInstance>;
}

export async function deleteInventoryInstance(instanceId: string) {
  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/instances/${instanceId}`,
    {
      method: 'DELETE',
    }
  );

  if (!res.ok) {
    const errorData = await res.json();
    console.error('Failed to delete instance:', errorData);
    throw new Error(errorData.message || 'Failed to delete instance');
  }

  revalidatePath('/inventory/instance', 'page');
}
