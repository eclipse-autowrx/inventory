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
import { deleteInventoryInstance } from '@/services/inventory.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TbLoader, TbTrash } from 'react-icons/tb';
import { toast } from 'react-toastify';

interface DeleteInstanceProps {
  instanceId: string;
}

export default function DeleteInstance({ instanceId }: DeleteInstanceProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (instanceId) {
      try {
        setLoading(true);
        const response = await deleteInventoryInstance(instanceId);
        if (!response.success) {
          throw new Error(response.errorMessage);
        }
        toast.success('Deleted instance successfully!');
        router.push('/instance');
      } catch (err: unknown) {
        toast.error((err as Error).message || 'Failed to delete instance.');
        setLoading(false);
      }
    }
  };
  return (
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
          Delete Instance
        </DaText>

        <DaText variant="small">
          This action cannot be undone and will delete instance with all
          associated data, including instance relations. Please proceed with
          caution.
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
          <DaButton disabled={loading} onClick={handleDelete} size="sm">
            {loading && <TbLoader className="mr-1 animate-spin" />}
            Delete
          </DaButton>
        </div>
      </div>
    </DaPopup>
  );
}
