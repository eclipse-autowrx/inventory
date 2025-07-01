// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use client';

import { DaButton } from '@/components/atoms/DaButton';
import DaPopup from '@/components/atoms/DaPopup';
import DaText from '@/components/atoms/DaText';
import { deleteInventorySchema } from '@/services/inventory.service';
import { InventorySchema } from '@/types/inventory.type';
import Link from 'next/link';
import { useState } from 'react';
import { TbEdit, TbEye, TbLoader, TbTrash } from 'react-icons/tb';
import { toast } from 'react-toastify';

type SchemaItemProps = {
  schema: InventorySchema;
  currentUserId?: string;
};

export default function SchemaItem({ schema, currentUserId }: SchemaItemProps) {
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = async (schemaId: string) => {
    try {
      setLoading(true);
      const response = await deleteInventorySchema(schemaId);
      if (!response.success) {
        throw new Error(response.errorMessage);
      }
      toast.success('Deleted schema successfully!');
    } catch (err: unknown) {
      toast.error((err as Error).message || 'Failed to delete schema.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <tr key={schema.id} className="hover:bg-da-gray-light">
      <td className="px-5 py-2 border-b border-da-gray-light bg-white text-sm">
        <Link
          href={`/schema/${schema.id}`}
          className="text-da-primary-500 hover:underline"
        >
          {schema.name}
        </Link>
      </td>
      <td className="px-5 py-2 border-b border-da-gray-light bg-white text-sm">
        {schema.description || '-'}
      </td>
      <td className="px-5 py-2 border-b border-da-gray-light bg-white text-sm whitespace-nowrap">
        <Link
          href={`/schema/${schema.id}`}
          className="text-gray-600 hover:text-gray-900"
          title="View Details"
        >
          <DaButton size="sm" variant="plain">
            <TbEye className="mr-1" size={16} />
            View
          </DaButton>
        </Link>

        {currentUserId === schema.created_by?.id && (
          <>
            <Link
              href={`/schema/${schema.id}/edit`}
              className="text-indigo-600 hover:text-indigo-900"
              title="Edit Schema"
            >
              <DaButton size="sm" variant="plain">
                <TbEdit className="mr-1" size={16} />
                Edit
              </DaButton>
            </Link>

            <DaPopup
              state={[showDeleteConfirm, setShowDeleteConfirm]}
              trigger={
                <DaButton
                  size="sm"
                  className="!text-da-destructive"
                  variant="destructive"
                >
                  <TbTrash size={18} className="mr-1" /> Delete
                </DaButton>
              }
            >
              <div className="w-[500px] flex flex-col gap-2 max-w-[90vw]">
                <DaText variant="sub-title" className="text-da-primary-500">
                  Delete Schema &quot;{schema.name}&quot;
                </DaText>

                <DaText variant="small">
                  This action cannot be undone and will delete schema &quot;
                  {schema.name}&quot; with all associated data, including:
                  instances, relations and instance relations. Please proceed
                  with caution.
                </DaText>

                <div className="mt-2 flex justify-end items-center gap-2">
                  <DaButton
                    onClick={() => setShowDeleteConfirm(false)}
                    size="sm"
                    variant="outline-nocolor"
                    disabled={loading}
                  >
                    Cancel
                  </DaButton>
                  <DaButton
                    disabled={loading}
                    onClick={() => handleDelete(schema.id)}
                    size="sm"
                  >
                    {loading && <TbLoader className="mr-1 animate-spin" />}
                    Delete
                  </DaButton>
                </div>
              </div>
            </DaPopup>
          </>
        )}
      </td>
    </tr>
  );
}
