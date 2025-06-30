// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

'use client';

import { DaButton } from '@/components/atoms/DaButton';
import { useState } from 'react';
import { TbEye, TbEyeOff } from 'react-icons/tb';

interface ShowSchemaProps {
  schemaDefinition: Record<string, unknown>;
}

export default function ShowSchema({ schemaDefinition }: ShowSchemaProps) {
  const [showDetail, setShowDetail] = useState(false);

  return (
    <div className="w-full">
      <DaButton
        onClick={() => setShowDetail((prev) => !prev)}
        size="sm"
        variant="text"
        className="!px-0 m-0"
      >
        {showDetail ? (
          <TbEyeOff className="h-4 w-4 mr-1" />
        ) : (
          <TbEye className="w-4 h-4 mr-1" />
        )}{' '}
        {showDetail ? 'Hide' : 'Show'} Detail Schema
      </DaButton>
      {showDetail && (
        <div className="border mt-1 rounded-md p-4 w-full">
          <pre>{JSON.stringify(schemaDefinition || {}, null, 4)}</pre>
        </div>
      )}
    </div>
  );
}
