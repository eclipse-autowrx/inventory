import DaText from '@/components/atoms/DaText';
import {
  getInventoryInstanceRelations,
  getInventoryRelations,
} from '@/services/inventory.service';
import { InventoryRelation } from '@/types/inventory.type';
import InstanceRelationForm from './instance-relation-form';
import Link from 'next/link';
import DaTooltip from '@/components/atoms/DaTooltip';
import { DaButton } from '@/components/atoms/DaButton';
import { TbEdit } from 'react-icons/tb';
import DeleteInstanceRelation from './delete-instance-relation';
import { getServerSession } from '@/lib/auth/server-session-auth';

interface InstanceRelationListProps {
  instanceId: string;
  schemaId: string;
}

export default async function InstanceRelationList({
  instanceId,
  schemaId,
}: InstanceRelationListProps) {
  const response = await getInventoryRelations({
    source: schemaId,
  });
  if (!response.success) {
    console.error('Failed to fetch relations:', response.errorMessage);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch relations.
      </div>
    );
  }
  const relations = response.result;

  const outgoingRelations = relations.results.filter(
    (relation) => relation.source.id === schemaId
  );

  return (
    <div>
      {outgoingRelations.map((relation) => (
        <RelationItem
          relation={relation}
          instanceId={instanceId}
          key={relation.id}
        />
      ))}
    </div>
  );
}

async function RelationItem({
  relation,
  instanceId,
}: {
  relation: InventoryRelation;
  instanceId: string;
}) {
  const currentUserSession = await getServerSession();
  const response = await getInventoryInstanceRelations({
    relation: relation.id,
    source: instanceId,
  });
  if (!response.success) {
    console.error('Failed to fetch relations:', response.errorMessage);
    return (
      <div className="w-full min-h-[280px] flex items-center justify-center">
        Failed to fetch instance relations.
      </div>
    );
  }

  const instanceRelations = response.result;

  const excludedInstanceIds = new Set<string>([
    instanceId,
    ...instanceRelations.results.map((ir) => ir.target.id),
  ]);

  return (
    <div key={relation.id} className="p-7 bg-white border mt-6 rounded-xl">
      <div className="flex items-center justify-between">
        <DaText variant="regular-bold">
          {relation.name} {relation.target.name}
        </DaText>
      </div>
      <InstanceRelationForm
        currentInstanceId={instanceId}
        className="-mt-6"
        excludedInstanceIds={excludedInstanceIds}
        relation={relation}
      />
      <div className="border-t mt-6 my-5" />
      {instanceRelations.results.length === 0 ? (
        <DaText variant="small">
          There&apos;s currently no relationship for this type.
        </DaText>
      ) : (
        <div>
          <div className="flex h-12 gap-x-4 items-center">
            <div className="text-da-gray-darkest font-semibold flex-1">
              Target Name
            </div>
            <div className="text-da-gray-darkest font-semibold flex-1">
              Description
            </div>
            <div className="text-da-gray-darkest font-semibold flex-1">
              Metadata
            </div>
            <div className="text-da-gray-darkest font-semibold min-w-14">
              Actions
            </div>
          </div>
          <ul>
            {instanceRelations.results.map((instanceRelation) => (
              <li
                className="flex h-12 gap-x-4 border-t border-dashed items-center"
                key={instanceRelation.id}
              >
                <div className="flex-1">
                  <DaTooltip content={instanceRelation.target.name}>
                    <Link
                      className="text-da-gray-darkest h-12 line-clamp-1 flex items-center hover:underline hover:text-da-primary-500"
                      href={`/instance/${instanceRelation.target.id}`}
                    >
                      {instanceRelation.target.name}
                    </Link>
                  </DaTooltip>
                </div>
                <div className="flex-1">
                  {instanceRelation.description && (
                    <DaTooltip content={instanceRelation.description}>
                      <div className="line-clamp-1 flex items-center h-10">
                        {instanceRelation.description}
                      </div>
                    </DaTooltip>
                  )}
                </div>
                <div className="flex-1">
                  {instanceRelation.metadata && (
                    <DaTooltip content={instanceRelation.metadata}>
                      <div className="line-clamp-1 flex items-center h-10">
                        {instanceRelation.metadata}
                      </div>
                    </DaTooltip>
                  )}
                </div>
                <div className="min-w-14">
                  {currentUserSession?.id &&
                    currentUserSession.id ===
                      instanceRelation.created_by?.id && (
                      <>
                        <DaButton size="sm" variant="plain">
                          <TbEdit size={16} />
                        </DaButton>
                        <DeleteInstanceRelation
                          instanceRelation={instanceRelation}
                        />
                      </>
                    )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
