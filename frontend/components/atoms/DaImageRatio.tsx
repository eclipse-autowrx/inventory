// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import Image from 'next/image';

const AspectRatio = AspectRatioPrimitive.Root;

interface DaImageRatioProps {
  src: string;
  alt?: string;
  ratio: number;
  maxWidth: string;
  className?: string;
}

const DaImageRatio = ({
  src,
  alt,
  ratio,
  maxWidth,
  className = '',
}: DaImageRatioProps) => {
  return (
    <div className={`${className} h-fit w-full`} style={{ maxWidth: maxWidth }}>
      <AspectRatio ratio={ratio}>
        <Image
          src={src}
          alt={alt ? alt : 'Image'}
          className="rounded-md object-cover h-full w-full"
        />
      </AspectRatio>
    </div>
  );
};

export { DaImageRatio };
