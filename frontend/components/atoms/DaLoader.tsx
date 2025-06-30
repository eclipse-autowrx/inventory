// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

import clsx from 'clsx';
import { TbLoader } from 'react-icons/tb';

interface DaLoaderProps {
  className?: string;
}

const DaLoader = ({ className }: DaLoaderProps) => {
  return (
    <TbLoader
      className={clsx(
        'da-label-huge text-da-primary-500 animate-spin',
        className
      )}
    />
  );
};

export default DaLoader;
