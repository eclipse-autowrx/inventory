'use client';

import { DaAvatar } from '@/components/atoms/DaAvatar';
import { DaButton } from '@/components/atoms/DaButton';
import DaFileUpload from '@/components/atoms/DaFileUpload';
import DaMenu from '@/components/atoms/DaMenu';
import DaText from '@/components/atoms/DaText';
import { InventoryItem } from '@/types/inventory.type';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useState } from 'react';
import {
  TbChevronDown,
  TbCopy,
  TbEdit,
  TbEye,
  TbEyeOff,
  TbPlus,
} from 'react-icons/tb';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DaInput } from '@/components/atoms/DaInput';
import { DaSelect, DaSelectItem } from '@/components/atoms/DaSelect';
import { types, typeToImage } from '@/lib/mock/data';
import useCurrentInventoryData from '@/hooks/useCurrentInventoryData';
import { DaTextarea } from '@/components/atoms/DaTextarea';

const tabs = [
  {
    key: 'general',
    name: 'General',
    path: '',
  },

  {
    key: 'activities',
    name: 'Activities (1)',
    path: 'activities',
  },
  {
    key: 'access-control',
    name: 'Access Control (1)',
    path: 'access-control',
  },
];

const General = ({ data: item }: { data: InventoryItem }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [showLinkElementForm, setShowLinkElementForm] = useState(false);
  const [showLinkElementForm2, setShowLinkElementForm2] = useState(false);
  const [elements, setElements] = useState<Set<string>>(new Set([]));
  const params = useParams();
  const id = params.slug?.at(0);

  const titleCase = (str: string) => {
    return str
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const camelToTitleCase = (str: string) => {
    return titleCase(str.replace(/([A-Z])/g, ' $1').toLowerCase());
  };

  const snakeToTitleCase = (str: string) => {
    return titleCase(str.replace(/_/g, ' '));
  };

  const otherToTitleCase = (str: string) => {
    return snakeToTitleCase(camelToTitleCase(str));
  };

  return (
    <div className="flex gap-20 lg:flex-row flex-col">
      <div className="flex-1 min-w-0">
        <DaText variant="regular-bold" className="text-da-gray-darkest">
          Information
        </DaText>
        <div className="flex md:flex-row flex-col gap-4 justify-between pt-5">
          <div className="flex flex-col gap-4 min-w-0 flex-1">
            <div>
              <DaText
                variant="small"
                className="inline-block text-da-gray-dark w-[240px]"
              >
                Name
              </DaText>
              <DaText variant="small" className="text-da-gray-darkest ml-2">
                {item.data?.name}
              </DaText>
            </div>
            <div>
              <DaText
                variant="small"
                className="inline-block text-da-gray-dark w-[240px]"
              >
                Description
              </DaText>
              <DaText variant="small" className="text-da-gray-darkest ml-2">
                {item.data?.description || '-'}
              </DaText>
            </div>

            {Object.entries(item.data)
              .filter(
                ([key]) =>
                  ![
                    'id',
                    'name',
                    'description',
                    'image',
                    'createdAt',
                    'updatedAt',
                    'createdBy',
                  ].includes(key)
              )
              .map(([key, value]) => (
                <div key={key} className="flex">
                  <DaText
                    variant="small"
                    className="inline-block text-da-gray-dark min-w-[240px]"
                  >
                    {otherToTitleCase(key)}
                  </DaText>
                  {['string', 'number'].includes(typeof value) ? (
                    <DaText
                      variant="small"
                      className="text-da-gray-darkest ml-2"
                    >
                      {value}
                    </DaText>
                  ) : (
                    <pre>{JSON.stringify(value, null, 4)}</pre>
                  )}
                </div>
              ))}

            <div>
              <DaText
                variant="small"
                className="inline-block text-da-gray-dark w-[240px]"
              >
                Created At
              </DaText>
              <DaText variant="small" className="text-da-gray-darkest ml-2">
                {dayjs(item.data?.createdAt).format('DD.MM.YYYY - HH:mm')}
              </DaText>
            </div>
            <div>
              <DaText
                variant="small"
                className="inline-block text-da-gray-dark w-[240px]"
              >
                Updated At
              </DaText>
              <DaText variant="small" className="text-da-gray-darkest ml-2">
                {dayjs(item.data?.updatedAt).format('DD.MM.YYYY - HH:mm')}
              </DaText>
            </div>
            <div className="flex items-center -mt-0.5">
              <DaText
                variant="small"
                className="inline-block text-da-gray-dark w-[240px]"
              >
                Owner
              </DaText>
              <button className="flex cursor-pointer items-center hover:underline gap-2 ml-2">
                <DaAvatar
                  className="h-7 w-7"
                  src={item.data?.createdBy?.image_file}
                />
                <p className="text-sm text-da-gray-darkest">
                  {item.data?.createdBy?.name}
                </p>
              </button>
            </div>
          </div>

          <DaFileUpload
            image={typeToImage[item.type as keyof typeof typeToImage]}
            isImage
            className="w-[200px] h-[200px]"
            imgClassName="object-cover !h-full !w-full"
          />
        </div>

        <div className="border-t border-t-da-gray-light/50 my-6" />
        <DaText variant="regular-bold" className="text-da-gray-darkest">
          Inventory Type
        </DaText>
        <div className="flex flex-col items-start pt-5 gap-4">
          <div className="flex items-center h-[20px]">
            <DaText
              variant="small"
              className="inline-block text-da-gray-dark w-[240px]"
            >
              Type
            </DaText>
            <DaText variant="small" className="text-da-gray-darkest ml-2">
              {item.typeData?.title || '-'}
            </DaText>
          </div>

          <div>
            <DaText
              variant="small"
              className="inline-block text-da-gray-dark w-[240px]"
            >
              Description
            </DaText>
            <DaText variant="small" className="text-da-gray-darkest ml-2">
              {item.typeData?.description || '-'}
            </DaText>
          </div>

          <div className="w-full">
            <DaButton
              onClick={() => setShowDetail((prev) => !prev)}
              size="sm"
              variant="text"
              className="!px-0 m-0"
            >
              {showDetail ? (
                <TbEyeOff className="h-4 w-4 mr-1" />
              ) : (
                <TbEye className="w-4 h-4 mr-1" />
              )}{' '}
              {showDetail ? 'Hide' : 'Show'} Detail Schema
            </DaButton>
            {showDetail && (
              <div className="border mt-1 rounded-md p-4 w-full">
                <pre>{JSON.stringify(item.typeData || {}, null, 4)}</pre>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-t-da-gray-light/50 my-6" />
        <DaText variant="regular-bold" className="text-da-gray-darkest">
          Relationships
        </DaText>
        <div className="flex font-bold justify-between items-center px-4 py-2 border mt-2 bg-da-primary-500 rounded-md text-white">
          {id === 'customer_journey_pw' && 'Contains Step'}
          {id === 'step1_customer_journey' && 'Contains Flow Items'}
          {id === 'flow1' && 'Contains System Activities'}
          <DaButton
            size="sm"
            onClick={() => setShowLinkElementForm((prev) => !prev)}
            variant="outline-nocolor"
            className=""
          >
            Link An Element
          </DaButton>
        </div>

        <div className="pl-10 pt-2">
          {showLinkElementForm && (
            <div className="p-5 space-y-3 rounded-md mb-2 shadow-medium">
              <p className="font-medium">
                Select {id === 'customer_journey_pw' && ' Step '}
                {id === 'step1_customer_journey' && ' Flow Item '}
                {id === 'flow1' && ' System Activity '}
                Element
              </p>
              <div>
                <p>
                  {' '}
                  {id === 'customer_journey_pw' && ' Step '}
                  {id === 'flow1' && ' System Activity '}
                  {id === 'step1_customer_journey' && ' Flow Item '} *
                </p>
                <DaSelect>
                  {id === 'customer_journey_pw' && (
                    <>
                      <DaSelectItem
                        className="!text-da-white hover:!bg-da-gray-dark !bg-da-gray-medium"
                        value="add"
                      >
                        Create New Step Element
                      </DaSelectItem>
                      <DaSelectItem value="step-4">
                        Step 4: the seat is adjusted according to user
                        preferences
                      </DaSelectItem>
                      <DaSelectItem value="step-5">
                        Step 5: basic settings are updated
                      </DaSelectItem>
                    </>
                  )}
                  {id === 'step1_customer_journey' && (
                    <>
                      <DaSelectItem
                        className="!text-da-white hover:!bg-da-gray-dark !bg-da-gray-medium"
                        value="add"
                      >
                        Create New Flow Item Element
                      </DaSelectItem>
                      <DaSelectItem value="step-4">Flow Item 1</DaSelectItem>
                    </>
                  )}
                  {id === 'flow1' && (
                    <>
                      <DaSelectItem
                        className="!text-da-white hover:!bg-da-gray-dark !bg-da-gray-medium"
                        value="add"
                      >
                        Create New System Activity Element
                      </DaSelectItem>
                      <DaSelectItem value="1">
                        Initialize Proximity Sensors; these will be used by open
                        door
                      </DaSelectItem>
                      <DaSelectItem value="2">Start Monitoring</DaSelectItem>
                      <DaSelectItem value="3">Driver in Proximity</DaSelectItem>
                      <DaSelectItem value="4">
                        Process Proximity Data
                      </DaSelectItem>
                      <DaSelectItem value="5">Distance Reading</DaSelectItem>
                    </>
                  )}
                </DaSelect>
              </div>
              <div>
                <p>Description</p>
                <DaTextarea
                  textareaClassName="!border-da-gray-light"
                  className="!border-da-gray-light"
                />
              </div>

              <div>
                <p>Metadata</p>
                <DaTextarea
                  textareaClassName="!border-da-gray-light"
                  className="!border-da-gray-light"
                />
              </div>

              <div className="mt-2 gap-3 flex justify-end">
                <DaButton
                  onClick={() => setShowLinkElementForm(false)}
                  size="sm"
                  variant="text"
                >
                  Cancel
                </DaButton>
                <DaButton size="sm" variant="text">
                  Save & Link Another
                </DaButton>
                <DaButton
                  onClick={() => {
                    setElements((prev) => {
                      const newSet = new Set(prev);

                      if (id === 'customer_journey_pw') {
                        if (!newSet.has('step-4')) {
                          newSet.add('step-4');
                        } else {
                          newSet.add('step-5');
                        }
                      }

                      if (id === 'step1_customer_journey') {
                        if (!newSet.has('flow-1')) {
                          newSet.add('flow-1');
                        } else {
                          newSet.add('flow-2');
                        }
                      }

                      if (id === 'flow1') {
                        newSet.add('activity-2');
                      }

                      return newSet;
                    });
                    setShowLinkElementForm(false);
                  }}
                  size="sm"
                  className="w-20"
                >
                  Save
                </DaButton>
              </div>
            </div>
          )}
          {id === 'customer_journey_pw' && (
            <>
              <div className="px-2 py-3 flex items-center font-medium hover:bg-da-gray-light rounded-md">
                <Link
                  className="hover:underline"
                  href={
                    '/role/SDV%20Feature%20Owner/instance/step1_customer_journey'
                  }
                >
                  Step 1: driver proximity detected
                </Link>
              </div>
              <div className="border-t" />
              <div className="px-2 py-3 flex items-center font-medium hover:bg-da-gray-light rounded-md">
                <Link
                  className="hover:underline"
                  href={
                    '/role/SDV%20Feature%20Owner/instance/step1_customer_journey'
                  }
                >
                  Step 2: vehicle door is opened
                </Link>
              </div>

              <div className="border-t" />
              <div className="px-2 py-3 flex items-center font-medium hover:bg-da-gray-light rounded-md">
                <Link
                  className="hover:underline"
                  href={
                    '/role/SDV%20Feature%20Owner/instance/step1_customer_journey'
                  }
                >
                  Step 3: personalized ambient light sequence is played
                </Link>
              </div>
            </>
          )}

          {elements.has('step-4') && (
            <>
              <div className="border-t" />
              <div className="px-2 py-3 flex items-center font-medium hover:bg-da-gray-light rounded-md">
                <Link
                  className="hover:underline"
                  href={
                    '/role/SDV%20Feature%20Owner/instance/step1_customer_journey'
                  }
                >
                  Step 4: the seat is adjusted according to user preferences
                </Link>
              </div>
            </>
          )}
          {elements.has('step-5') && (
            <>
              <div className="border-t" />
              <div className="px-2 py-3 flex items-center font-medium hover:bg-da-gray-light rounded-md">
                <Link
                  className="hover:underline"
                  href={
                    '/role/SDV%20Feature%20Owner/instance/step1_customer_journey'
                  }
                >
                  Step 5: basic settings are updated
                </Link>
              </div>
            </>
          )}

          {elements.has('flow-1') && (
            <>
              <div className="px-2 py-3 flex items-center font-medium hover:bg-da-gray-light rounded-md">
                <Link
                  className="hover:underline"
                  href={'/role/SDV%20Feature%20Owner/instance/flow1'}
                >
                  Flow Item 1
                </Link>
              </div>
            </>
          )}

          {id === 'flow1' && (
            <div className="flex text-smalls font-bold px-2 gap-[450px]">
              <p>Name</p>
              <p>Metadata</p>
            </div>
          )}

          {id === 'flow1' && (
            <>
              <div className="px-2 py-3 flex items-center font-medium hover:bg-da-gray-light rounded-md">
                <Link
                  className="hover:underline w-[400px]"
                  href={'/role/SDV%20Feature%20Owner/instance/activity1'}
                >
                  Initialize Proximity Sensors; these will be used by open door
                </Link>
                <p className="ml-[86px]">{'{type:embedded}'}</p>
              </div>
            </>
          )}

          {elements.has('activity-2') && (
            <>
              <div className="border-t" />
              <div className="px-2 py-3 flex items-center font-medium hover:bg-da-gray-light rounded-md">
                <Link
                  className="hover:underline w-[400px]"
                  href={'/role/SDV%20Feature%20Owner/instance/activity1'}
                >
                  Start Monitoring
                </Link>
                <p className="ml-[86px]">{'{type:Sensors/Actuators}'}</p>
              </div>
            </>
          )}
        </div>

        {id === 'flow1' && (
          <div>
            <div className="flex font-bold justify-between items-center px-4 py-2 border mt-2 bg-da-primary-500 rounded-md text-white">
              Contains System Interfaces
              <DaButton
                size="sm"
                onClick={() => setShowLinkElementForm2((prev) => !prev)}
                variant="outline-nocolor"
                className=""
              >
                Link An Element
              </DaButton>
            </div>
            <div className="pl-10 pt-2">
              {showLinkElementForm2 && (
                <div className="p-5 space-y-3 rounded-md mb-2 shadow-medium">
                  <p className="font-medium">Select System Interface Element</p>
                  <div>
                    <p>System Interface *</p>
                    <DaSelect>
                      <DaSelectItem
                        className="!text-da-white hover:!bg-da-gray-dark !bg-da-gray-medium"
                        value="0"
                      >
                        Create New System Interface Element
                      </DaSelectItem>
                      <DaSelectItem value="1">
                        Vehicle.ADAS.Proximity.Front.IsActive
                      </DaSelectItem>
                      <DaSelectItem value="2">
                        Vehicle.ADAS.Proximity.Front.Distance
                      </DaSelectItem>
                      <DaSelectItem value="3">
                        Vehicle.ADAS.Proximity.Front.IsWarning
                      </DaSelectItem>
                      <DaSelectItem value="4">
                        Driver Access Permission
                      </DaSelectItem>
                      <DaSelectItem value="5">Safety Check</DaSelectItem>
                      <DaSelectItem value="6">Self-reference</DaSelectItem>
                      <DaSelectItem value="7">
                        Vehicle.Cabin.Door.Row1.DriverSide.IsUnlocked
                      </DaSelectItem>
                      <DaSelectItem value="8">OpenDoor</DaSelectItem>
                    </DaSelect>
                  </div>
                  <div>
                    <p>Description</p>
                    <DaTextarea
                      textareaClassName="!border-da-gray-light"
                      className="!border-da-gray-light"
                    />
                  </div>

                  <div>
                    <p>Metadata</p>
                    <DaTextarea
                      textareaClassName="!border-da-gray-light"
                      className="!border-da-gray-light"
                    />
                  </div>

                  <div className="mt-2 gap-3 flex justify-end">
                    <DaButton
                      onClick={() => setShowLinkElementForm2(false)}
                      size="sm"
                      variant="text"
                    >
                      Cancel
                    </DaButton>
                    <DaButton size="sm" variant="text">
                      Save & Link Another
                    </DaButton>
                    <DaButton
                      onClick={() => {
                        setElements((prev) => {
                          const newSet = new Set(prev);

                          if (!newSet.has('interface-1')) {
                            newSet.add('interface-1');
                          } else {
                            newSet.add('interface-2');
                          }

                          return newSet;
                        });
                        setShowLinkElementForm2(false);
                      }}
                      size="sm"
                      className="w-20"
                    >
                      Save
                    </DaButton>
                  </div>
                </div>
              )}

              {elements.has('interface-1') && (
                <div className="flex text-smalls font-bold px-2 gap-[450px]">
                  <p>Name</p>
                  <p>Metadata</p>
                </div>
              )}

              {elements.has('interface-1') && (
                <>
                  <div className="px-2 py-3 flex items-center font-medium hover:bg-da-gray-light rounded-md">
                    <Link
                      className="hover:underline w-[400px]"
                      href={'/role/SDV%20Feature%20Owner/instance/flow1'}
                    >
                      Start Monitoring
                    </Link>
                    <p className="ml-[86px]">
                      {'{type: system-2-ecu; direction: bi-directional}'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function InventoryItemDetail() {
  const params = useParams();
  const { data: inventoryData } = useCurrentInventoryData();

  console.log('slug', params.slug);

  // Get the current tab from path
  const roleName = params.roleName as string;
  const itemId = params.slug?.at(0);
  const currentTab = params.slug?.at(1) || '';

  const itemData = inventoryData.inventoryItem;

  if (!itemData) {
    return <div className="p-4">Not found.</div>;
  }

  itemData.typeData = types.find((t) => t.$id === itemData.type);

  return (
    <div className="container text-sm pb-10 text-da-gray-dark">
      {/* Header */}
      <div className="mt-5 flex gap-2 items-end py-3">
        <div className="flex flex-col gap-2">
          <DaText variant="title" className="!block text-da-primary-500">
            {itemData.data?.name || '-'}
          </DaText>
          <div className="text-sm flex gap-2">
            <span>{itemData.typeData?.title}</span>
            <span>•</span>
          </div>
        </div>

        <DaButton
          size="sm"
          variant="outline-nocolor"
          className="ml-auto !text-da-gray-dark w-[80px]"
        >
          <TbEdit className="w-4 h-4 mr-1" />
          Edit
        </DaButton>
        <DaMenu
          trigger={
            <DaButton
              size="sm"
              variant="outline-nocolor"
              className="!text-da-gray-dark w-[80px]"
            >
              <TbChevronDown className="w-4 h-4 mr-1" />
              More
            </DaButton>
          }
        >
          <div className="flex flex-col px-0.5 -my-0.5">
            <DaButton
              size="sm"
              variant="plain"
              className="text-left !justify-start w-[240px]"
            >
              <TbCopy className="w-4 h-4 mr-2" />
              Duplicate Item
            </DaButton>
          </div>
        </DaMenu>
      </div>

      <div className="border-b flex font-medium border-t-da-gray-light/50 mb-6">
        {tabs.map((t) => (
          <Link
            key={t.key}
            className={clsx(
              'w-[160px] flex justify-center border-b items-center h-[48px]',
              t.path === currentTab
                ? 'text-da-primary-500 border-b-da-primary-500'
                : 'border-b-transparent'
            )}
            href={`/role/${roleName}/instance/${itemId}${
              t.path ? `/${t.path}` : ''
            }`}
          >
            {t.name}
          </Link>
        ))}
      </div>

      {!currentTab && <General data={itemData} />}

      {currentTab === 'assets' && (
        <div className="flex mt-4 gap-7 flex-col">
          <div className="border flex-1 min-w-0 shadow rounded-lg flex flex-col">
            <div className="border-b h-[54px] flex items-center px-4">
              <DaText className="!text-da-gray-darkest" variant="regular-bold">
                Diagrams
              </DaText>
              <DaButton variant="text" className="ml-auto" size="sm">
                <TbPlus className="w-4 h-4 mr-1" />
                Add Diagram
              </DaButton>
            </div>
            <div className="px-4 py-2">
              <DaText variant="small" className="!block py-3">
                This item has no diagrams.
              </DaText>
            </div>
          </div>
          <div className="border flex-1 min-w-0 shadow rounded-lg flex flex-col">
            <div className="border-b h-[54px] flex items-center px-4">
              <DaText className="!text-da-gray-darkest" variant="regular-bold">
                Attachments
              </DaText>
            </div>
            <div className="px-4 py-2">
              <DaFileUpload
                className="mb-4 mt-3"
                label="Drag drop or click here to attach file"
              />
            </div>
          </div>
        </div>
      )}

      {currentTab === 'activities' && (
        <>
          <DaText variant="regular-bold" className="text-da-gray-darkest">
            Activities
          </DaText>

          <div className="mt-4 flex gap-2">
            <DaInput
              placeholder="Search by description or user"
              className="w-[360px]"
              inputClassName="!text-sm"
            />
            <DaSelect className="!w-[240px]" value="timestamp:asc">
              <DaSelectItem className="text-sm" value="timestamp:asc">
                Timestamp Ascending
              </DaSelectItem>
              <DaSelectItem className="text-sm" value="timestamp:desc">
                Timestamp Descending
              </DaSelectItem>
            </DaSelect>

            <div className="rounded-md border shadow p-2">Date Picker</div>
          </div>

          <div className="mt-6 rounded-lg overflow-hidden shadow border border-da-gray-light/50">
            <table className="w-full">
              <thead>
                <tr className="text-left text-da-gray-darkest">
                  <th className="font-semibold p-3 w-[200px]">Timestamp</th>
                  <th className="font-semibold p-3">Description</th>
                  <th className="font-semibold p-3 w-[240px]">Created By</th>
                  <th className="font-semibold p-3">Old Value</th>
                  <th className="font-semibold p-3">New Value</th>
                </tr>
              </thead>
              <tbody className="text-da-gray-darkest">
                <tr className="border-transparent">
                  <td className="p-3">
                    <DaText variant="small">
                      {dayjs(itemData.data?.createdAt).format(
                        'DD.MM.YYYY - HH:mm'
                      )}
                    </DaText>
                  </td>
                  <td className="p-3">
                    <DaText variant="small">
                      {itemData.data?.createdBy?.name || 'Anonymous'} created
                      the item.
                    </DaText>
                  </td>
                  <td className="p-3 flex items-center gap-2 hover:underline cursor-pointer">
                    <DaAvatar
                      className="h-7 w-7"
                      src={itemData.data?.createdBy?.image_file}
                    />
                    <p className="text-sm text-da-gray-darkest">
                      {itemData.data?.createdBy?.name}
                    </p>
                  </td>
                  <td className="p-3">
                    <DaText variant="small">-</DaText>
                  </td>
                  <td className="p-3">
                    <DaText variant="small">-</DaText>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
