'use client';

import { DaButton } from '@/components/atoms/DaButton';
import { useEffect } from 'react';
import { TbExclamationCircle } from 'react-icons/tb';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="h-full w-full flex min-h-[400px]">
      <div className="m-auto flex h-full flex-col items-center justify-center">
        <TbExclamationCircle className="text-3xl text-da-primary-500" />
        <p className="da-label-title mt-3">Oops! Something went wrong.</p>
        <DaButton size="sm" className="mt-3" onClick={reset}>
          Try again
        </DaButton>
      </div>
    </div>
  );
}
