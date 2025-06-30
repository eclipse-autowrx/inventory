// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react';

import { cn } from '@/lib/utils';

interface DaTextProps {
  children?: React.ReactNode;
  className?: string;
  variant?:
    | 'regular'
    | 'regular-medium'
    | 'regular-bold'
    | 'small'
    | 'small-bold'
    | 'small-medium'
    | 'sub-title'
    | 'title'
    | 'huge'
    | 'huge-bold';
}

const DaText = React.forwardRef<HTMLLabelElement, DaTextProps>(
  ({ className, variant = 'regular', ...props }, ref) => {
    return (
      <label
        className={cn(` da-label-${variant}`, className)}
        ref={ref}
        style={{ cursor: 'inherit' }}
        {...props}
      />
    );
  }
);

DaText.displayName = 'DaText';

export { DaText };
export default DaText;
