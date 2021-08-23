import { Fragment } from 'react'
import Image from 'next/image'
import cx from 'classnames'
import { Popover, Tab, Transition } from '@headlessui/react'

import { UploadBox } from 'components/UploadBox'
import { UploadLinkForm } from 'components/UploadLinkForm'

const EditorIcon = () => {
  return (
    <Popover className="relative">
      <Popover.Button className="absolute -translate-y-1/2 w-24 h-24 lg:w-32 lg:h-32 rounded hover:ring-8 hover:ring-black/10">
        <Image src="/icon.png" alt="Icon" width={128} height={128} />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition duration-95"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel className="absolute left-0 top-16 lg:top-20 w-full max-w-sm bg-white rounded shadow-lg ring-1 ring-black/5 p-2 z-10">
          <Tab.Group>
            <div className="flex items-center justify-between text-sm">
              <Tab.List className="flex gap-1">
                {['Upload', 'Link'].map((tab) => (
                  <Tab as={Fragment} key={tab}>
                    {({ selected }) => (
                      <button
                        className={cx('btn', {
                          '!bg-red-50 text-red-500': selected,
                        })}
                      >
                        <span>{tab}</span>
                      </button>
                    )}
                  </Tab>
                ))}
              </Tab.List>
              <button className="btn">Remove</button>
            </div>
            <Tab.Panels className="p-2">
              <Tab.Panel>
                <UploadBox
                  id="icon-upload"
                  sizes="128x128"
                  onUpload={(value) => {}}
                />
              </Tab.Panel>
              <Tab.Panel>
                <UploadLinkForm id="icon-link" onSubmit={(value) => {}} />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export { EditorIcon }
