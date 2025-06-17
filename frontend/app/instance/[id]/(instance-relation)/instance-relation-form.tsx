'use client';

import { DaButton } from '@/components/atoms/DaButton';
import DaText from '@/components/atoms/DaText';
import { DaTextarea } from '@/components/atoms/DaTextarea';
import {
  createInventoryInstanceRelation,
  updateInventoryInstanceRelation,
} from '@/services/inventory.service';
import {
  InventoryInstanceRelation,
  InventoryInstanceRelationFormData,
  InventoryRelation,
} from '@/types/inventory.type';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { useController, useForm } from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';
import InstanceCombobox from './instance-combobox';
import DaTooltip from '@/components/atoms/DaTooltip';
import { toast } from 'react-toastify';

interface InstanceRelationFormProps {
  currentInstanceId: string;
  relation: InventoryRelation;
  className?: string;
  excludedInstanceIds?: Set<string>;
  onFormClose?: () => void;
  isUpdating?: boolean;
  initialData?: InventoryInstanceRelation;
}

export default function InstanceRelationForm({
  currentInstanceId,
  relation,
  excludedInstanceIds,
  onFormClose,
  isUpdating = false,
  initialData,
}: InstanceRelationFormProps) {
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
      if (!isUpdating) {
        const response = await createInventoryInstanceRelation(data);
        if (!response.success) {
          throw new Error(response.errorMessage);
        }
        return response.result;
      } else {
        if (!initialData) {
          toast.error('Initial data is required for updating');
          return;
        }
        const response = await updateInventoryInstanceRelation(
          initialData.id,
          data
        );
        if (!response.success) {
          throw new Error(response.errorMessage);
        }
        return response.result;
      }
    },
    onSuccess: () => {
      reset({
        source: currentInstanceId,
        relation: relation.id,
      });
      if (isUpdating || !addNewElementAfterSubmit.current) {
        onFormClose?.();
      }
    },
    onSettled: () => {
      addNewElementAfterSubmit.current = false;
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        description: initialData.description,
        metadata: initialData.metadata,
        target: initialData.target.id,
        source: currentInstanceId,
        relation: relation.id,
      });
    }
  }, [currentInstanceId, initialData, relation.id, reset]);

  const targetInstanceController = useController({
    control,
    name: 'target',
    rules: {
      required: 'Target element is required',
    },
  });

  return (
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
          {isUpdating && initialData
            ? `Edit Relationship "${initialData.source.name}"-"${initialData.target.name}"`
            : `Add Element of type ${relation.target.name}`}
        </DaText>
        {instanceRelationMutation.isError && (
          <div className="border rounded-lg text-sm text-da-destructive border-da-destructive p-4 my-7">
            {instanceRelationMutation.error?.message ||
              'An error occurred while adding the element.'}
          </div>
        )}

        <div className="mt-7">
          <DaText variant="small-bold">Select Element *</DaText>
          {isUpdating ? (
            <DaTooltip content="Cannot edit target element">
              <InstanceCombobox
                className="mt-2"
                schema={relation.target}
                value={targetInstanceController.field.value}
                placeholder="Select Element..."
                excludedInstanceIds={excludedInstanceIds}
                disabled={isUpdating || instanceRelationMutation.isPending}
                onChange={targetInstanceController.field.onChange}
              />
            </DaTooltip>
          ) : (
            <InstanceCombobox
              className="mt-2"
              schema={relation.target}
              value={targetInstanceController.field.value}
              placeholder="Select Element..."
              excludedInstanceIds={excludedInstanceIds}
              disabled={isUpdating || instanceRelationMutation.isPending}
              onChange={targetInstanceController.field.onChange}
            />
          )}
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
            onClick={onFormClose}
            type="button"
            className="!text-sm"
            variant="outline-nocolor"
          >
            Cancel
          </DaButton>
          {!isUpdating && (
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
          )}
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
  );
}
