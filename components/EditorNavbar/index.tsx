import * as React from 'react'
import { useAtom } from 'jotai'
import Image from 'next/image'
import cx from 'classnames'
import { Popover, RadioGroup, Transition } from '@headlessui/react'
import {
  ArrowRightIcon,
  DotsHorizontalIcon,
  LinkIcon,
  MenuIcon,
  TrashIcon,
} from '@heroicons/react/outline'

import { headerAtom, optionsAtom, styleAtom, titleAtom } from 'lib/atoms/form'
import { LabelSwitch } from 'components/LabelSwitch'

const fontStyles = [
  { label: 'Default', class: 'font-sans' },
  { label: 'Serif', class: 'font-serif' },
  { label: 'Mono', class: 'font-mono' },
]

const EditorNavbar = () => {
  const [title] = useAtom(titleAtom)
  const [header] = useAtom(headerAtom)
  const [style, setStyle] = useAtom(styleAtom)
  const [options, setOptions] = useAtom(optionsAtom)

  return (
    <nav className="sticky top-0 inset-x-0 z-50 flex items-center gap-2 p-2 bg-white cursor-default text-sm">
      <button className="btn">
        <span className="sr-only">Toggle sidebar</span>
        <MenuIcon className="icon" />
      </button>
      {header.icon && (
        <Image
          src={header.icon}
          alt="Icon"
          unoptimized={true}
          width={20}
          height={20}
          className="rounded-sm overflow-hidden"
        />
      )}
      <span className="flex-1 truncate">{title}</span>
      <Popover className="lg:relative">
        <Popover.Button className="btn">
          <span className="sr-only">Toggle form options</span>
          <DotsHorizontalIcon className="icon" />
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
          <Popover.Panel className="absolute right-2 translate-y-2 w-60 max-h-[calc(100vh-50px)] overflow-y-auto bg-white shadow-lg ring-1 ring-black/5 rounded divide-y divide-gray-100">
            <RadioGroup
              value={style.fontStyle}
              onChange={(value) => {
                setStyle((state) => ({ ...state, fontStyle: value }))
              }}
              className="p-2 grid grid-cols-3"
            >
              <RadioGroup.Label className="sr-only">
                Font style
              </RadioGroup.Label>
              {fontStyles.map((font) => (
                <RadioGroup.Option
                  key={font.class}
                  value={font.class}
                  className={cx(
                    font.class,
                    'text-center py-2 hover:bg-gray-100 rounded cursor-pointer transition-colors'
                  )}
                >
                  {({ checked }) => (
                    <React.Fragment>
                      <h5
                        aria-hidden="true"
                        className={cx({
                          'text-xl font-medium': true,
                          'text-blue-400': checked,
                        })}
                      >
                        Ag
                      </h5>
                      <span className="text-sm text-gray-400">
                        {font.label}
                      </span>
                    </React.Fragment>
                  )}
                </RadioGroup.Option>
              ))}
            </RadioGroup>
            <div className="py-2">
              <LabelSwitch
                label="Small text"
                checked={style.smallText}
                onChange={(value) => {
                  setStyle((state) => ({ ...state, smallText: value }))
                }}
              />
              <LabelSwitch
                label="Full width"
                checked={style.fullWidth}
                onChange={(value) => {
                  setStyle((state) => ({ ...state, fullWidth: value }))
                }}
              />
            </div>
            <div className="py-2">
              <LabelSwitch
                label="Public responses"
                checked={options.publicResponses}
                onChange={(value) => {
                  setOptions((state) => ({
                    ...state,
                    publicResponses: value,
                  }))
                }}
              />
              <LabelSwitch
                label="Lock responses"
                checked={options.lockedResponses}
                onChange={(value) => {
                  setOptions((state) => ({
                    ...state,
                    lockedResponses: value,
                  }))
                }}
              />
            </div>
            <div className="py-2">
              <button
                onClick={() => {}}
                className="w-full flex items-center gap-2 py-2 px-4 hover:bg-gray-100 transition-colors"
              >
                <LinkIcon className="icon text-gray-400" />
                <span>Copy link</span>
              </button>
              <button
                onClick={() => {}}
                className="w-full flex items-center gap-2 py-2 px-4 hover:bg-gray-100 transition-colors"
              >
                <TrashIcon className="icon text-gray-400" />
                <span>Delete</span>
              </button>
            </div>
          </Popover.Panel>
        </Transition>
      </Popover>
      <button className="btn btn-primary">
        <span>Publish</span>
        <ArrowRightIcon className="icon" />
      </button>
    </nav>
  )
}

export { EditorNavbar }
