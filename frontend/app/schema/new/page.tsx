// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import DaText from '@/components/atoms/DaText';
import InventorySchemaForm from '../schema-form';

export default function PageNewSchema() {
  return (
    <div className="max-w-[1600px] mx-auto p-12">
      <div className="mx-auto bg-white shadow-small rounded-lg px-6 py-4">
        <div className="w-full flex justify-center">
          <DaText
            variant="title"
            className="text-2xl text-da-primary-500 font-bold mb-6 text-center"
          >
            Create New Schema
          </DaText>
        </div>
        <InventorySchemaForm isUpdating={false} />
      </div>
    </div>
  );
}
