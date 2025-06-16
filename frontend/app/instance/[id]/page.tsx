import { DaButton } from '@/components/atoms/DaButton';
import DaText from '@/components/atoms/DaText';
import { getInventoryInstance } from '@/services/inventory.service';
import { InventoryInstanceDetail } from '@/types/inventory.type';
import Link from 'next/link';
import { TbEdit } from 'react-icons/tb';
import DeleteInstance from './delete-instance';
import dayjs from 'dayjs';
import { DaAvatar } from '@/components/atoms/DaAvatar';
import ShowSchema from './show-schema';
import InstanceRelationList from './(instance-relation)/instance-relation-list';

interface PageInstanceDetailProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PageInstanceDetail({
  params,
}: PageInstanceDetailProps) {
  const { id } = await params;
  const response = await getInventoryInstance(id);
  if (!response.success) {
    console.error('Failed to fetch instance:', response.errorMessage);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch instance details.
      </div>
    );
  }
  const instance = response.result;

  return (
    <div className="container text-sm pb-10 text-da-gray-dark">
      <div className="pt-5 flex md:flex-row flex-col gap-2 items-end py-3">
        <div className="flex flex-col gap-2 mr-10">
          <DaText variant="title" className="!block text-da-primary-500">
            {instance.name || '-'}
          </DaText>
          <div className="rounded-full w-fit bg-da-gray-darkest text-white px-2 py-1">
            <span>{instance.schema.name}</span>
          </div>
        </div>

        <div className="flex gap-2 items-end ml-auto">
          <Link href={`/instance/${id}/edit`}>
            <DaButton size="sm" variant="plain" className="!text-da-gray-dark">
              <TbEdit className="w-4 h-4 mr-1" />
              Edit
            </DaButton>
          </Link>

          <DeleteInstance instanceId={id} />
        </div>
      </div>

      <div className="border-t border-t-da-gray-light/50 mb-6" />

      <Detail instanceData={instance} />
    </div>
  );
}

const Detail = ({
  instanceData,
}: {
  instanceData: InventoryInstanceDetail;
}) => {
  const titleCase = (str: string) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const camelToTitleCase = (str: string) => {
    return titleCase(str.replace(/([A-Z])/g, ' $1').toLowerCase());
  };

  const snakeToTitleCase = (str: string) => {
    return titleCase(str.replace(/_/g, ' '));
  };

  const otherToTitleCase = (str: string) => {
    return snakeToTitleCase(camelToTitleCase(str));
  };

  return (
    <div className="flex gap-20 lg:flex-row flex-col">
      <div className="flex-1 min-w-0">
        <DaText variant="regular-bold" className="text-da-gray-darkest">
          Detail
        </DaText>
        <div className="flex md:flex-row flex-col gap-4 justify-between pt-5">
          {/* Render detail data */}
          <div className="flex flex-col gap-4 min-w-0 flex-1">
            {Object.entries(instanceData.data).map(([key, value]) => (
              <div key={key} className="flex">
                <DaText
                  variant="small"
                  className="inline-block text-da-gray-dark w-[240px]"
                >
                  {otherToTitleCase(key)}
                </DaText>
                {['string', 'number'].includes(typeof value) ? (
                  <DaText variant="small" className="text-da-gray-darkest ml-2">
                    {value}
                  </DaText>
                ) : (
                  <pre>{JSON.stringify(value, null, 4)}</pre>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-t-da-gray-light/50 my-6" />
        <DaText variant="regular-bold" className="text-da-gray-darkest">
          Metadata
        </DaText>
        <div className="flex md:flex-row flex-col gap-4 justify-between pt-5">
          <div className="flex flex-col gap-4 min-w-0 flex-1">
            <div>
              <DaText
                variant="small"
                className="inline-block text-da-gray-dark w-[240px]"
              >
                Created At
              </DaText>
              <DaText variant="small" className="text-da-gray-darkest ml-2">
                {dayjs(instanceData?.created_at).format(
                  'DD.MM.YYYY - HH:mm:ss'
                )}
              </DaText>
            </div>

            <div className="flex items-center -mt-0.5">
              <DaText
                variant="small"
                className="inline-block text-da-gray-dark w-[240px]"
              >
                Owner
              </DaText>
              <button className="flex cursor-pointer items-center hover:underline gap-2 ml-2">
                <DaAvatar
                  className="h-7 w-7"
                  src={instanceData.created_by?.image_file}
                />
                <p className="text-sm text-da-gray-darkest">
                  {instanceData.created_by?.name}
                </p>
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-t-da-gray-light/50 my-6" />
        <DaText variant="regular-bold" className="text-da-gray-darkest">
          Inventory Schema
        </DaText>
        <div className="flex flex-col items-start pt-5 gap-4">
          <div className="flex items-center h-[20px]">
            <DaText
              variant="small"
              className="inline-block text-da-gray-dark w-[240px]"
            >
              Name
            </DaText>
            <Link
              className="hover:underline group"
              href={`/schema/${instanceData.schema.id}`}
            >
              <DaText
                variant="small"
                className="group-hover:text-da-primary-500 text-da-gray-darkest ml-2"
              >
                {instanceData.schema?.name || '-'}
              </DaText>
            </Link>
          </div>

          <div>
            <DaText
              variant="small"
              className="inline-block text-da-gray-dark w-[240px]"
            >
              Description
            </DaText>
            <DaText variant="small" className="text-da-gray-darkest ml-2">
              {instanceData.schema?.description || '-'}
            </DaText>
          </div>

          <ShowSchema
            schemaDefinition={instanceData.schema.schema_definition}
          />
        </div>

        <div className="border-t border-t-da-gray-light/50 my-6" />
        <DaText variant="regular-bold" className="text-da-gray-darkest">
          Relationships
        </DaText>
        <InstanceRelationList
          instanceId={instanceData.id}
          schemaId={instanceData.schema.id}
        />
      </div>
    </div>
  );
};
