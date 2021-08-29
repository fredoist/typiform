import * as React from 'react'
import { useAtom } from 'jotai'
import Image from 'next/image'
import cx from 'classnames'
import { Popover, Tab, Transition } from '@headlessui/react'

import { UploadBox } from 'components/UploadBox'
import { UploadLinkForm } from 'components/UploadLinkForm'
import { headerAtom } from 'lib/atoms/form'

const EditorIcon = () => {
  const [header, setHeader] = useAtom(headerAtom)

  return (
    <Popover className="relative">
      <Popover.Button
        className={cx(
          'w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded hover:ring-8 hover:ring-black/10 overflow-hidden',
          {
            'relative mt-5': !header.cover,
            'absolute -translate-y-1/2': header.cover,
          }
        )}
      >
        {header.icon && (
          <Image
            src={header.icon}
            alt="Icon"
            unoptimized={true}
            width={128}
            height={128}
          />
        )}
      </Popover.Button>
      <Transition
        as={React.Fragment}
        enter="transition duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition duration-95"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <Popover.Panel
          className={cx(
            'absolute left-0 translate-y-2 w-full max-w-sm bg-white rounded shadow-lg ring-1 ring-black/5 p-2 z-10',
            { 'top-8 md:top-16 lg:top-20': header.cover }
          )}
        >
          <Tab.Group>
            <div className="flex items-center justify-between text-sm">
              <Tab.List className="flex gap-1">
                {['Upload', 'Link'].map((tab) => (
                  <Tab as={React.Fragment} key={tab}>
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
              <button
                className="btn"
                onClick={() => {
                  setHeader((state) => ({ ...state, icon: undefined }))
                }}
              >
                Remove
              </button>
            </div>
            <Tab.Panels className="p-2">
              <Tab.Panel>
                <UploadBox
                  id="icon-upload"
                  onUpload={(value) => {
                    setHeader((state) => ({ ...state, icon: value }))
                  }}
                />
              </Tab.Panel>
              <Tab.Panel>
                <UploadLinkForm
                  id="icon-link"
                  onSubmit={(value) => {
                    setHeader((state) => ({ ...state, icon: value }))
                  }}
                />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </Popover.Panel>
      </Transition>
    </Popover>
  )
}

export { EditorIcon }
