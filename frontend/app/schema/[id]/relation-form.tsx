'use client';

import { DaButton } from '@/components/atoms/DaButton';
import { DaInput } from '@/components/atoms/DaInput';
import DaText from '@/components/atoms/DaText';
import clsx from 'clsx';
import { useState } from 'react';
import { TbArrowsLeftRight, TbPlus } from 'react-icons/tb';

interface RelationFormProps {
  className?: string;
}

export default function RelationForm({ className }: RelationFormProps) {
  const [showForm, setShowForm] = useState(true);

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
        <div className="shadow-small bg-white rounded-xl mt-2 p-8">
          <DaText variant="regular-bold" className="text-da-gray-dark">
            Add Relation
          </DaText>

          <div className="mt-7">
            <DaText variant="small-bold" className="text-da-gray-dark">
              Relation Name *
            </DaText>
            <DaInput
              className="mt-3"
              inputClassName="text-sm"
              placeholder="Type Relation Name..."
            />
          </div>

          <div className="mt-7">
            <DaText variant="small-bold" className="text-da-gray-dark">
              Relation Type
            </DaText>

            <div className="flex gap-3 mt-3">
              <DaButton className="flex-1" variant="outline">
                <DaText variant="small">Association</DaText>
              </DaButton>
              <DaButton className="flex-1 opacity-50" variant="dash">
                <DaText variant="small">Composition</DaText>
              </DaButton>
              <DaButton className="flex-1 opacity-50" variant="dash">
                <DaText variant="small">Inheritance</DaText>
              </DaButton>
            </div>
          </div>

          <div className="mt-7 flex gap-2">
            <div className="flex-1">
              <DaText variant="small-bold" className="text-da-gray-dark">
                Source *
              </DaText>
              <DaInput
                className="mt-3"
                inputClassName="text-sm"
                placeholder="Search for Source Schema..."
              />

              <DaText
                variant="small-bold"
                className="!block mt-7 text-da-gray-dark"
              >
                Source Role Name
              </DaText>
              <DaInput
                className="mt-3"
                inputClassName="text-sm"
                placeholder="Type Source Role Name..."
              />

              <DaText
                variant="small-bold"
                className="!block mt-7 text-da-gray-dark"
              >
                Source Cardinality
              </DaText>
              <DaInput
                className="mt-3"
                inputClassName="text-sm"
                placeholder="Select Source Cardinality"
              />
            </div>

            <DaButton size="sm" className="mt-10" variant="plain">
              <TbArrowsLeftRight size={20} />
            </DaButton>
            <div className="flex-1">
              <DaText variant="small-bold" className="text-da-gray-dark">
                Target *
              </DaText>
              <DaInput
                className="mt-3"
                inputClassName="text-sm"
                placeholder="Search for Target Schema..."
              />

              <DaText
                variant="small-bold"
                className="!block mt-7 text-da-gray-dark"
              >
                Source Target Name
              </DaText>
              <DaInput
                className="mt-3"
                inputClassName="text-sm"
                placeholder="Type Target Role Name..."
              />

              <DaText
                variant="small-bold"
                className="!block mt-7 text-da-gray-dark"
              >
                Target Cardinality
              </DaText>
              <DaInput
                className="mt-3"
                inputClassName="text-sm"
                placeholder="Select Target Cardinality"
              />
            </div>
          </div>

          <div className="mt-7 flex items-center justify-end gap-3">
            <DaButton variant="outline-nocolor">
              <DaText variant="small" className="text-da-gray-dark">
                Cancel
              </DaText>
            </DaButton>
            <DaButton variant="outline-nocolor">
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
    </div>
  );
}
