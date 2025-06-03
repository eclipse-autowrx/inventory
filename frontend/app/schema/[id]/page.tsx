import { DaButton } from '@/components/atoms/DaButton';
import DaText from '@/components/atoms/DaText';
import DaUserProfile from '@/components/molecules/DaUserProfile';
import { apiConfig } from '@/configs/api';
import { attachAuthApiFetch } from '@/lib/attach-auth-api-fetch';
import { getServerSession } from '@/lib/auth/server-session-auth';
import { InventorySchema } from '@/types/inventory.type';
import dayjs from 'dayjs';
import Link from 'next/link';
import { TbEdit, TbPlus } from 'react-icons/tb';
import DeleteSchema from './delete-schema';

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

  const res = await attachAuthApiFetch(
    `${apiConfig.baseUrl}/inventory/schemas/${id}`
  );

  const schema = (await res.json()) as InventorySchema;

  if (!res.ok) {
    console.error('Failed to fetch schema:', schema);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch schema details.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg">
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
      </div>
    </div>
  );
}
