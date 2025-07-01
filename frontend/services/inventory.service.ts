// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use server';

import { apiConfig } from '@/configs/api';
import { attachAuthApiFetch } from '@/lib/attach-auth-api-fetch';
import { List } from '@/types/common.type';
import {
  InventoryInstance,
  InventoryInstanceCreatePayload,
  InventoryInstanceDetail,
  InventoryInstanceFormData,
  InventoryInstanceRelation,
  InventoryInstanceRelationFormData,
  InventoryInstanceUpdatePayload,
  InventoryRelation,
  InventoryRelationFormData,
  InventorySchema,
  InventorySchemaFormData,
  InventoryInstanceRelationUpdatePayload,
} from '@/types/inventory.type';
import { revalidatePath, revalidateTag } from 'next/cache';

type ApiResponse<T> =
  | { success: true; result: T }
  | { success: false; errorMessage: string };

export async function getInventorySchemas(): Promise<
  ApiResponse<List<InventorySchema>>
> {
  try {
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/schemas`
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to fetch schemas:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to fetch schemas',
      };
    }

    const result = (await res.json()) as List<InventorySchema>;
    return { success: true, result };
  } catch (error) {
    console.error('Error fetching schemas:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getInventorySchema(
  schemaId: string
): Promise<ApiResponse<InventorySchema>> {
  try {
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/schemas/${schemaId}`
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to fetch schema:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to fetch schema',
      };
    }

    const result = (await res.json()) as InventorySchema;
    return { success: true, result };
  } catch (error) {
    console.error('Error fetching schema:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function createInventorySchema(
  formData: InventorySchemaFormData
): Promise<ApiResponse<InventorySchema>> {
  try {
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
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to create schema',
      };
    }

    revalidatePath('/schema', 'page');
    const result = (await res.json()) as InventorySchema;
    return { success: true, result };
  } catch (error) {
    console.error('Error creating schema:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateInventorySchema(
  schemaId: string,
  formData: InventorySchemaFormData
): Promise<ApiResponse<InventorySchema>> {
  try {
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
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to update schema',
      };
    }

    revalidatePath(`/schema/${schemaId}`, 'page');
    revalidatePath(`/schema`, 'page');
    const result = (await res.json()) as InventorySchema;
    return { success: true, result };
  } catch (error) {
    console.error('Error updating schema:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteInventorySchema(
  schemaId: string
): Promise<ApiResponse<void>> {
  try {
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/schemas/${schemaId}`,
      {
        method: 'DELETE',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to delete schema:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to delete schema',
      };
    }

    revalidatePath('/schema', 'page');
    return { success: true, result: undefined };
  } catch (error) {
    console.error('Error deleting schema:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getInventoryInstance(
  id: string
): Promise<ApiResponse<InventoryInstanceDetail>> {
  try {
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/instances/${id}`,
      {
        method: 'GET',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to fetch instance:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to fetch instance',
      };
    }

    const result = (await res.json()) as InventoryInstanceDetail;
    return { success: true, result };
  } catch (error) {
    console.error('Error fetching instance:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getInventoryInstances(
  searchParams?: string
): Promise<ApiResponse<List<InventoryInstance>>> {
  try {
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
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to fetch instances',
      };
    }

    const result = (await res.json()) as List<InventoryInstance>;
    return { success: true, result };
  } catch (error) {
    console.error('Error fetching instances:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function createInventoryInstance(
  schemaId: string,
  formData: InventoryInstanceFormData
): Promise<ApiResponse<InventoryInstance>> {
  try {
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
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to create instance',
      };
    }

    revalidatePath('/instance', 'page');
    const result = (await res.json()) as InventoryInstance;
    return { success: true, result };
  } catch (error) {
    console.error('Error creating instance:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateInventoryInstance(
  instanceId: string,
  formData: InventoryInstanceFormData
): Promise<ApiResponse<InventoryInstance>> {
  try {
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
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to update instance',
      };
    }

    revalidatePath('/instance', 'page');
    revalidatePath(`/instance/${instanceId}`, 'page');
    const result = (await res.json()) as InventoryInstance;
    return { success: true, result };
  } catch (error) {
    console.error('Error updating instance:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteInventoryInstance(
  instanceId: string
): Promise<ApiResponse<void>> {
  try {
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/instances/${instanceId}`,
      {
        method: 'DELETE',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to delete instance:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to delete instance',
      };
    }

    revalidatePath('/instance', 'page');
    return { success: true, result: undefined };
  } catch (error) {
    console.error('Error deleting instance:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

interface GetInventoryRelationsParams {
  source?: string;
  target?: string;
}

export async function createInventoryRelation(
  data: InventoryRelationFormData
): Promise<ApiResponse<InventoryRelation>> {
  try {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    );
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/relations`,
      {
        method: 'POST',
        body: payload,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to create relation:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to create relation',
      };
    }

    revalidateTag('inventory-relations');
    const result = (await res.json()) as InventoryRelation;
    return { success: true, result };
  } catch (error) {
    console.error('Error creating relation:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateInventoryRelation(
  id: string,
  data: Partial<InventoryRelationFormData>
): Promise<ApiResponse<InventoryRelation>> {
  try {
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    );

    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/relations/${id}`,
      {
        method: 'PATCH',
        body: payload,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to update relation:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to update relation',
      };
    }

    revalidateTag('inventory-relations');
    const result = (await res.json()) as InventoryRelation;
    return { success: true, result };
  } catch (error) {
    console.error('Error updating relation:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getInventoryRelations(
  params?: GetInventoryRelationsParams
): Promise<ApiResponse<List<InventoryRelation>>> {
  try {
    const searchParams = new URLSearchParams(
      params as Record<string, string> | undefined
    );

    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/relations${
        searchParams.size === 0 ? '' : `?${searchParams.toString()}`
      }`,
      {
        method: 'GET',
        next: {
          tags: ['inventory-relations'],
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to fetch relations:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to fetch relations',
      };
    }

    const result = (await res.json()) as List<InventoryRelation>;
    return { success: true, result };
  } catch (error) {
    console.error('Error fetching relations:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteInventoryRelation(
  id: string
): Promise<ApiResponse<void>> {
  try {
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/relations/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to delete relation:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to delete relation',
      };
    }

    revalidateTag('inventory-relations');
    return { success: true, result: undefined };
  } catch (error) {
    console.error('Error deleting relation:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getInventoryInstanceRelations(params?: {
  relation?: string;
  source?: string;
  target?: string;
}): Promise<ApiResponse<List<InventoryInstanceRelation>>> {
  try {
    const searchParams = new URLSearchParams(
      params as Record<string, string> | undefined
    );
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/instance-relations${
        searchParams.size === 0 ? '' : `?${searchParams.toString()}`
      }`,
      {
        method: 'GET',
        next: {
          tags: ['inventory-instance-relations'],
        },
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to get instance relations:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to get instance relations',
      };
    }

    const result = (await res.json()) as List<InventoryInstanceRelation>;
    return { success: true, result };
  } catch (error) {
    console.error('Error getting instance relations:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function createInventoryInstanceRelation(
  body: InventoryInstanceRelationFormData
): Promise<ApiResponse<InventoryInstanceRelation>> {
  try {
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/instance-relations`,
      {
        method: 'POST',
        body,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to create instance relation:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to create instance relation',
      };
    }

    revalidateTag('inventory-instance-relations');
    const result = (await res.json()) as InventoryInstanceRelation;
    return { success: true, result };
  } catch (error) {
    console.error('Error creating instance relation:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteInventoryInstanceRelation(
  id: string
): Promise<ApiResponse<void>> {
  try {
    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/instance-relations/${id}`,
      {
        method: 'DELETE',
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to delete instance relation:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to delete instance relation',
      };
    }

    revalidateTag('inventory-instance-relations');
    return { success: true, result: undefined };
  } catch (error) {
    console.error('Error deleting instance relation:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateInventoryInstanceRelation(
  id: string,
  body: InventoryInstanceRelationFormData
) {
  try {
    const payload: InventoryInstanceRelationUpdatePayload = {
      description: body.description,
      metadata: body.metadata,
    };

    const res = await attachAuthApiFetch(
      `${apiConfig.baseUrl}/inventory/instance-relations/${id}`,
      {
        method: 'PATCH',
        body: payload,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to update instance relation:', errorData);
      return {
        success: false,
        errorMessage: errorData.message || 'Failed to update instance relation',
      };
    }

    revalidateTag('inventory-instance-relations');
    return { success: true, result: undefined };
  } catch (error) {
    console.error('Error update instance relation:', error);
    return {
      success: false,
      errorMessage:
        error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
