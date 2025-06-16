import { DaButton } from '@/components/atoms/DaButton';
import { getServerSession } from '@/lib/auth/server-session-auth';
import Link from 'next/link';
import { TbCirclePlus } from 'react-icons/tb';
import SchemaItem from './schema-item';
import { getInventorySchemas } from '@/services/inventory.service';

export default async function PageSchema() {
  const session = await getServerSession();

  const response = await getInventorySchemas();
  if (!response.success) {
    console.error('Failed to fetch schemas:', response.errorMessage);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch schemas.
      </div>
    );
  }

  const schemas = response.result;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold da-txt-medium text-da-gray-dark">Schemas</h1>
        <Link href="/schema/new">
          <DaButton size="sm">
            <TbCirclePlus className="mr-1" /> Create New Schema
          </DaButton>
        </Link>
      </div>

      {schemas.results.length === 0 ? (
        <p>No schemas found.</p>
      ) : (
        <div className="overflow-x-auto shadow-small rounded-lg">
          <table className="min-w-full leading-normal">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-5 py-3 border-b-2 da-txt-small text-da-gray-dark text-left border-da-gray-light tracking-wider">
                  Name
                </th>
                <th className="px-5 py-3 border-b-2 da-txt-small text-da-gray-dark text-left border-da-gray-light tracking-wider">
                  Description
                </th>
                <th className="w-[200px] pl-7 pr-5 py-3 border-b-2 da-txt-small text-da-gray-dark text-left border-da-gray-light tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {schemas.results.map((schema) => (
                <SchemaItem
                  currentUserId={session?.id}
                  schema={schema}
                  key={schema.id}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
