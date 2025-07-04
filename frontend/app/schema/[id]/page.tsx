// Copyright (c) 2025 Eclipse Foundation.
// 
// This program and the accompanying materials are made available under the
// terms of the MIT License which is available at
// https://opensource.org/licenses/MIT.
//
// SPDX-License-Identifier: MIT

import { DaButton } from '@/components/atoms/DaButton';
import DaText from '@/components/atoms/DaText';
import DaUserProfile from '@/components/molecules/DaUserProfile';
import { getServerSession } from '@/lib/auth/server-session-auth';
import dayjs from 'dayjs';
import Link from 'next/link';
import { TbEdit, TbList, TbPlus } from 'react-icons/tb';
import DeleteSchema from './delete-schema';
import RelationForm from './(relation)/relation-form';
import {
  getInventoryRelations,
  getInventorySchema,
} from '@/services/inventory.service';
import RelationItem from './(relation)/relation-item';
import { Fragment } from 'react';

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
  const response = await getInventorySchema(id);
  if (!response.success) {
    console.error('Error fetching schema:', response.errorMessage);
    return (
      <div className="container mx-auto p-4">
        <DaText variant="title" className="text-red-500">
          Error fetching schema details.
        </DaText>
      </div>
    );
  }

  const schema = response.result;

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
              <Link href={`/instance/?schema=${schema.id}`}>
                <DaButton variant="plain" size="sm">
                  <TbList size={18} className="mr-1" /> View Instances
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

        <div className="mt-6 border-y flex gap-1 flex-col py-4 text-sm text-gray-500">
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
          {session?.id === schema.created_by?.id && (
            <RelationForm
              triggerWrapperClassName="ml-auto"
              trigger={
                <DaButton size="sm" variant="outline-nocolor">
                  <TbPlus className="mr-1" /> Add Relation
                </DaButton>
              }
              schemaId={schema.id}
              className="-mt-7"
            />
          )}
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
  const [outgoingRelationsResponse, incomingRelationsResponse] =
    await Promise.all([
      getInventoryRelations({
        source: schemaId,
      }),
      getInventoryRelations({
        target: schemaId,
      }),
    ]);

  if (!outgoingRelationsResponse.success) {
    console.error(
      'Error fetching outgoing relations:',
      outgoingRelationsResponse.errorMessage
    );
    return (
      <div className="container mx-auto p-4">
        <DaText variant="title" className="text-red-500">
          Error fetching outgoing relations.
        </DaText>
      </div>
    );
  }

  if (!incomingRelationsResponse.success) {
    console.error(
      'Error fetching incoming relations:',
      incomingRelationsResponse.errorMessage
    );
    return (
      <div className="container mx-auto p-4">
        <DaText variant="title" className="text-red-500">
          Error fetching incoming relations.
        </DaText>
      </div>
    );
  }

  const outgoingRelations = outgoingRelationsResponse.result;
  const incomingRelations = incomingRelationsResponse.result;
  incomingRelations.results = incomingRelations.results.filter(
    (relation) => relation.source.id !== relation.target.id
  );

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
      {outgoingRelations.results.length > 0 && (
        <>
          <DaText variant="small-bold" className="text-da-gray-darkest">
            Outgoing Relations ({outgoingRelations.totalResults})
          </DaText>
          <div className="rounded-xl mt-3 space-y-5 p-7 bg-white border">
            {outgoingRelations.results.map((relation, index) => (
              <Fragment key={relation.id}>
                <RelationItem schemaId={schemaId} relation={relation} />

                {index < outgoingRelations.results.length - 1 && (
                  <div className="border-t" />
                )}
              </Fragment>
            ))}
          </div>
        </>
      )}

      {incomingRelations.results.length > 0 && (
        <>
          <DaText
            variant="small-bold"
            className="block mt-7 text-da-gray-darkest"
          >
            Incoming Relations ({incomingRelations.results.length})
          </DaText>

          <div className="rounded-xl mt-3 space-y-5 p-7 bg-white border">
            {incomingRelations.results.map((relation, index) => (
              <Fragment key={relation.id}>
                <RelationItem
                  schemaId={schemaId}
                  reverseDirection
                  relation={relation}
                />

                {index < incomingRelations.results.length - 1 && (
                  <div className="border-t" />
                )}
              </Fragment>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
