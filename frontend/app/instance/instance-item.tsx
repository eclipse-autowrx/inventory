import { DaAvatar } from '@/components/atoms/DaAvatar';
import DaText from '@/components/atoms/DaText';
import { InventoryInstance } from '@/types/inventory.type';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';

interface InventoryInstanceProps {
  data: InventoryInstance;
}

export default async function InstanceItem({
  data: item,
}: InventoryInstanceProps) {
  return (
    <div className="p-4 -mx-4 rounded-lg h-[144px] flex gap-8 hover:bg-da-gray-light focus-within:outline focus-within:outline-2 focus-within:outline-da-primary-500 focus-within:outline-offset-2">
      <div className="h-full aspect-square">
        <object
          data={item.data?.image_url || '/imgs/default_photo.jpg'} // Use actual image URL if available
          type="image/png"
          className="h-full w-full object-cover border rounded select-none"
        >
          {/* Fallback Image */}
          <Image
            width={112}
            height={112}
            src="/imgs/default_photo.jpg"
            alt={item.name || 'Inventory Instance'}
            className="h-full rounded text-sm w-full object-cover"
          />
        </object>
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Link href={`/instance/${item.id}`}>
          <DaText
            variant="regular-bold"
            className="hover:underline truncate text-da-gray-darkest !block focus:outline-none"
          >
            {item.name}
          </DaText>
        </Link>
        <div className="flex mt-1 flex-wrap gap-2">
          <div className="rounded-full bg-da-gray-darkest text-white text-xs px-2 py-1">
            {item.schema.name || '-'}
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            {/* Provide default name if created_by or name is missing */}
            {item.created_by && (
              <>
                <DaAvatar
                  className="h-6 w-6"
                  src={item.created_by?.image_file}
                />
                <p className="text-xs text-da-gray-dark">
                  {item.created_by?.name || 'Unknown User'}
                </p>
              </>
            )}
          </div>
          {/* Render date only if valid */}
          {item.created_at && dayjs(item.created_at).isValid() && (
            <p className="cursor-pointer hover:underline text-xs">
              {dayjs(item.created_at).format('DD MMM YYYY - HH:mm')}{' '}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
