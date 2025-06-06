'use client';

import { ArcherContainer, ArcherElement } from 'react-archer';

export default function RelationItem() {
  return (
    <ArcherContainer strokeColor="black" className="flex">
      <div className="flex">
        <ArcherElement
          id="custom1"
          relations={[
            {
              targetId: 'sdv',
              targetAnchor: 'left',
              sourceAnchor: 'right',
              label: <p className="-mt-6 text-sm">Inherits</p>,
            },
          ]}
        >
          <button className="rounded-lg truncate block text-sm w-[200px] lg:w-[280px] border-dashed border-da-gray-medium text-center border p-3">
            Custom AWS Component
          </button>
        </ArcherElement>

        <ArcherElement id="sdv" relations={[]}>
          <button className="ml-60 lg:ml-80 truncate block rounded-lg text-sm w-[200px] lg:w-[280px] text-center border p-3">
            SDV System Artefact
          </button>
        </ArcherElement>
      </div>
    </ArcherContainer>
  );
}
