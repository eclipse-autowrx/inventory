// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use client';

import { DaButton } from '@/components/atoms/DaButton';
import { DaInput } from '@/components/atoms/DaInput';
import DaLoading from '@/components/atoms/DaLoading';
import DaText from '@/components/atoms/DaText';
import DaTreeBrowser, { Node } from '@/components/molecules/DaTreeBrowser';
import { List } from '@/types/common.type';
import { InventorySchema } from '@/types/inventory.type';
import clsx from 'clsx';
import { debounce } from 'lodash';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { TbSearch, TbX } from 'react-icons/tb';

interface FilterProps {
  schemaList: List<InventorySchema>;
}

function InnerFilter({ schemaList }: FilterProps) {
  const [searchString, setSearchString] = useState('');
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const nodeElementsRef = useRef<{ [key: string]: HTMLDivElement }>({});
  const { replace } = useRouter();
  const pathname = usePathname();

  const modeConfig = useMemo(() => {
    const treeData =
      schemaList?.results.map((schema) => {
        return {
          id: schema?.id,
          name: schema?.name,
        };
      }) || [];

    return {
      selected: searchParams.get('schema') || '',
      setSelected: (node: Node) => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set('schema', node.id);
        newSearchParams.set('page', '1'); // Reset page on filter change
        replace(`${pathname}?${newSearchParams.toString()}`);
      },
      clear: () => {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('schema');
        newSearchParams.set('page', '1'); // Reset page on filter change
        replace(`${pathname}?${newSearchParams.toString()}`);
      },
      treeData,
    };
  }, [schemaList?.results, searchParams, replace, pathname]);

  useEffect(() => {
    if (modeConfig?.selected)
      nodeElementsRef.current[modeConfig.selected]?.scrollIntoView({});
  }, [modeConfig?.selected]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSearchString(params.get('search') || '');
  }, []);

  const debounceUpdateSearchQuery = useMemo(() => {
    return debounce((keyword: string) => {
      const newSearchParams = new URLSearchParams(searchParams); // Use current searchParams

      if (keyword) newSearchParams.set('search', keyword);
      else newSearchParams.delete('search');

      newSearchParams.set('page', '1'); // Reset page on search change
      replace(`${pathname}?${newSearchParams.toString()}`);
    }, 300);
  }, [pathname, replace, searchParams]);

  const handleSearchChange = (value: string) => {
    setSearchString(value); // Update local input state immediately
    debounceUpdateSearchQuery(value); // Debounce the update to searchParams
  };

  const handleClearSearch = () => {
    setSearchString(''); // Clear local input
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    newSearchParams.set('page', '1'); // Reset page
    replace(`${pathname}?${newSearchParams.toString()}`);
  };

  return (
    <div className="sticky top-4 self-start h-fit w-[400px] max-w-[30vw]">
      <div className="relative">
        <DaInput
          value={searchString}
          iconBefore
          inputClassName="text-sm !rounded-lg"
          wrapperClassName="!rounded-lg"
          Icon={TbSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search Instance Item"
        />
        {/* Show clear button only if there is text in the input */}
        {searchString && (
          <button
            onClick={handleClearSearch}
            className="hover:bg-da-gray-light rounded-full absolute right-2 top-1/2 -translate-y-1/2 p-1 text-da-gray-dark focus:outline-none focus:ring-2 focus:ring-da-primary-300"
            aria-label="Clear search"
          >
            <TbX className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        ref={scrollContainerRef}
        className={clsx(
          'rounded-lg mt-4 mb-6 overflow-y-auto max-h-[calc(100vh-200px)] text-sm text-da-gray-dark shadow-sm border p-5'
        )}
      >
        <div className="flex items-center justify-between gap-3 -mt-1">
          <DaText variant="small-bold" className="!block text-da-gray-darkest">
            Tree Browser
          </DaText>
          {/* Show clear button only if a schema filter is active */}
          {modeConfig.selected && (
            <DaButton
              onClick={() => modeConfig.clear()}
              variant="plain"
              size="sm"
            >
              Clear filter
            </DaButton>
          )}
        </div>
        <div className="mt-3" />
        <DaTreeBrowser
          selected={modeConfig?.selected || ''}
          onSelected={modeConfig?.setSelected}
          data={modeConfig?.treeData || []}
          nodeElementsRef={nodeElementsRef}
        />
      </div>
    </div>
  );
}

export default function Filter(props: FilterProps) {
  return (
    <Suspense fallback={<DaLoading />}>
      <InnerFilter {...props} />
    </Suspense>
  );
}
