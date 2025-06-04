'use client';

import { DaButton } from '@/components/atoms/DaButton';
import { DaInput } from '@/components/atoms/DaInput';
import { DaTextarea } from '@/components/atoms/DaTextarea';
import CodeEditorWithSize from '@/components/molecules/CodeEditorWithSize';
import {
  createInventorySchema,
  updateInventorySchema,
} from '@/services/inventory.service';
import {
  InventorySchema,
  InventorySchemaFormData,
} from '@/types/inventory.type';
import Ajv from 'ajv';
import clsx from 'clsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  useForm,
  SubmitHandler,
  FieldError,
  useController,
} from 'react-hook-form';
import { TbLoader } from 'react-icons/tb';

const ajv = new Ajv();

const isValidJsonSchema = async (value: string): Promise<boolean | string> => {
  value = value.trim();
  if (!value && value !== '') return 'Schema definition cannot be empty.';
  let object = null;
  try {
    object = JSON.parse(value);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    return 'Invalid JSON format.'; // Return error message
  }

  try {
    const validate = ajv.compile(object);
    validate(object);
  } catch (error) {
    return `Schema validation error: ${(error as Error).message}`;
  }

  return true;
};

const defaultJsonSchema = `{
  "$schema": "http://json-schema.org/draft-07/schema#"
}`;

interface SchemaFormProps {
  initialData?: InventorySchema; // Use the actual Schema type for initial data structure
  isUpdating?: boolean;
}

const InventorySchemaForm: React.FC<SchemaFormProps> = ({
  initialData,
  isUpdating = false,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Use the SchemaFormData type with useForm
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<InventorySchemaFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      schema_definition: initialData?.schema_definition
        ? JSON.stringify(initialData.schema_definition, null, 2)
        : defaultJsonSchema,
    },
  });
  const {
    field: {
      onChange: onSchemaDefinitionChange,
      value: schemaDefinitionValue,
      onBlur: onSchemaDefinitionBlur,
    },
  } = useController({
    name: 'schema_definition',
    control,
    rules: {
      required: 'Schema definition is required.',
      validate: isValidJsonSchema,
    },
  });

  // Reset form if initialData changes (useful for update form)
  useEffect(() => {
    reset({
      name: initialData?.name || '',
      description: initialData?.description || '',
      schema_definition: initialData?.schema_definition
        ? JSON.stringify(initialData.schema_definition, null, 2)
        : defaultJsonSchema,
    });
  }, [initialData, reset]);

  const handleCreateSchema: SubmitHandler<InventorySchemaFormData> = async (
    formData
  ) => {
    const newSchema = await createInventorySchema(formData);
    router.push(`/schema/${newSchema.id}`);
  };

  const handleUpdateSchema: SubmitHandler<InventorySchemaFormData> = async (
    formData
  ) => {
    if (!initialData) {
      console.error('No initial data provided for update.');
      return;
    }
    await updateInventorySchema(initialData.id, formData);
    router.push(`/schema/${initialData.id}`);
  };

  // handleSubmit already ensures data matches SchemaFormData type
  const handleFormSubmit: SubmitHandler<InventorySchemaFormData> = async (
    data
  ) => {
    try {
      setLoading(true);
      if (!isUpdating) {
        await handleCreateSchema(data);
      } else {
        await handleUpdateSchema(data);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(
        (error as Error)?.message ||
          'An error occurred while submitting the form.'
      );
      setLoading(false);
    }
  };

  // Helper to get error message string
  const getErrorMessage = (
    error: FieldError | undefined
  ): string | undefined => {
    return error?.message;
  };

  return (
    // Pass the typed handler to onSubmit
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col xl:flex-row gap-8"
    >
      <div className="space-y-6 xl:w-[360px]">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block da-txt-small font-medium text-da-gray-medium mb-[10px]"
          >
            Schema Name <span className="text-red-500">*</span>
          </label>
          <DaInput
            type="text"
            id="name"
            inputClassName="!px-3"
            {...register('name', {
              required: 'Schema name is required.',
            })}
            disabled={loading}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <p className="mt-1 da-txt-small text-red-600" role="alert">
              {getErrorMessage(errors.name)}
            </p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label
            htmlFor="description"
            className="block da-txt-small font-medium text-da-gray-medium mb-[10px]"
          >
            Description
          </label>
          <DaTextarea
            id="description"
            rows={3}
            {...register('description')} // Optional field
            disabled={loading}
          />
        </div>

        <ControlButtons
          className="w-0 h-0 hidden pointer-events-none xl:block xl:w-auto xl:h-auto xl:pointer-events-auto"
          error={error}
          loading={loading}
          isUpdating={isUpdating}
        />
      </div>

      <div className="flex-1 min-w-0">
        {/* Schema Definition Field (Textarea) */}
        <CodeEditorWithSize
          onBlur={onSchemaDefinitionBlur}
          onChange={onSchemaDefinitionChange}
          code={schemaDefinitionValue}
          loading={loading}
          title={
            <>
              Schema Definition (JSON){' '}
              {!isUpdating && <span className="text-red-500">*</span>}
            </>
          }
        />

        {errors.schema_definition && (
          <p className="mt-1 da-txt-small text-red-600" role="alert">
            {getErrorMessage(errors.schema_definition)}
          </p>
        )}
      </div>

      <ControlButtons
        className="xl:hidden xl:w-0 -mt-4 xl:h-0 xl:pointer-events-none"
        error={error}
        loading={loading}
        isUpdating={isUpdating}
      />
    </form>
  );
};

interface ControlButtonProps {
  error: string | null;
  loading?: boolean;
  isUpdating?: boolean;
  className?: string;
}

const ControlButtons = ({
  error,
  loading,
  isUpdating,
  className,
}: ControlButtonProps) => {
  return (
    <div className={className}>
      {/* Global Form Error */}
      {error && (
        <div className="mt-4 text-red-600 text-center" role="alert">
          Error: {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
        <Link href="/schema">
          <DaButton variant="outline-nocolor">Cancel</DaButton>
        </Link>
        <DaButton
          type="submit"
          disabled={loading}
          className={clsx(
            'bg-da-primary-500 text-white font-bold py-2 px-4 rounded transition duration-300',
            loading && 'opacity-50 !cursor-not-allowed'
          )}
        >
          {loading ? (
            <span className="flex items-center">
              <TbLoader size={18} className="mr-2 animate-spin" /> Saving...
            </span>
          ) : isUpdating ? (
            'Update Schema'
          ) : (
            'Create Schema'
          )}
        </DaButton>
      </div>
    </div>
  );
};

export default InventorySchemaForm;
