import DaText from '@/components/atoms/DaText';
import InstanceForm from '../instance-form';

interface PageNewInstanceProps {
  searchParams: Promise<{
    schemaId?: string;
  }>;
}

export default async function PageNewInstance({
  searchParams,
}: PageNewInstanceProps) {
  const { schemaId } = (await searchParams) || {};

  return (
    <div className="max-w-[1600px] mx-auto p-12">
      <div className="rounded-lg shadow-small px-6 py-4 bg-white mx-auto">
        <div className="w-full flex justify-center">
          <DaText
            variant="title"
            className="text-2xl text-da-primary-500 font-bold mb-6 text-center"
          >
            Create New Instance
          </DaText>
        </div>
        <InstanceForm initialSchemaId={schemaId} />
      </div>
    </div>
  );
}
