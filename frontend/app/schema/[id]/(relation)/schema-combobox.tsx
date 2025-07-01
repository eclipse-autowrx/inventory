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
import useListInventorySchemas from '@/hooks/useListInventorySchemas';
import clsx from 'clsx';
import { useEffect, useMemo, useState } from 'react';
import { TbCheck, TbChevronDown, TbPlus } from 'react-icons/tb';
import InventorySchemaForm from '../../schema-form';

interface SchemaComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  tooltipText?: string;
}

export default function SchemaCombobox({
  value: outerSelectedSchemaId,
  onChange: outerOnChangeSelectedSchemaId,
  placeholder,
  className,
  disabled,
  tooltipText,
}: SchemaComboboxProps) {
  const { data, isLoading } = useListInventorySchemas();

  const [open, setOpen] = useState(false);
  const [selectedSchemaId, setSelectedSchemaId] = useState(
    outerSelectedSchemaId || ''
  );

  const openCreateSchemaFormState = useState(false);

  useEffect(() => {
    if (
      outerSelectedSchemaId !== undefined &&
      outerSelectedSchemaId !== selectedSchemaId
    ) {
      setSelectedSchemaId(outerSelectedSchemaId);
    }
  }, [outerSelectedSchemaId, selectedSchemaId]);

  const schemas = useMemo(() => {
    return (data?.results || []).map((schema) => ({
      ...schema,
      comboboxValue: `${schema.id} ${schema.name}`,
    }));
  }, [data]);

  const extractIdFromComboboxValue = (value: string) => {
    return value.split(' ')[0];
  };

  const SchemaComboboxPopoverTrigger = useMemo(() => {
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
              {selectedSchemaId
                ? schemas.find((schema) => schema.id === selectedSchemaId)?.name
                : placeholder}
              <TbChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </DaText>
          ) : (
            <DaLoader className="m-auto !text-lg" />
          )}
        </DaButton>
      </PopoverTrigger>
    );
  }, [className, disabled, isLoading, placeholder, schemas, selectedSchemaId]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        {tooltipText ? (
          <DaTooltip content={tooltipText}>
            {SchemaComboboxPopoverTrigger}
          </DaTooltip>
        ) : (
          SchemaComboboxPopoverTrigger
        )}
        <PopoverContent className="w-[--radix-popover-trigger-width]">
          <Command>
            <CommandInput disabled={disabled} placeholder={placeholder} />
            <button
              onClick={() => {
                openCreateSchemaFormState[1](true);
                setOpen(false);
              }}
              className="text-sm w-full flex items-center text-left bg-da-primary-100 py-2 px-3 hover:bg-da-primary-300/50"
            >
              <TbPlus className="mr-2 h-4 w-4" /> Add Schema
            </button>
            <CommandList>
              <CommandEmpty>No schema found.</CommandEmpty>
              <CommandGroup>
                {schemas.map((schema) => (
                  <CommandItem
                    disabled={disabled}
                    key={schema.comboboxValue}
                    value={schema.comboboxValue}
                    onSelect={(currentValue) => {
                      const extractedId =
                        extractIdFromComboboxValue(currentValue);
                      outerOnChangeSelectedSchemaId?.(
                        extractedId === selectedSchemaId ? '' : extractedId
                      );
                      setSelectedSchemaId(
                        extractedId === selectedSchemaId ? '' : extractedId
                      );
                      setOpen(false);
                    }}
                  >
                    <TbCheck
                      className={clsx(
                        'h-4 w-4',
                        selectedSchemaId === schema.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {schema.name}
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
        state={openCreateSchemaFormState}
      >
        <InventorySchemaForm
          onSuccess={(result) => {
            openCreateSchemaFormState[1](false);
            outerOnChangeSelectedSchemaId?.(result.id);
            setSelectedSchemaId(result.id);
          }}
          redirectOnSuccess={false}
        />
      </DaPopup>
    </>
  );
}
