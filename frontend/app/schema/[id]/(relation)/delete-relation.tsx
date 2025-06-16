'use client';

import { DaButton } from '@/components/atoms/DaButton';
import DaPopup from '@/components/atoms/DaPopup';
import DaText from '@/components/atoms/DaText';
import { withServerActionHandler } from '@/lib/server-action-utils';
import { deleteInventoryRelation } from '@/services/inventory.service';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { TbLoader, TbTrash } from 'react-icons/tb';

interface DeleteRelationProps {
  relationId: string;
  relationName?: string;
}

export default function DeleteRelation({
  relationId,
  relationName,
}: DeleteRelationProps) {
  const open = useState(false);

  const deleteRelationMutation = useMutation({
    mutationFn: async () => {
      const response = await withServerActionHandler(
        deleteInventoryRelation(relationId)
      );
      if (!response.success) {
        throw new Error(response.errorMessage);
      }
    },
    onSuccess() {
      open[1](false);
    },
    onError(error) {
      console.error('Failed to delete relation:', error);
    },
  });

  return (
    <DaPopup
      state={open}
      trigger={
        <DaButton size="sm" variant="destructive" className=" !px-2 !mx-1">
          <TbTrash className="mr-2" /> Delete
        </DaButton>
      }
    >
      <div className="w-[500px] flex flex-col gap-2 max-w-[90vw]">
        <DaText variant="sub-title" className="text-da-primary-500">
          Delete Relation &quot;{relationName || relationId}&quot;
        </DaText>

        <DaText variant="small">
          This action cannot be undone and will delete relation with all
          associated data, including: Instance Relations. Please proceed with
          caution.
        </DaText>

        <div className="mt-2 flex justify-end items-center gap-2">
          <DaButton
            onClick={() => open[1](false)}
            size="sm"
            variant="outline-nocolor"
            disabled={deleteRelationMutation.isPending}
          >
            Cancel
          </DaButton>
          <DaButton
            disabled={deleteRelationMutation.isPending}
            onClick={() => deleteRelationMutation.mutate()}
            size="sm"
          >
            {deleteRelationMutation.isPending && (
              <TbLoader className="mr-1 animate-spin" />
            )}
            Delete
          </DaButton>
        </div>
      </div>
    </DaPopup>
  );
}
