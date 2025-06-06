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
import DaText from '@/components/atoms/DaText';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/atoms/popover';
import clsx from 'clsx';
import { useState } from 'react';
import { TbCheck, TbChevronDown, TbPlus } from 'react-icons/tb';

interface SchemaComboboxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const schemas = [
  {
    value: 'abc',
    label: 'ABC Framework',
  },
];

export default function SchemaCombobox({
  value: outerValue,
  onChange: outerOnChange,
  placeholder,
  className,
  disabled,
}: SchemaComboboxProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(outerValue || '');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={disabled} asChild>
        <DaButton
          variant="outline-nocolor"
          className={clsx('!block !pl-2 w-full', className)}
          role="combobox"
        >
          <DaText className="flex items-center justify-between" variant="small">
            {value
              ? schemas.find((schema) => schema.value === value)?.label
              : placeholder}
            <TbChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </DaText>
        </DaButton>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width]">
        <Command>
          <CommandInput disabled={disabled} placeholder={placeholder} />
          <button className="text-sm w-full flex items-center text-left bg-da-primary-100 py-2 px-3 hover:bg-da-primary-300/50">
            <TbPlus className="mr-2 h-4 w-4" /> Add Schema
          </button>
          <CommandList>
            <CommandEmpty>No schema found.</CommandEmpty>
            <CommandGroup>
              {schemas.map((schema) => (
                <CommandItem
                  disabled={disabled}
                  key={schema.value}
                  value={schema.value}
                  onSelect={(currentValue) => {
                    outerOnChange?.(currentValue === value ? '' : currentValue);
                    setValue(currentValue === value ? '' : currentValue);
                    setOpen(false);
                  }}
                >
                  <TbCheck
                    className={clsx(
                      'h-4 w-4',
                      value === schema.value ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  {schema.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
