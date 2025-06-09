import { DaButton } from '@/components/atoms/DaButton';
import DaText from '@/components/atoms/DaText';
import DaUserProfile from '@/components/molecules/DaUserProfile';
import { getServerSession } from '@/lib/auth/server-session-auth';
import { InventoryRelation, InventorySchema } from '@/types/inventory.type';
import dayjs from 'dayjs';
import Link from 'next/link';
import { TbEdit, TbPencil, TbPlus } from 'react-icons/tb';
import DeleteSchema from './delete-schema';
import RelationForm from './(relation)/relation-form';
import {
  getInventoryRelations,
  getInventorySchema,
} from '@/services/inventory.service';
import { List } from '@/types/common.type';
import RelationItem from './(relation)/relation-item';
import DeleteRelation from './(relation)/delete-relation';

interface PageSchemaDetailProps {
  params: {
    id: string;
  };
}

export default async function PageSchemaDetail({
  params,
}: PageSchemaDetailProps) {
  const { id } = await params;

  const session = await getServerSession();

  let schema: InventorySchema;
  try {
    schema = await getInventorySchema(id);
  } catch (error) {
    console.error('Error fetching schema:', error);
    return (
      <div className="container mx-auto p-4">
        <DaText variant="title" className="text-red-500">
          Error fetching schema details.
        </DaText>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="rounded-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
          <div className="flex-grow">
            <DaText variant="title" className="!text-da-primary-500">
              {schema.name}
            </DaText>
            <br />
            <DaText variant="small">
              {schema.description || 'No description provided.'}
            </DaText>
          </div>
          {session?.id === schema.created_by?.id && (
            <div className="flex flex-shrink-0 space-x-2">
              <Link href={`/instance/new?schemaId=${schema.id}`}>
                <DaButton size="sm">
                  <TbPlus size={18} className="mr-1" /> New Instance
                </DaButton>
              </Link>
              <Link
                href={`/schema/${schema.id}/edit`} // Adjust route as needed
              >
                <DaButton variant="plain" size="sm">
                  <TbEdit size={18} className="mr-1" /> Edit
                </DaButton>
              </Link>
              <DeleteSchema schemaId={schema.id} />
            </div>
          )}
        </div>

        <div className="mt-6">
          <DaText variant="regular-bold">Schema Definition</DaText>
          <pre className="bg-gray-100 mt-1 p-4 rounded-md overflow-auto text-sm">
            <code>{JSON.stringify(schema.schema_definition, null, 2)}</code>
          </pre>
        </div>

        <div className="mt-6 border-t flex gap-1 flex-col pt-4 text-sm text-gray-500">
          <div className="flex gap-1 items-center">
            Created By:{' '}
            {schema.created_by ? (
              <DaUserProfile
                userName={schema.created_by.name}
                userAvatar={schema.created_by.image_file}
              />
            ) : (
              'N/A'
            )}
          </div>
          <DaText variant="small">
            Created At: {dayjs(schema.created_at).format('DD-MM-YYYY HH:mm:ss')}
          </DaText>
        </div>

        <div className="mt-6">
          <DaText variant="regular-bold">Relations</DaText>

          <RelationForm currentSchemaId={schema.id} className="-mt-7" />

          <RelationList schemaId={id} />
        </div>
      </div>
    </div>
  );
}

interface RelationListProps {
  schemaId: string;
}
async function RelationList({ schemaId }: RelationListProps) {
  let outgoingRelations: List<InventoryRelation>,
    incomingRelations: List<InventoryRelation>;

  try {
    [outgoingRelations, incomingRelations] = await Promise.all([
      getInventoryRelations({
        source: schemaId,
      }),
      getInventoryRelations({
        target: schemaId,
      }),
    ]);
  } catch (error) {
    console.error('Error fetching relations:', error);
    return (
      <div className="container mx-auto p-4">
        <DaText variant="title" className="text-red-500">
          Error fetching relations.
        </DaText>
      </div>
    );
  }

  if (
    outgoingRelations.results.length === 0 &&
    incomingRelations.results.length === 0
  ) {
    return (
      <div className="h-[200px] mt-4">
        There is no relation defined for this schema.
      </div>
    );
  }

  return (
    <div className="mt-7">
      <DaText variant="small-bold" className="text-da-gray-darkest">
        Outgoing Relations ({outgoingRelations.totalResults})
      </DaText>
      <div className="rounded-xl mt-3 space-y-5 p-7 bg-white border">
        <div className="flex gap-6 items-center w-full justify-between">
          <div className="max-w-[800px] flex-1">
            <RelationItem />
          </div>
          <div className="flex">
            <DaButton size="sm" variant="plain">
              <TbPencil className="mr-2" /> Edit
            </DaButton>
            <DeleteRelation />
          </div>
        </div>

        <div className="border-t" />

        <div className="flex gap-6 items-center w-full justify-between">
          <div className="max-w-[800px] flex-1">
            <RelationItem />
          </div>
          <div className="flex">
            <DaButton size="sm" variant="plain">
              <TbPencil className="mr-2" /> Edit
            </DaButton>
            <DeleteRelation />
          </div>
        </div>
      </div>

      <DaText variant="small-bold" className="block mt-7 text-da-gray-darkest">
        Incoming Relations ({incomingRelations.totalResults})
      </DaText>

      <div className="rounded-xl mt-3 space-y-5 p-7 bg-white border">
        <div className="flex gap-6 items-center w-full justify-between">
          <div className="max-w-[800px] flex-1">
            <RelationItem />
          </div>
          <div className="flex">
            <DaButton size="sm" variant="plain">
              <TbPencil className="mr-2" /> Edit
            </DaButton>
            <DeleteRelation />
          </div>
        </div>

        <div className="border-t" />

        <div className="flex gap-6 items-center w-full justify-between">
          <div className="max-w-[800px] flex-1">
            <RelationItem />
          </div>
          <div className="flex">
            <DaButton size="sm" variant="plain">
              <TbPencil className="mr-2" /> Edit
            </DaButton>
            <DeleteRelation />
          </div>
        </div>
      </div>
    </div>
  );
}
