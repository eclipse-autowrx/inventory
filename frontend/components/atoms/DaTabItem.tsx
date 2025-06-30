// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link';
import { FC } from 'react';
import { cn } from '@/lib/utils';

interface DaTabItemProps {
  children: React.ReactNode;
  active?: boolean;
  to?: string;
  small?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const DaTabItem: FC<DaTabItemProps> = ({
  children,
  active,
  to,
  small,
  onClick,
}) => {
  return (
    <Link
      href={to || ''}
      target={to && to.startsWith('http') ? '_blank' : '_self'}
      rel="noopener noreferrer"
    >
      <div
        onClick={onClick}
        className={cn(
          `flex h-full da-label-small-bold items-center justify-center min-w-20 cursor-pointer hover:opacity-80 border-b-2 border-transparent `,
          small ? 'py-0.5 px-2' : 'py-1 px-4',
          active
            ? 'text-da-primary-500 border-b-2 border-da-primary-500'
            : 'text-da-gray-medium '
        )}
      >
        {children}
      </div>
    </Link>
  );
};

export default DaTabItem;
