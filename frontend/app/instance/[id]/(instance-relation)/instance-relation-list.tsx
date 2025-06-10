/* eslint-disable @typescript-eslint/no-unused-vars */
import DaText from '@/components/atoms/DaText';
import {
  getInventoryInstanceRelations,
  getInventoryRelations,
} from '@/services/inventory.service';
import { List } from '@/types/common.type';
import {
  InventoryInstanceRelation,
  InventoryRelation,
} from '@/types/inventory.type';
import InstanceRelationForm from './instance-relation-form';

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
        Failed to fetch relations.
      </div>
    );
  }

  const outgoingRelations = relations.results.filter(
    (relation) => relation.source.id === schemaId
  );

  return (
    <div>
      {outgoingRelations.map((relation) => (
        <InstanceRelationItem
          schemaId={schemaId}
          relation={relation}
          instanceId={instanceId}
          key={relation.id}
        />
      ))}
    </div>
  );
}

async function InstanceRelationItem({
  relation,
  schemaId,
  instanceId,
}: {
  relation: InventoryRelation;
  schemaId: string;
  instanceId: string;
}) {
  let instanceRelations: List<InventoryInstanceRelation>;
  try {
    instanceRelations = await getInventoryInstanceRelations({
      relation: relation.id,
      source: instanceId,
    });
  } catch (error) {
    console.error('Failed to fetch relations:', error);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch instance relations.
      </div>
    );
  }

  return (
    <div key={relation.id} className="p-7 bg-white border mt-6 rounded-xl">
      <div className="flex items-center justify-between">
        <DaText variant="regular-bold">
          {relation.name} {relation.target.name}
        </DaText>

        {/* <DaButton size="sm" variant="outline-nocolor">
          <TbPlus className="mr-1" />
          Add Element
        </DaButton> */}
      </div>
      <InstanceRelationForm className="-mt-6" relation={relation} />
      <div className="border-t my-6" />

      {instanceRelations.results.length === 0 ? (
        <DaText variant="small">
          There&apos;s currently no relationship for this type.
        </DaText>
      ) : (
        <>
          {instanceRelations.results.map((instanceRelation) => (
            <div key={instanceRelation.id}>{instanceRelation.description}</div>
          ))}
        </>
      )}
    </div>
  );
}
