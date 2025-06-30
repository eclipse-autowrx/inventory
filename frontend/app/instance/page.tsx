// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the Apache License, Version 2.0 which is available at
// https://www.apache.org/licenses/LICENSE-2.0.
//
// SPDX-License-Identifier: Apache-2.0

import {
  getInventoryInstances,
  getInventorySchemas,
} from '@/services/inventory.service';
import Filter from './filter';
import DaText from '@/components/atoms/DaText';
import Link from 'next/link';
import { DaButton } from '@/components/atoms/DaButton';
import { TbPlus } from 'react-icons/tb';
import { Fragment } from 'react';
import {
  DaPaginationContent,
  DaPaginationItem,
  DaPaginationLink,
  DaPaginationNext,
  DaPaginationPrevious,
  DaPaging,
} from '@/components/atoms/DaPaging';
import { redirect } from 'next/navigation';
import InstanceItem from './instance-item';

interface PageInstancesProps {
  searchParams?: Promise<{
    search?: string;
    schema?: string;
    page?: string;
  }>;
}

export default async function PageInstances(props: PageInstancesProps) {
  const searchParams = (await props.searchParams) || {};
  const { search: querySearch, page } = searchParams;

  const [instancesResponse, schemasResponse] = await Promise.all([
    getInventoryInstances(new URLSearchParams(searchParams).toString()),
    getInventorySchemas(),
  ]);

  if (!instancesResponse.success) {
    console.error(
      'Failed to fetch inventory instances:',
      instancesResponse.errorMessage
    );
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch instances.
      </div>
    );
  }

  if (!schemasResponse.success) {
    console.error(
      'Failed to fetch inventory schemas:',
      schemasResponse.errorMessage
    );
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch schemas.
      </div>
    );
  }

  const instances = instancesResponse.result;
  const schemas = schemasResponse.result;

  const handlePageChange = (newPage: number) => {
    // Ensure newPage is valid
    if (newPage < 1) newPage = 1;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', newPage.toString());
    redirect(`/instance?${newSearchParams.toString()}`);
  };

  const currentPage = parseInt(page || '1', 10) || 1; // Ensure it's a valid number >= 1
  const results = instances?.results || [];
  const totalPages = instances?.totalPages ?? 1;
  const totalResults = instances?.totalResults ?? 0;

  return (
    <div className="flex">
      <div className="m-auto w-full p-6">
        <div className="flex gap-14">
          <Filter schemaList={schemas} />

          <div className="flex-1 min-w-0">
            <DaText variant="title" className="text-da-primary-500">
              {querySearch ? `Results for '${querySearch}'` : 'Inventory'}
            </DaText>

            <div className="flex gap-2 mt-2">
              <Link href="/instance/new">
                <DaButton className="" size="sm">
                  <TbPlus className="h-4 w-4 mr-1" /> Add Inventory Instance
                </DaButton>
              </Link>
            </div>

            <p className="text-xs text-da-gray-dark mt-4 mb-1">
              {totalResults} result{totalResults !== 1 ? 's' : ''}
              {totalPages > 1 ? ` (Page ${currentPage} of ${totalPages})` : ''}
            </p>

            {/* Render items for the current page */}
            {results.map((item, index) => (
              <Fragment key={item.id}>
                <InstanceItem data={item} />
                {index < results.length - 1 && (
                  <div className="border-b border-da-gray-light" />
                )}
              </Fragment>
            ))}

            {results.length === 0 && (
              <div className="text-center p-6 text-da-gray-dark">
                No inventory items found matching your criteria.
              </div>
            )}

            {/* === Pagination Component  === */}
            {totalPages > 1 && (
              <DaPaging className="pt-3 pb-6 flex justify-center">
                <DaPaginationContent>
                  <DaPaginationItem>
                    <DaPaginationPrevious
                      className="cursor-pointer h-8"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                    />
                  </DaPaginationItem>
                  {/* Generate page number links */}
                  {[...Array(totalPages)].map((_, index) => (
                    <DaPaginationItem key={index}>
                      <DaPaginationLink
                        className="cursor-pointer h-8 w-8 flex items-center justify-center"
                        isActive={currentPage === index + 1}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </DaPaginationLink>
                    </DaPaginationItem>
                  ))}
                  <DaPaginationItem>
                    <DaPaginationNext
                      className="cursor-pointer h-8"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    />
                  </DaPaginationItem>
                </DaPaginationContent>
              </DaPaging>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
