// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

'use client';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/atoms/Command';
import { DaButton } from '@/components/atoms/DaButton';
import DaLoader from '@/components/atoms/DaLoader';
import DaPopup from '@/components/atoms/DaPopup';
import DaText from '@/components/atoms/DaText';
import DaTooltip from '@/components/atoms/DaTooltip';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover';
import useListInventoryInstances from '@/hooks/useListInventoryInstances';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { TbCheck, TbChevronDown, TbPlus } from 'react-icons/tb';
import InstanceForm from '../../instance-form';
import {
  InventoryInstance,
  InventorySimplifiedSchema,
} from '@/types/inventory.type';

interface InstanceComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  tooltipText?: string;
  schema: InventorySimplifiedSchema; // Schema
  excludedInstanceIds?: Set<string>;
}

export default function InstanceCombobox({
  value: outerSelectedInstanceId,
  onChange: outerOnChangeSelectedInstanceId,
  placeholder,
  className,
  disabled,
  tooltipText,
  schema,
  excludedInstanceIds,
}: InstanceComboboxProps) {
  const { data, isLoading } = useListInventoryInstances({
    schema: schema.id,
  });

  const [open, setOpen] = useState(false);
  const [selectedInstanceId, setSelectedInstanceId] = useState(
    outerSelectedInstanceId || ''
  );

  const openCreateInstanceFormState = useState(false);

  useEffect(() => {
    if (
      outerSelectedInstanceId !== undefined &&
      outerSelectedInstanceId !== selectedInstanceId
    ) {
      setSelectedInstanceId(outerSelectedInstanceId);
    }
  }, [outerSelectedInstanceId, selectedInstanceId]);

  const sortedByExcludedIdInstances = useMemo(() => {
    const results: (InventoryInstance & { comboboxValue: string })[] = (
      data?.results || []
    ).map((i) => ({
      ...i,
      comboboxValue: `${i.id} ${i.name}`,
    }));
    if (excludedInstanceIds) {
      results.sort(
        (a, b) =>
          Number(excludedInstanceIds.has(a.id)) -
          Number(excludedInstanceIds.has(b.id))
      );
    }

    return results;
  }, [data?.results, excludedInstanceIds]);

  const extractIdFromComboboxValue = (value: string) => {
    // First split is the id
    return value.split(' ')[0];
  };

  const InstanceComboboxPopoverTrigger = useMemo(() => {
    return (
      <PopoverTrigger disabled={disabled} asChild>
        <DaButton
          variant="outline-nocolor"
          className={clsx('!block !pl-2 w-full', className)}
          role="combobox"
        >
          {!isLoading ? (
            <DaText
              className="flex items-center justify-between"
              variant="small"
            >
              {selectedInstanceId
                ? sortedByExcludedIdInstances.find(
                    (instance) => instance.id === selectedInstanceId
                  )?.name
                : placeholder}
              <TbChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </DaText>
          ) : (
            <DaLoader className="m-auto !text-lg" />
          )}
        </DaButton>
      </PopoverTrigger>
    );
  }, [
    className,
    disabled,
    isLoading,
    placeholder,
    sortedByExcludedIdInstances,
    selectedInstanceId,
  ]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        {tooltipText ? (
          <DaTooltip content={tooltipText}>
            {InstanceComboboxPopoverTrigger}
          </DaTooltip>
        ) : (
          InstanceComboboxPopoverTrigger
        )}
        <PopoverContent className="w-[--radix-popover-trigger-width]">
          <Command>
            <CommandInput
              className="!outline-none"
              disabled={disabled}
              placeholder={placeholder}
            />
            <button
              onClick={() => {
                openCreateInstanceFormState[1](true);
                setOpen(false);
              }}
              className="text-sm w-full flex items-center text-left bg-da-primary-100 py-2 px-3 hover:bg-da-primary-300/50"
            >
              <TbPlus className="mr-2 h-4 w-4" /> Add Instance
            </button>
            <CommandList>
              <CommandEmpty>No instance found.</CommandEmpty>
              <CommandGroup>
                {sortedByExcludedIdInstances.map((instance) => (
                  <CommandItem
                    disabled={disabled || excludedInstanceIds?.has(instance.id)}
                    key={instance.comboboxValue}
                    value={instance.comboboxValue}
                    onSelect={(currentValue) => {
                      const extractedId =
                        extractIdFromComboboxValue(currentValue);
                      outerOnChangeSelectedInstanceId?.(
                        extractedId === selectedInstanceId ? '' : extractedId
                      );
                      setSelectedInstanceId(
                        extractedId === selectedInstanceId ? '' : extractedId
                      );
                      setOpen(false);
                    }}
                  >
                    <TbCheck
                      className={clsx(
                        'h-4 w-4',
                        selectedInstanceId === instance.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {instance.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DaPopup
        className="w-[1600px] max-w-[80vw] h-fit !max-h-[90vh] !overflow-y-auto"
        trigger={<></>}
        state={openCreateInstanceFormState}
      >
        <DaText variant="title" className="text-da-primary-500">
          Add {schema.name} Instance
        </DaText>
        <div className="mt-4" />
        <InstanceForm
          initialSchemaId={schema.id}
          allowSchemaChange={false}
          onSuccess={(result) => {
            openCreateInstanceFormState[1](false);
            outerOnChangeSelectedInstanceId?.(result.id);
            setSelectedInstanceId(result.id);
          }}
          redirectOnSuccess={false}
        />
      </DaPopup>
    </>
  );
}
