import DaText from '@/components/atoms/DaText';
import { getInventorySchema } from '@/services/inventory.service';
import InventorySchemaForm from '../../schema-form';

interface PageEditSchemaProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PageEditSchema({ params }: PageEditSchemaProps) {
  const { id } = await params;

  const response = await getInventorySchema(id);
  if (!response.success) {
    console.error('Failed to fetch schema:', response.errorMessage);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch schemas.
      </div>
    );
  }

  const schema = response.result;

  return (
    <div className="max-w-[1600px] mx-auto p-12">
      <div className="mx-auto bg-white shadow-small rounded-lg px-6 py-4">
        <div className="w-full flex justify-center">
          <DaText
            variant="title"
            className="text-2xl text-da-primary-500 font-bold mb-6 text-center"
          >
            Update Schema
          </DaText>
        </div>

        <InventorySchemaForm initialData={schema} isUpdating={true} />
      </div>
    </div>
  );
}
