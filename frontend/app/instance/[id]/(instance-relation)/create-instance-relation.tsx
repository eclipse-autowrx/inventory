'use client';

import { InventoryRelation } from '@/types/inventory.type';
import InstanceRelationForm from './instance-relation-form';
import { DaButton } from '@/components/atoms/DaButton';
import { TbPlus } from 'react-icons/tb';
import { useState } from 'react';

interface CreateInstanceRelationProps {
  instanceId: string;
  excludedInstanceIds: Set<string>;
  relation: InventoryRelation;
}

export default function CreateInstanceRelation({
  instanceId,
  excludedInstanceIds,
  relation,
}: CreateInstanceRelationProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="w-full flex -mt-7 items-end flex-col">
      <DaButton
        onClick={() => setShowForm(true)}
        size="sm"
        variant="outline-nocolor"
        className="w-fit"
      >
        <TbPlus className="mr-1" /> Add Element
      </DaButton>
      <div className="w-full">
        {showForm && (
          <InstanceRelationForm
            onFormClose={() => setShowForm(false)}
            currentInstanceId={instanceId}
            className="-mt-6"
            excludedInstanceIds={excludedInstanceIds}
            relation={relation}
          />
        )}
      </div>
    </div>
  );
}
