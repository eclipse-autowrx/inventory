'use client';

import { DaButton } from '@/components/atoms/DaButton';
import DaText from '@/components/atoms/DaText';
import { DaTextarea } from '@/components/atoms/DaTextarea';
import { createInventoryInstanceRelation } from '@/services/inventory.service';
import {
  InventoryInstanceRelationFormData,
  InventoryRelation,
} from '@/types/inventory.type';
import { useMutation } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { TbLoader, TbPlus } from 'react-icons/tb';
import InstanceCombobox from './instance-combobox';

interface InstanceRelationFormProps {
  currentInstanceId: string;
  relation: InventoryRelation;
  className?: string;
  excludedInstanceIds?: Set<string>;
}

export default function InstanceRelationForm({
  currentInstanceId,
  relation,
  className,
  excludedInstanceIds,
}: InstanceRelationFormProps) {
  const [showForm, setShowForm] = useState(false);
  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm<InventoryInstanceRelationFormData>({
    defaultValues: {
      source: currentInstanceId,
      relation: relation.id,
    },
  });
  const addNewElementAfterSubmit = useRef(false);
  const instanceRelationMutation = useMutation({
    mutationFn: async (data: InventoryInstanceRelationFormData) => {
      const response = await createInventoryInstanceRelation(data);
      if (!response.success) {
        throw new Error(response.errorMessage);
      }
      return response.result;
    },
    onSuccess: () => {
      setShowForm(false);
      reset({
        source: currentInstanceId,
        relation: relation.id,
      });
    },
    onSettled: () => {
      addNewElementAfterSubmit.current = false;
    },
  });

  const targetInstanceController = useController({
    control,
    name: 'target',
    rules: {
      required: 'Target element is required',
    },
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
            handleSubmit((data) => instanceRelationMutation.mutate(data))(e);
          }}
        >
          <div className="rounded-xl border p-6">
            <DaText variant="regular-bold">
              Add Element of type {relation.target.name}
            </DaText>
            {instanceRelationMutation.isError && (
              <div className="border rounded-lg text-sm text-da-destructive border-da-destructive p-4 my-7">
                {instanceRelationMutation.error?.message ||
                  'An error occurred while adding the element.'}
              </div>
            )}

            <div className="mt-7">
              <DaText variant="small-bold">Select Element *</DaText>
              <InstanceCombobox
                className="mt-2"
                schema={relation.target}
                value={targetInstanceController.field.value}
                placeholder="Select Element..."
                excludedInstanceIds={excludedInstanceIds}
                disabled={instanceRelationMutation.isPending}
                onChange={targetInstanceController.field.onChange}
              />
              {errors.target && (
                <div className="mt-2">
                  <DaText variant="small" className="text-da-destructive">
                    {errors.target.message || 'Target element is required'}
                  </DaText>
                </div>
              )}
            </div>

            <div className="mt-7">
              <DaText variant="small-bold">Description</DaText>
              <DaTextarea
                {...register('description')}
                className="mt-2"
                disabled={instanceRelationMutation.isPending}
                placeholder="Enter Description..."
                textareaClassName="!text-sm !border-da-gray-light"
              />
            </div>

            <div className="mt-7">
              <DaText variant="small-bold">Metadata</DaText>
              <DaTextarea
                {...register('metadata')}
                disabled={instanceRelationMutation.isPending}
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
                disabled={instanceRelationMutation.isPending}
                onClick={() => {
                  addNewElementAfterSubmit.current = true;
                }}
                className="!text-sm"
                variant="outline-nocolor"
              >
                {instanceRelationMutation.isPending &&
                  addNewElementAfterSubmit.current && (
                    <TbLoader className="mr-2 animate-spin text-lg" />
                  )}
                Save & Add New Element
              </DaButton>
              <DaButton
                disabled={instanceRelationMutation.isPending}
                className="!text-sm"
              >
                {instanceRelationMutation.isPending &&
                  !addNewElementAfterSubmit.current && (
                    <TbLoader className="mr-2 animate-spin text-lg" />
                  )}
                Save
              </DaButton>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
