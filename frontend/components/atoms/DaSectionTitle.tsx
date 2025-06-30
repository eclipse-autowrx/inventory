// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

import { cn } from '@/lib/utils';

interface DaSectionTitleProps {
  number: number;
  title: string;
  className?: string;
}

const DaSectionTitle = ({ number, title, className }: DaSectionTitleProps) => {
  return (
    <div className={cn('flex select-none items-center', className)}>
      <div className="flex h-5 w-5 items-center justify-center rounded bg-da-gray-light p-2 text-xs font-bold">
        {number}
      </div>
      <div className="ml-1 flex font-medium text-gray-600">{title}</div>
    </div>
  );
};

export default DaSectionTitle;
