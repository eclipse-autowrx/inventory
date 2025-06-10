'use client';

import { DaButton } from '@/components/atoms/DaButton';
import { DaInput } from '@/components/atoms/DaInput';
import DaText from '@/components/atoms/DaText';
import { DaTextarea } from '@/components/atoms/DaTextarea';
import { InventoryRelation } from '@/types/inventory.type';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbPlus } from 'react-icons/tb';

interface InstanceRelationFormProps {
  relation: InventoryRelation;
  className?: string;
}

export default function InstanceRelationForm({
  relation,
  className,
}: InstanceRelationFormProps) {
  const [showForm, setShowForm] = useState(false);
  const {} = useForm({
    defaultValues: {},
  });

  return (
    <div className={className}>
      <div className="flex">
        <DaButton
          variant="outline-nocolor"
          size="sm"
          className="ml-auto"
          onClick={() => setShowForm(true)}
        >
          <TbPlus className="mr-1" /> Add Element
        </DaButton>
      </div>

      {showForm && (
        <form
          className="mt-6"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="rounded-xl border p-6">
            <DaText variant="regular-bold">
              Add Element of type {relation.target.name}
            </DaText>

            <div className="mt-7">
              <DaText variant="small-bold">Select Element *</DaText>
              <DaInput
                className="mt-2"
                placeholder="Select Element..."
                inputClassName="text-sm"
              />
            </div>

            <div className="mt-7">
              <DaText variant="small-bold">Description</DaText>
              <DaTextarea
                className="mt-2"
                placeholder="Enter Description..."
                textareaClassName="!text-sm !border-da-gray-light"
              />
            </div>

            <div className="mt-7">
              <DaText variant="small-bold">Metadata</DaText>
              <DaTextarea
                className="mt-2"
                placeholder="Enter Metadata..."
                textareaClassName="!text-sm !border-da-gray-light"
              />
            </div>

            <div className="mt-7 mb-2 flex justify-end gap-3">
              <DaButton
                onClick={() => setShowForm(false)}
                className="!text-sm"
                variant="outline-nocolor"
              >
                Cancel
              </DaButton>
              <DaButton
                onClick={() => setShowForm(false)}
                className="!text-sm"
                variant="outline-nocolor"
              >
                Save & Add New Element
              </DaButton>
              <DaButton onClick={() => setShowForm(false)} className="!text-sm">
                Save
              </DaButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
