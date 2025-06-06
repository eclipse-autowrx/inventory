'use client';

import { DaButton } from '@/components/atoms/DaButton';
import DaPopup from '@/components/atoms/DaPopup';
import DaText from '@/components/atoms/DaText';
import { useState } from 'react';
import { TbLoader, TbTrash } from 'react-icons/tb';

export default function DeleteRelation() {
  const [loading, setLoading] = useState(false);
  const open = useState(false);

  const handleDelete = () => {
    setLoading(true);
  };
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
          Delete Relation
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
