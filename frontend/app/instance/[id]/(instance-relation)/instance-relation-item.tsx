// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

'use client';

import DaTooltip from '@/components/atoms/DaTooltip';
import {
  InventoryInstanceRelation,
  InventoryRelation,
} from '@/types/inventory.type';
import { Session } from '@/types/session.type';
import Link from 'next/link';
import DeleteInstanceRelation from './delete-instance-relation';
import { useState } from 'react';
import InstanceRelationForm from './instance-relation-form';
import { TbEdit } from 'react-icons/tb';
import { DaButton } from '@/components/atoms/DaButton';

interface InstanceRelationItemProps {
  instanceRelation: InventoryInstanceRelation;
  currentUserSession?: Session;
  instanceId: string;
  relation: InventoryRelation;
}

export default function InstanceRelationItem({
  instanceRelation,
  currentUserSession,
  instanceId,
  relation,
}: InstanceRelationItemProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <div
      className="flex min-h-12 gap-x-4 border-t border-dashed items-center"
      key={instanceRelation.id}
    >
      {showForm ? (
        <div className="w-full mb-6">
          <InstanceRelationForm
            initialData={instanceRelation}
            currentInstanceId={instanceId}
            relation={relation}
            onFormClose={() => setShowForm(false)}
            isUpdating
          />
        </div>
      ) : (
        <>
          <div className="flex-1">
            <DaTooltip content={instanceRelation.target.name}>
              <Link
                className="text-da-gray-darkest h-12 flex items-center hover:underline hover:text-da-primary-500"
                href={`/instance/${instanceRelation.target.id}`}
              >
                <span className="line-clamp-1">
                  {instanceRelation.target.name}
                </span>
              </Link>
            </DaTooltip>
          </div>
          <div className="flex-1">
            {instanceRelation.description && (
              <DaTooltip content={instanceRelation.description}>
                <div className="flex h-12 items-center">
                  <span className="line-clamp-1">
                    {instanceRelation.description}
                  </span>
                </div>
              </DaTooltip>
            )}
          </div>
          <div className="flex-1">
            {instanceRelation.metadata && (
              <DaTooltip content={instanceRelation.metadata}>
                <div className="flex h-12 items-center">
                  <span className="line-clamp-1">
                    {instanceRelation.metadata}
                  </span>
                </div>
              </DaTooltip>
            )}
          </div>
          <div className="w-16 flex items-center">
            {currentUserSession?.id &&
              currentUserSession.id === instanceRelation.created_by?.id && (
                <>
                  <DaButton
                    onClick={() => setShowForm(true)}
                    size="sm"
                    variant="plain"
                  >
                    <TbEdit size={16} />
                  </DaButton>
                  <DeleteInstanceRelation instanceRelation={instanceRelation} />
                </>
              )}
          </div>
        </>
      )}
    </div>
  );
}
