// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import { DaButton } from '@/components/atoms/DaButton';
import DaText from '@/components/atoms/DaText';
import { roles } from '@/lib/mock/data';
import { TbListTree } from 'react-icons/tb';
import Link from 'next/link';
import Image from 'next/image';

export default async function InventoryRoleBrowser() {
  return (
    <div className="container py-4">
      <div className="flex-1 min-w-0 flex gap-2">
        <DaText variant="title" className="text-da-primary-500">
          Role Browser
        </DaText>
        <Link className="ml-auto" href="/instance">
          <DaButton variant="outline-nocolor" size="sm">
            <TbListTree className="mr-1" /> Instances
          </DaButton>
        </Link>
        <Link href="/schema">
          <DaButton variant="outline-nocolor" size="sm">
            <TbListTree className="mr-1" /> Schemas
          </DaButton>
        </Link>
      </div>
      <div className="grid grid-cols-2 mt-4 grid-rows-2 gap-6">
        {roles.map((role, index) => (
          <Link
            href={`/role/${role.name}`}
            key={index}
            className="h-[200px] hover:bg-da-primary-100 transition overflow-hidden flex border shadow rounded-md"
          >
            <Image
              width={200}
              height={200}
              className="h-full w-auto aspect-square rounded-l-md"
              src={role.image}
              alt={role.name}
            />
            <div className="flex flex-col flex-1 px-6 py-4">
              <DaText variant="sub-title" className="!text-da-gray-darkest">
                {role.name}
              </DaText>
              <span className="text-sm mt-1">{role.description}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
