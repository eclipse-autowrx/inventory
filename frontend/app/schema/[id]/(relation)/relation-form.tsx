'use client';

import { DaButton } from '@/components/atoms/DaButton';
import { DaInput } from '@/components/atoms/DaInput';
import DaText from '@/components/atoms/DaText';
import { InventoryRelationFormData } from '@/types/inventory.type';
import clsx from 'clsx';
import { useRef, useState } from 'react';
import { useController, useForm } from 'react-hook-form';
import { TbArrowsLeftRight, TbPlus } from 'react-icons/tb';
import SchemaCombobox from './schema-combobox';
import { DaSelect, DaSelectItem } from '@/components/atoms/DaSelect';

interface RelationFormProps {
  className?: string;
}

export default function RelationForm({ className }: RelationFormProps) {
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const showFormAfterSubmit = useRef(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    // reset,
  } = useForm<InventoryRelationFormData>({
    defaultValues: {
      name: '',
      type: 'association',
      source: '',
      target: '',
      source_role_name: '',
      source_cardinality: 'n/a',
      target_role_name: '',
      target_cardinality: 'n/a',
    },
  });

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
  });

  const {
    field: { value: targetValue, onChange: targetOnChange },
  } = useController({
    control,
    name: 'target',
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

  const createRelation = async (data: InventoryRelationFormData) => {
    console.log(data);
  };

  const onSubmit = async (data: InventoryRelationFormData) => {
    setLoading(true);
    try {
      await createRelation(data);
      showFormAfterSubmit.current = false;
    } catch (error) {
      console.error('Error submitting form:', error);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={clsx(className)}>
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
        <div className="shadow-small bg-white rounded-xl mt-2 p-8">
          <DaText variant="regular-bold" className="text-da-gray-dark">
            Add Relation
          </DaText>

          <div className="mt-7">
            <DaText variant="small-bold" className="text-da-gray-dark">
              Relation Name *
            </DaText>
            <DaInput
              {...register('name', {
                required: 'Relation Name is required.',
              })}
              disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
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
                disabled={loading}
                className="mt-3"
                placeholder="Search for Source Schema..."
              />

              <DaText
                variant="small-bold"
                className="!block mt-7 text-da-gray-dark"
              >
                Source Role Name
              </DaText>
              <DaInput
                {...register('source_role_name')}
                disabled={loading}
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
                <DaSelectItem value="n/a">N/A</DaSelectItem>
                <DaSelectItem value="zero-to-one">Zero to one</DaSelectItem>
                <DaSelectItem value="one-to-one">One to one</DaSelectItem>
                <DaSelectItem value="one-to-many">One to many</DaSelectItem>
                <DaSelectItem value="zero-to-many">Zero to many</DaSelectItem>
              </DaSelect>
            </div>

            <DaButton type="button" size="sm" className="mt-10" variant="plain">
              <TbArrowsLeftRight size={20} />
            </DaButton>
            <div className="flex-1">
              <DaText variant="small-bold" className="text-da-gray-dark">
                Target *
              </DaText>
              <SchemaCombobox
                value={targetValue}
                onChange={targetOnChange}
                disabled={loading}
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
                disabled={loading}
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
                <DaSelectItem value="n/a">N/A</DaSelectItem>
                <DaSelectItem value="zero-to-one">Zero to one</DaSelectItem>
                <DaSelectItem value="one-to-one">One to one</DaSelectItem>
                <DaSelectItem value="one-to-many">One to many</DaSelectItem>
                <DaSelectItem value="zero-to-many">Zero to many</DaSelectItem>
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
              <DaText variant="small" className="text-da-gray-dark">
                Save & Add New
              </DaText>
            </DaButton>
            <DaButton>
              <DaText variant="small">Save</DaText>
            </DaButton>
          </div>
        </div>
      )}
    </form>
  );
}
