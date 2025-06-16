'use client';

import { DaButton } from '@/components/atoms/DaButton';
import DaPopup from '@/components/atoms/DaPopup';
import DaText from '@/components/atoms/DaText';
import { deleteInventorySchema } from '@/services/inventory.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { TbLoader, TbTrash } from 'react-icons/tb';
import { toast } from 'react-toastify';

interface SchemaActionsProps {
  schemaId: string;
}

export default function DeleteSchema({ schemaId }: SchemaActionsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (schemaId) {
      try {
        setLoading(true);
        const response = await deleteInventorySchema(schemaId);
        if (!response.success) {
          throw new Error(response.errorMessage);
        }
        toast.success('Deleted schema successfully!');
        router.push('/schema');
      } catch (err: unknown) {
        toast.error((err as Error).message || 'Failed to delete schema.');
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
          className="!text-da-destructive ml-2"
          variant="destructive"
        >
          <TbTrash size={18} className="mr-1" /> Delete
        </DaButton>
      }
    >
      <div className="w-[500px] flex flex-col gap-2 max-w-[90vw]">
        <DaText variant="sub-title" className="text-da-primary-500">
          Delete Schema
        </DaText>

        <DaText variant="small">
          This action cannot be undone and will delete schema with all
          associated data, including: instances, relations and instance
          relations. Please proceed with caution.
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
