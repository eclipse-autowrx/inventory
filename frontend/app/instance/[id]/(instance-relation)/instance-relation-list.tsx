/* eslint-disable @typescript-eslint/no-unused-vars */
import { getInventoryRelations } from '@/services/inventory.service';
import { List } from '@/types/common.type';
import { InventoryRelation } from '@/types/inventory.type';

interface InstanceRelationListProps {
  instanceId: string;
  schemaId: string;
}

export default async function InstanceRelationList({
  instanceId,
  schemaId,
}: InstanceRelationListProps) {
  let relations: List<InventoryRelation>;
  try {
    relations = await getInventoryRelations({
      source: schemaId,
    });
  } catch (error) {
    console.error('Failed to fetch relations:', error);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch instance relations.
      </div>
    );
  }
  return null;
}
