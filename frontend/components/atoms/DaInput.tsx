// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

'use client';

import React, { useState } from 'react';
import { IconType } from 'react-icons';

import { cn } from '@/lib/utils';
import { DaText } from './DaText';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  inputClassName?: string;
  wrapperClassName?: string;
  Icon?: IconType;
  iconBefore?: boolean;
  IconOnClick?: () => void;
  iconSize?: number;
  labelClassName?: string;
}

const DaInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      inputClassName,
      wrapperClassName,
      label,
      type,
      Icon,
      iconBefore = false,
      IconOnClick,
      iconSize,
      labelClassName,
      ...props
    },
    ref
  ) => {
    const [focused, setFocused] = useState(false);
    return (
      <div className={cn('flex flex-col', className)}>
        {label && (
          <DaText
            variant="regular-medium"
            className={cn(
              'mb-1',
              focused ? `text-da-primary-500` : `text-da-gray-medium`,
              labelClassName
            )}
          >
            {label}
          </DaText>
        )}
        <div
          className={cn(
            `h-10 py-1 flex items-center rounded-md border bg-da-white 
          da-txt-regular shadow-sm transition-colors text-da-gray-gray`,
            !focused && 'border-da-gray-light',
            focused && 'border-da-primary-500 text-da-primary-500',
            wrapperClassName
          )}
        >
          {Icon && iconBefore && (
            <Icon
              size={iconSize || 20}
              className={iconBefore ? 'ml-2' : 'mr-2'}
              onClick={IconOnClick}
            />
          )}

          <input
            type={type}
            className={cn(
              `grow flex px-2 py-1 h-8 w-full
                placeholder:text-da-gray-300
                focus-visible:ring-0 focus-visible:outline-none
                disabled:cursor-not-allowed`,
              inputClassName
            )}
            ref={ref}
            {...props}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />

          {Icon && !iconBefore && (
            <Icon
              size={iconSize || 20}
              className="mx-2"
              onClick={IconOnClick}
            />
          )}
        </div>
      </div>
    );
  }
);
DaInput.displayName = 'Input';

export { DaInput };
