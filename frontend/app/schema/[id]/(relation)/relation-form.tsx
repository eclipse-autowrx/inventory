'use client';

import { DaButton } from '@/components/atoms/DaButton';
import { DaInput } from '@/components/atoms/DaInput';
import DaText from '@/components/atoms/DaText';
import { InventoryRelationFormData } from '@/types/inventory.type';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { TbArrowsLeftRight, TbPlus } from 'react-icons/tb';
import SchemaCombobox from './schema-combobox';
import { DaSelect, DaSelectItem } from '@/components/atoms/DaSelect';
import { useMutation } from '@tanstack/react-query';
import { createInventoryRelation } from '@/services/inventory.service';
import DaLoader from '@/components/atoms/DaLoader';

interface RelationFormProps {
  className?: string;
  currentSchemaId: string;
}

const defaultValues: InventoryRelationFormData = {
  name: '',
  type: 'association',
  source: '',
  target: '',
  source_role_name: '',
  source_cardinality: 'n/a',
  target_role_name: '',
  target_cardinality: 'n/a',
};

export default function RelationForm({
  className,
  currentSchemaId,
}: RelationFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [anchor, setAnchor] = useState<'source' | 'target'>('source');
  const showFormAfterSubmit = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm<InventoryRelationFormData>({
    defaultValues,
  });

  const createRelationMutation = useMutation({
    mutationFn: async (data: InventoryRelationFormData) => {
      if (data.source_cardinality === 'n/a') delete data.source_cardinality;
      if (data.target_cardinality === 'n/a') delete data.target_cardinality;
      return createInventoryRelation(data);
    },
    onSuccess: () => {
      if (!showFormAfterSubmit.current) {
        setShowForm(false);
      }
      reset({
        ...defaultValues,
        source: currentSchemaId,
      });
    },
    onSettled: () => {
      showFormAfterSubmit.current = false;
    },
  });

  useEffect(() => {
    if (currentSchemaId && getValues().source !== currentSchemaId) {
      reset((prev) => ({
        ...prev,
        source: currentSchemaId,
      }));
    }
  }, [currentSchemaId, getValues, reset]);

  const {
    field: { value: typeValue, onChange: typeOnChange },
  } = useController({
    control,
    name: 'type',
  });

  const {
    field: { value: sourceValue, onChange: sourceOnChange },
  } = useController({
    control,
    name: 'source',
    rules: {
      required: 'Source Schema is required.',
    },
  });

  const {
    field: { value: targetValue, onChange: targetOnChange },
  } = useController({
    control,
    name: 'target',
    rules: {
      required: 'Target Schema is required.',
    },
  });

  const {
    field: {
      value: sourceCardinalityValue,
      onChange: sourceCardinalityOnChange,
    },
  } = useController({
    control,
    name: 'source_cardinality',
  });

  const {
    field: {
      value: targetCardinalityValue,
      onChange: targetCardinalityOnChange,
    },
  } = useController({
    control,
    name: 'target_cardinality',
  });

  const onSubmit = async (data: InventoryRelationFormData) => {
    createRelationMutation.mutate(data);
  };

  const swapSourceTarget = () => {
    const value = getValues();
    const [newSource, newTarget] = [value.target, value.source];
    const [newSourceRoleName, newTargetRoleName] = [
      value.target_role_name,
      value.source_role_name,
    ];
    const [newSourceCardinality, newTargetCardinality] = [
      value.target_cardinality,
      value.source_cardinality,
    ];
    setValue('source', newSource);
    setValue('target', newTarget);
    setValue('source_role_name', newSourceRoleName);
    setValue('target_role_name', newTargetRoleName);
    setValue('source_cardinality', newSourceCardinality);
    setValue('target_cardinality', newTargetCardinality);
    setAnchor((prev) => (prev === 'source' ? 'target' : 'source'));
  };

  return (
    <div className={clsx(className)}>
      <div className="w-full flex">
        <DaButton
          onClick={() => setShowForm((prev) => !prev)}
          size="sm"
          className="ml-auto"
          variant="outline-nocolor"
        >
          <TbPlus className="mr-1" /> Add Relation
        </DaButton>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="shadow-small bg-white rounded-xl mt-2 p-8"
        >
          <DaText variant="regular-bold" className="text-da-gray-dark">
            Add Relation
          </DaText>
          {createRelationMutation.isError && (
            <div className="border rounded-lg text-sm text-da-destructive border-da-destructive p-4 my-7">
              {createRelationMutation.error?.message ||
                'An error occurred while creating the relation.'}
            </div>
          )}

          <div className="mt-7">
            <DaText variant="small-bold" className="text-da-gray-dark">
              Relation Name *
            </DaText>
            <DaInput
              {...register('name', {
                required: 'Relation Name is required.',
              })}
              disabled={createRelationMutation.isPending}
              className="mt-3"
              inputClassName="text-sm"
              placeholder="Enter Relation Name..."
            />
            {errors.name && (
              <DaText variant="small" className="text-da-destructive">
                {errors.name.message}
              </DaText>
            )}
          </div>

          <div className="mt-7">
            <DaText variant="small-bold" className="text-da-gray-dark">
              Relation Type *
            </DaText>

            <div className="flex gap-3 mt-3">
              <DaButton
                type="button"
                onClick={() => typeOnChange('association')}
                className={clsx(
                  'flex-1',
                  typeValue !== 'association' && 'opacity-60'
                )}
                disabled={createRelationMutation.isPending}
                variant={typeValue === 'association' ? 'outline' : 'dash'}
              >
                <DaText variant="small">Association</DaText>
              </DaButton>
              <DaButton
                type="button"
                onClick={() => typeOnChange('composition')}
                className={clsx(
                  'flex-1',
                  typeValue !== 'composition' && 'opacity-60'
                )}
                disabled={createRelationMutation.isPending}
                variant={typeValue === 'composition' ? 'outline' : 'dash'}
              >
                <DaText variant="small">Composition</DaText>
              </DaButton>
              <DaButton
                type="button"
                onClick={() => typeOnChange('inheritance')}
                className={clsx(
                  'flex-1',
                  typeValue !== 'inheritance' && 'opacity-60'
                )}
                disabled={createRelationMutation.isPending}
                variant={typeValue === 'inheritance' ? 'outline' : 'dash'}
              >
                <DaText variant="small">Inheritance</DaText>
              </DaButton>
            </div>
          </div>

          <div className="mt-7 flex gap-2">
            <div className="flex-1">
              <DaText variant="small-bold" className="text-da-gray-dark">
                Source *
              </DaText>
              <SchemaCombobox
                value={sourceValue}
                onChange={sourceOnChange}
                disabled={
                  createRelationMutation.isPending || anchor === 'source'
                }
                className="mt-3"
                placeholder="Search for Source Schema..."
                tooltipText={
                  anchor === 'source'
                    ? 'Fixed to current schema (use swap button to change relationship direction)'
                    : undefined
                }
              />
              {errors.source && (
                <DaText variant="small" className="text-da-destructive">
                  {errors.source.message}
                </DaText>
              )}

              <DaText
                variant="small-bold"
                className="!block mt-7 text-da-gray-dark"
              >
                Source Role Name
              </DaText>
              <DaInput
                {...register('source_role_name')}
                disabled={createRelationMutation.isPending}
                className="mt-3"
                inputClassName="text-sm"
                placeholder="Enter Source Role Name..."
              />

              <DaText
                variant="small-bold"
                className="!block mt-7 text-da-gray-dark"
              >
                Source Cardinality
              </DaText>
              <DaSelect
                className="mt-3"
                value={sourceCardinalityValue}
                onValueChange={sourceCardinalityOnChange}
              >
                <DaSelectItem value="n/a">
                  <span className="text-sm">N/A</span>
                </DaSelectItem>
                <DaSelectItem value="zero-to-one">
                  <span className="text-sm">Zero to one</span>
                </DaSelectItem>
                <DaSelectItem value="one-to-one">
                  <span className="text-sm">One to one</span>
                </DaSelectItem>
                <DaSelectItem value="one-to-many">
                  <span className="text-sm">One to many</span>
                </DaSelectItem>
                <DaSelectItem value="zero-to-many">
                  <span className="text-sm">Zero to many</span>
                </DaSelectItem>
              </DaSelect>
            </div>

            <DaButton
              onClick={swapSourceTarget}
              type="button"
              size="sm"
              className="mt-10"
              variant="plain"
            >
              <TbArrowsLeftRight size={20} />
            </DaButton>
            <div className="flex-1">
              <DaText variant="small-bold" className="text-da-gray-dark">
                Target *
              </DaText>
              <SchemaCombobox
                value={targetValue}
                onChange={targetOnChange}
                disabled={
                  createRelationMutation.isPending || anchor === 'target'
                }
                tooltipText={
                  anchor === 'target'
                    ? 'Fixed to current schema (use swap button to change relationship direction)'
                    : undefined
                }
                className="mt-3"
                placeholder="Search for Target Schema..."
              />
              {errors.target && (
                <DaText variant="small" className="text-da-destructive">
                  {errors.target.message}
                </DaText>
              )}

              <DaText
                variant="small-bold"
                className="!block mt-7 text-da-gray-dark"
              >
                Target Role Name
              </DaText>
              <DaInput
                {...register('target_role_name')}
                className="mt-3"
                inputClassName="text-sm"
                disabled={createRelationMutation.isPending}
                placeholder="Enter Target Role Name..."
              />

              <DaText
                variant="small-bold"
                className="!block mt-7 text-da-gray-dark"
              >
                Target Cardinality
              </DaText>
              <DaSelect
                className="mt-3"
                value={targetCardinalityValue}
                onValueChange={targetCardinalityOnChange}
              >
                <DaSelectItem value="n/a">
                  <span className="text-sm">N/A</span>
                </DaSelectItem>
                <DaSelectItem value="zero-to-one">
                  <span className="text-sm">Zero to one</span>
                </DaSelectItem>
                <DaSelectItem value="one-to-one">
                  <span className="text-sm">One to one</span>
                </DaSelectItem>
                <DaSelectItem value="one-to-many">
                  <span className="text-sm">One to many</span>
                </DaSelectItem>
                <DaSelectItem value="zero-to-many">
                  <span className="text-sm">Zero to many</span>
                </DaSelectItem>
              </DaSelect>
            </div>
          </div>

          <div className="mt-7 flex items-center justify-end gap-3">
            <DaButton
              onClick={() => setShowForm(false)}
              variant="outline-nocolor"
              type="button"
            >
              <DaText variant="small" className="text-da-gray-dark">
                Cancel
              </DaText>
            </DaButton>
            <DaButton
              onClick={() => {
                showFormAfterSubmit.current = true;
              }}
              variant="outline-nocolor"
            >
              {createRelationMutation.isPending && (
                <DaLoader className="mr-2 !text-base" />
              )}
              <DaText variant="small" className="text-da-gray-dark">
                Save & Add New
              </DaText>
            </DaButton>
            <DaButton>
              {createRelationMutation.isPending && (
                <DaLoader className="mr-2 !text-base" />
              )}
              <DaText variant="small">Save</DaText>
            </DaButton>
          </div>
        </form>
      )}
    </div>
  );
}
