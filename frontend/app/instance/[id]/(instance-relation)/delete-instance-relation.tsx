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
import { deleteInventoryInstanceRelation } from '@/services/inventory.service';
import { InventoryInstanceRelation } from '@/types/inventory.type';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { TbLoader, TbTrash } from 'react-icons/tb';
import { toast } from 'react-toastify';

interface DeleteInstanceRelationProps {
  instanceRelation: InventoryInstanceRelation;
}

export default function DeleteInstanceRelation({
  instanceRelation,
}: DeleteInstanceRelationProps) {
  const open = useState(false);
  const deleteInstanceRelationMutation = useMutation({
    async mutationFn() {
      const response = await deleteInventoryInstanceRelation(
        instanceRelation.id
      );
      if (!response.success) {
        throw new Error(response.errorMessage);
      }
      return response.result;
    },
    onSuccess() {
      open[1](false);
    },
    onError(error) {
      console.error('Failed to delete instance relation:', error);
      toast.error(
        error.message || 'Failed to delete instance relation. Please try again.'
      );
    },
  });

  return (
    <DaPopup
      state={open}
      trigger={
        <DaButton size="sm" variant="destructive">
          <TbTrash size={16} />
        </DaButton>
      }
    >
      <div className="w-[500px] flex flex-col gap-2 max-w-[90vw]">
        <DaText variant="sub-title" className="text-da-primary-500">
          Delete Instance Relationship &quot;{instanceRelation.source.name}
          &quot;-&quot;{instanceRelation.target.name}&quot;
        </DaText>

        <DaText variant="small">
          This action cannot be undone. Please proceed with caution.
        </DaText>

        <div className="mt-2 flex justify-end items-center gap-2">
          <DaButton
            onClick={() => open[1](false)}
            size="sm"
            variant="outline-nocolor"
            disabled={deleteInstanceRelationMutation.isPending}
          >
            Cancel
          </DaButton>
          <DaButton
            disabled={deleteInstanceRelationMutation.isPending}
            onClick={() => deleteInstanceRelationMutation.mutate()}
            size="sm"
          >
            {deleteInstanceRelationMutation.isPending && (
              <TbLoader className="mr-1 animate-spin" />
            )}
            Delete
          </DaButton>
        </div>
      </div>
    </DaPopup>
  );
}
