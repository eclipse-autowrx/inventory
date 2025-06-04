'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import Form from '@rjsf/fluent-ui';
import validator from '@rjsf/validator-ajv8'; // Use the AJV8 validator
import { RJSFSchema } from '@rjsf/utils';
import { IChangeEvent } from '@rjsf/core';
import { DaButton } from '@/components/atoms/DaButton';
import { DaInput } from '@/components/atoms/DaInput';
import { DaSelect, DaSelectItem } from '@/components/atoms/DaSelect';
import DaTooltip from '@/components/atoms/DaTooltip';
import CodeEditorWithSize from '@/components/molecules/CodeEditorWithSize';
import useListInventorySchemas from '@/hooks/useListInventorySchemas';
import { InventoryInstance } from '@/types/inventory.type';
import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { TbLoader } from 'react-icons/tb';
import { toast } from 'react-toastify';
import {
  createInventoryInstance,
  updateInventoryInstance,
} from '@/services/inventory.service';
import { useRouter } from 'next/navigation';

interface InstanceFormProps {
  isUpdating?: boolean;
  initialData?: InventoryInstance;
  initialSchemaId?: string;
}

export default function InstanceForm({
  isUpdating,
  initialData,
  initialSchemaId,
}: InstanceFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({});

  const [schemaId, setSchemaId] = useState(initialSchemaId || '');
  const { data: schemaList } = useListInventorySchemas();
  const schema = schemaList?.results.find((s) => s.id === schemaId);

  const formRef = useRef<any>(null);

  const [instanceName, setInstanceName] = useState('');
  const [instanceNameError, setInstanceNameError] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [schemaError, setSchemaError] = useState('');
  const [triedSubmitting, setTriedSubmitting] = useState(false);

  const [dataFillingMode, setDataFillingMode] = useState<'form' | 'code'>(
    'form'
  );
  const [code, setCode] = useState<string>(`{
}`);
  const [codeDataError, setCodeDataError] = useState<string>('');

  useEffect(() => {
    if (initialSchemaId) setSchemaId(initialSchemaId);
  }, [initialSchemaId]);

  // Update state with initial data if provided
  useEffect(() => {
    if (initialData) {
      setInstanceName(initialData.name);
      setFormData(initialData.data);
      setCode(JSON.stringify(initialData.data, null, 2));
    }
  }, [initialData]);

  useEffect(() => {
    if (triedSubmitting) {
      setSchemaError(!!schema ? '' : 'Schema is required.');
      setInstanceNameError(instanceName ? '' : 'Instance name is required.');
    }
  }, [triedSubmitting, schema, instanceName]);

  const OptionalTooltipWrapper = useCallback(
    ({ children }: { children: React.ReactNode }) => {
      if (isUpdating) {
        return (
          <DaTooltip content="Updating schema is not allowed.">
            {children}
          </DaTooltip>
        );
      }
      return <>{children}</>;
    },
    [isUpdating]
  );

  const handleSubmitForm = async (schemaId: string, data: any) => {
    if (!schemaId) {
      toast.error('Schema ID is missing.');
      return;
    }

    setLoading(true);
    setError(null);

    if (!isUpdating) {
      try {
        const instance = await createInventoryInstance(schemaId, data);
        toast.success('Instance created successfully!');
        router.push(`/inventory/instance/${instance.id}`);
      } catch (error) {
        setError((error as Error).message || 'Failed to create instance.');
        setLoading(false);
      }
    } else {
      try {
        if (!initialData) {
          setError('No initial data provided for update.');
          setLoading(false);
          return;
        }
        await updateInventoryInstance(initialData.id, data);
        router.push(`/inventory/instance/${initialData.id}`);
      } catch (error) {
        setError((error as Error).message || 'Failed to update instance.');
        setLoading(false);
      }
    }
  };

  const handleSubmitDataFillingCodeMode = async () => {
    try {
      const parsedJSON = JSON.parse(code);
      await handleSubmitForm(schemaId, {
        data: parsedJSON,
        name: instanceName,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setCodeDataError('Invalid JSON string. Please check your data again.');
    }
  };

  const handleSubmitDataFillingFormMode:
    | ((
        data: IChangeEvent<any, RJSFSchema, any>,
        event: React.FormEvent<any>
      ) => void)
    | undefined = async ({ formData }, e) => {
    e.preventDefault();
    if (!schemaId || instanceNameError || schemaError) {
      return;
    }

    await handleSubmitForm(schemaId, {
      data: formData,
      name: instanceName,
    });
  };

  // Special handler for the auto-gen form
  const handleSubmitBtnClick = () => {
    setTriedSubmitting(true);
    if (!instanceName) {
      setInstanceNameError('Instance name is required.');
    }
    if (!schema) setSchemaError('Schema is required.');
    else if (dataFillingMode === 'form') {
      formRef.current?.submit();
    } else {
      handleSubmitDataFillingCodeMode();
    }
  };

  const onCancel = () => {};

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      <div className="min-w-[360px]">
        <label
          htmlFor="instance-name"
          className="block da-txt-small font-medium text-da-gray-medium mb-[10px]"
        >
          Instance Name <span className="text-red-500">*</span>
        </label>
        <DaInput
          value={instanceName}
          onChange={(e) => {
            setInstanceName(e.target.value);
          }}
          disabled={loading}
          type="text"
          id="instance-name"
        />

        {instanceNameError && (
          <div className="text-red-600 da-txt-small mt-2">
            {instanceNameError}
          </div>
        )}

        <label
          htmlFor="schema-id"
          className="block da-txt-small font-medium
        text-da-gray-medium mb-[10px] mt-4"
        >
          Schema <span className="text-red-500">*</span>
        </label>
        <OptionalTooltipWrapper>
          <DaSelect
            disabled={isUpdating}
            value={schemaId}
            onValueChange={(value) => {
              setSchemaId(value);
              setFormData({});
            }}
          >
            {schemaList?.results.map((schema) => (
              <DaSelectItem key={schema.id} value={schema.id}>
                {schema.name}
              </DaSelectItem>
            ))}
          </DaSelect>
        </OptionalTooltipWrapper>

        {schemaError && (
          <div className="text-red-600 da-txt-small mt-2">{schemaError}</div>
        )}
        <div className="border-t mt-4 mb-2" />

        <ControlButtons
          className="w-0 h-0 hidden pointer-events-none xl:block xl:w-auto xl:h-auto xl:pointer-events-auto"
          error={error}
          onCancel={onCancel}
          onSubmit={handleSubmitBtnClick}
          isUpdating={isUpdating}
          loading={loading}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex gap-2 items-center mb-1">
          <label
            htmlFor="schema_definition"
            className="block da-txt-small font-medium text-da-gray-medium"
          >
            Data <span className="text-red-500">*</span>
          </label>
          <div className="grow" />

          <div
            className={clsx(
              'border flex overflow-hidden rounded-md items-center',
              dataFillingMode === 'code' && 'mr-28'
            )}
          >
            <button
              onClick={() => setDataFillingMode('form')}
              className={clsx(
                'text-xs px-3 text-da-gray-dark py-[5px]',
                dataFillingMode === 'form'
                  ? 'bg-da-gray-darkest text-white'
                  : ''
              )}
            >
              Form
            </button>
            <button
              onClick={() => setDataFillingMode('code')}
              className={clsx(
                'text-xs px-3 text-da-gray-dark py-[5px]',
                dataFillingMode === 'code'
                  ? 'bg-da-gray-darkest text-white'
                  : ''
              )}
            >
              Code
            </button>
          </div>
        </div>
        {dataFillingMode === 'form' && (
          <div className="border rounded-md min-h-[calc(100vh-320px)] px-8 pt-4 pb-8">
            {schema ? (
              <Form
                ref={formRef}
                autoComplete="off"
                formData={formData}
                schema={schema.schema_definition} // Pass the schema definition
                validator={validator} // Pass the validator instance
                onSubmit={handleSubmitDataFillingFormMode} // Handle form submission
                onChange={({ formData }) => {
                  setFormData(formData);
                }}
                disabled={loading} // Disable form while submitting
              >
                {true}
              </Form>
            ) : (
              <p>Please choose a schema first.</p>
            )}
          </div>
        )}
        {dataFillingMode === 'code' && (
          <div className="-mt-8">
            <CodeEditorWithSize
              code={code}
              language="json"
              onBlur={() => {}}
              setCode={setCode}
              editable={!loading}
            />
          </div>
        )}
      </div>
      {dataFillingMode === 'code' && codeDataError && (
        <div className="text-red-600 da-txt-small mt-2">{codeDataError}</div>
      )}

      <ControlButtons
        className="xl:hidden xl:w-0 xl:h-0 xl:pointer-events-none"
        error={error}
        onCancel={onCancel}
        onSubmit={handleSubmitBtnClick}
        isUpdating={isUpdating}
        loading={loading}
      />
    </div>
  );
}

interface ControlButtonsProps {
  error?: string | null;
  onCancel?: () => void;
  onSubmit: () => void;
  loading?: boolean;
  isUpdating?: boolean;
  className?: string;
}

const ControlButtons = ({
  error,
  onCancel,
  onSubmit,
  loading,
  isUpdating,
  className,
}: ControlButtonsProps) => {
  return (
    <div className={clsx('mt-16 xl:mt-0', className)}>
      {/* Global Form Error */}
      {error && (
        <div
          className="text-red-600 da-txt-regular mt-2 text-center"
          role="alert"
        >
          Error: {error}
        </div>
      )}
      {/* Custom Submit Button */}
      <div className="mt-6 flex justify-end gap-3">
        <DaButton variant="outline-nocolor" onClick={onCancel}>
          Cancel
        </DaButton>
        <DaButton onClick={onSubmit} disabled={loading}>
          {loading ? (
            <>
              <TbLoader className="mr-1 animate-spin" /> Submitting...
            </>
          ) : isUpdating ? (
            'Update Instance'
          ) : (
            'Create Instance'
          )}
        </DaButton>
      </div>
    </div>
  );
};
