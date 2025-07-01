// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use client';

import { DaButton } from '@/components/atoms/DaButton';
import { InventoryRelation, RelationCardinality } from '@/types/inventory.type';
import { ArcherContainer, ArcherElement } from 'react-archer';
import { TbPencil } from 'react-icons/tb';
import DeleteRelation from './delete-relation';
import RelationForm from './relation-form';
import { useState } from 'react';
import clsx from 'clsx';
import Link from 'next/link';

interface RelationItemProps {
  schemaId: string;
  relation: InventoryRelation;
  reverseDirection?: boolean;
}

const mapCardinalityToRepresentation: Record<RelationCardinality, string> = {
  'one-to-one': '1',
  'zero-to-one': '0..1',
  'one-to-many': '1..*',
  'zero-to-many': '0..*',
};

export default function RelationItem({
  schemaId,
  relation,
  reverseDirection,
}: RelationItemProps) {
  const [editing, setEditing] = useState(false);

  const processedRelation = {
    ...relation,
    source: reverseDirection ? relation.target : relation.source,
    target: reverseDirection ? relation.source : relation.target,
    source_role_name: reverseDirection
      ? relation.target_role_name
      : relation.source_role_name,
    target_role_name: reverseDirection
      ? relation.source_role_name
      : relation.target_role_name,
    source_cardinality: reverseDirection
      ? relation.target_cardinality
      : relation.source_cardinality,
    target_cardinality: reverseDirection
      ? relation.source_cardinality
      : relation.target_cardinality,
  };

  return (
    <div className="flex gap-6 items-center w-full justify-between">
      {!editing && (
        <div className="max-w-[800px] flex-1">
          <ArcherContainer
            endMarker={false}
            strokeColor="black"
            className="flex"
          >
            <div className="flex">
              <ArcherElement
                id={processedRelation.source.id + '1'}
                relations={[
                  {
                    targetId: processedRelation.target.id + '2',
                    targetAnchor: 'left',
                    sourceAnchor: 'right',
                    label: (
                      <p className="-mt-6 da-label-small-bold">
                        {processedRelation.name}
                      </p>
                    ),
                  },
                ]}
              >
                <div className="relative w-[200px] xl:w-[280px]">
                  {processedRelation.source_role_name && (
                    <p className="absolute text-da-gray-dark text-xs top-[2px] text-nowrap left-[calc(100%+8px)]">
                      {processedRelation.source_role_name}
                    </p>
                  )}
                  {processedRelation.source_cardinality && (
                    <p className="absolute text-da-gray-dark text-xs bottom-0 text-nowrap left-[calc(100%+8px)]">
                      {
                        mapCardinalityToRepresentation[
                          processedRelation.source_cardinality
                        ]
                      }
                    </p>
                  )}
                  {reverseDirection && (
                    <ArrowHead
                      type={processedRelation.type}
                      className="absolute top-[13px] -right-[17px]"
                    />
                  )}
                  <button className="rounded-lg truncate block text-sm w-full text-center border p-3 border-dashed border-da-gray-medium">
                    {processedRelation.source.name}
                  </button>
                </div>
              </ArcherElement>

              <div className="w-60 xl:w-80" />

              {/* +2 to handle self reference relation */}
              <ArcherElement id={processedRelation.target.id + '2'}>
                <div className="relative w-[200px] xl:w-[280px]">
                  {processedRelation.target_role_name && (
                    <p className="absolute text-da-gray-dark flex top-[2px] text-nowrap text-xs right-[calc(100%+8px)]">
                      {processedRelation.target_role_name}
                    </p>
                  )}
                  {processedRelation.target_cardinality && (
                    <p className="absolute text-da-gray-dark text-xs bottom-0 text-nowrap right-[calc(100%+8px)]">
                      {
                        mapCardinalityToRepresentation[
                          processedRelation.target_cardinality
                        ]
                      }
                    </p>
                  )}
                  {!reverseDirection && (
                    <ArrowHead
                      type={processedRelation.type}
                      className="absolute top-[13px] -left-[17px] rotate-180"
                    />
                  )}
                  <Link href={`/schema/${processedRelation.target.id}`}>
                    <button className="truncate w-full block rounded-lg text-sm text-center border p-3">
                      {processedRelation.target.name}
                    </button>
                  </Link>
                </div>
              </ArcherElement>
            </div>
          </ArcherContainer>
        </div>
      )}

      <div className={clsx('flex', editing && 'w-full')}>
        <RelationForm
          onFormClose={() => setEditing(false)}
          className="w-full"
          isUpdating
          initialData={relation}
          trigger={
            editing ? null : (
              <DaButton
                onClick={() => setEditing(true)}
                size="sm"
                variant="plain"
              >
                <TbPencil className="mr-2" /> Edit
              </DaButton>
            )
          }
          schemaId={schemaId}
        />
        {!editing && (
          <DeleteRelation
            relationId={relation.id}
            relationName={relation.name}
          />
        )}
      </div>
    </div>
  );
}

interface ArrowHeadProps {
  type: 'inheritance' | 'association' | 'composition';
  className?: string;
}

export function ArrowHead({ type, className }: ArrowHeadProps) {
  if (type === 'association')
    return (
      <svg
        className={className}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 10 L12 4 M2 10 L12 16"
          fill="none"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    );

  if (type === 'inheritance')
    return (
      <svg
        className={className}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 10 L12 4 L12 16 Z"
          fill="white"
          stroke="black"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (type === 'composition')
    return (
      <svg
        className={className}
        width="20"
        height="20"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M2 10 L8 6 L14 10 L8 14 Z"
          fill="black"
          stroke="black"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
}
