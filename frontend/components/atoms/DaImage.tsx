import Image from 'next/image';
import React, { HTMLAttributes } from 'react';

interface DaImageProps extends HTMLAttributes<HTMLImageElement> {
  //   children?: React.ReactNode;
  src?: string | undefined;
  alt?: string | undefined;
}

const DaImage = React.forwardRef<HTMLImageElement, DaImageProps>(
  ({ className, src, alt, ...props }, ref) => {
    return (
      <Image
        ref={ref}
        alt={alt || 'image'}
        src={src || ''}
        {...props}
        className={className}
      />
    );
  }
);

DaImage.displayName = 'DaImage';

export { DaImage };
