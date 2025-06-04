import DaText from '@/components/atoms/DaText';
import { getInventoryInstance } from '@/services/inventory.service';
import { InventoryInstanceDetail } from '@/types/inventory.type';
import InstanceForm from '../../instance-form';

interface PageEditInstanceProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function PageEditInstance({
  params,
}: PageEditInstanceProps) {
  const { id } = await params;
  let instance: InventoryInstanceDetail;
  try {
    instance = await getInventoryInstance(id);
  } catch (error) {
    console.error('Failed to fetch instance:', error);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch instance details.
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-12">
      <div className="mx-auto bg-white shadow-small rounded-lg px-6 py-4">
        <div className="w-full flex justify-center">
          <DaText
            variant="title"
            className="text-2xl text-da-primary-500 font-bold mb-6 text-center"
          >
            Update Instance
          </DaText>
        </div>
        <InstanceForm
          isUpdating
          initialData={instance}
          initialSchemaId={instance?.schema?.id}
        />
      </div>
    </div>
  );
}
