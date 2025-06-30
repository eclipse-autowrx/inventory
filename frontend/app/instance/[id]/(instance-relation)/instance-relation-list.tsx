// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

import DaText from '@/components/atoms/DaText';
import {
  getInventoryInstanceRelations,
  getInventoryRelations,
} from '@/services/inventory.service';
import { InventoryRelation } from '@/types/inventory.type';
import Link from 'next/link';
import { DaButton } from '@/components/atoms/DaButton';
import { getServerSession } from '@/lib/auth/server-session-auth';
import CreateInstanceRelation from './create-instance-relation';
import InstanceRelationItem from './instance-relation-item';

interface InstanceRelationListProps {
  instanceId: string;
  schemaId: string;
}

export default async function InstanceRelationList({
  instanceId,
  schemaId,
}: InstanceRelationListProps) {
  const response = await getInventoryRelations({
    source: schemaId,
  });
  if (!response.success) {
    console.error('Failed to fetch relations:', response.errorMessage);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch relations.
      </div>
    );
  }
  const relations = response.result;

  const outgoingRelations = relations.results.filter(
    (relation) => relation.source.id === schemaId
  );

  if (outgoingRelations.length === 0)
    return (
      <div className="mt-3">
        <DaText variant="small">
          There are no outgoing relations for this instance.
        </DaText>
        <Link href={`/schema/${schemaId}`}>
          <DaButton
            className="flex ml-4 gap-2 items-center"
            variant="outline-nocolor"
            size="sm"
          >
            Setup Relations
          </DaButton>
        </Link>
      </div>
    );

  return (
    <div>
      {outgoingRelations.map((relation) => (
        <RelationItem
          relation={relation}
          instanceId={instanceId}
          key={relation.id}
        />
      ))}
    </div>
  );
}

async function RelationItem({
  relation,
  instanceId,
}: {
  relation: InventoryRelation;
  instanceId: string;
}) {
  const currentUserSession = await getServerSession();
  const response = await getInventoryInstanceRelations({
    relation: relation.id,
    source: instanceId,
  });
  if (!response.success) {
    console.error('Failed to fetch relations:', response.errorMessage);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch instance relations.
      </div>
    );
  }

  const instanceRelations = response.result;

  const excludedInstanceIds = new Set<string>([
    instanceId,
    ...instanceRelations.results.map((ir) => ir.target.id),
  ]);

  return (
    <div key={relation.id} className="p-7 bg-white border mt-6 rounded-xl">
      <div className="flex items-center justify-between">
        <DaText variant="regular-bold">
          {relation.name} {relation.target.name}
        </DaText>
      </div>
      <CreateInstanceRelation
        instanceId={instanceId}
        excludedInstanceIds={excludedInstanceIds}
        relation={relation}
      />
      <div className="border-t mt-6 my-5" />
      {instanceRelations.results.length === 0 ? (
        <DaText variant="small">
          There&apos;s currently no relationship for this type.
        </DaText>
      ) : (
        <div>
          <div className="flex h-12 gap-x-4 items-center">
            <div className="text-da-gray-darkest font-semibold flex-1">
              Target Name
            </div>
            <div className="text-da-gray-darkest font-semibold flex-1">
              Description
            </div>
            <div className="text-da-gray-darkest font-semibold flex-1">
              Metadata
            </div>
            <div className="text-da-gray-darkest font-semibold w-16 text-center">
              Actions
            </div>
          </div>
          <div>
            {instanceRelations.results.map((instanceRelation) => (
              <InstanceRelationItem
                instanceId={instanceId}
                relation={relation}
                key={instanceRelation.id}
                instanceRelation={instanceRelation}
                currentUserSession={currentUserSession}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
