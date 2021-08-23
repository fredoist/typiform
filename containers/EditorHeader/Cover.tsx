import { Fragment } from 'react'
import Image from 'next/image'
import cx from 'classnames'
import { Popover, Tab, Transition } from '@headlessui/react'
import {
  PhotographIcon,
  RefreshIcon,
  SearchIcon,
  SparklesIcon,
} from '@heroicons/react/outline'

import { UploadBox } from 'components/UploadBox'
import { UploadLinkForm } from 'components/UploadLinkForm'
import InfiniteScroll from 'react-infinite-scroll-component'

const EditorCover = () => {
  return (
    <div className="relative">
      <div className="relative w-full h-32 lg:h-56 overflow-hidden">
        <Image
          alt="Cover"
          src="https://images.unsplash.com/photo-1629649439562-4c682cd0c0d4"
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <Popover className="relative mx-auto max-w-2xl z-10">
        <Popover.Button className="absolute right-2 bottom-2 p-2 text-xs font-medium bg-white hover:bg-gray-100 rounded shadow leading-none">
          Change cover
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
          <Popover.Panel className="absolute right-0 w-full max-w-sm bg-white rounded shadow-lg ring-1 ring-black/5 p-2 z-10">
            <Tab.Group>
              <div className="flex items-center justify-between text-sm">
                <Tab.List className="flex gap-1">
                  {['Upload', 'Link', 'Unsplash'].map((tab) => (
                    <Tab as={Fragment} key={tab}>
                      {({ selected }) => (
                        <button
                          className={cx('btn', {
                            '!bg-red-50 text-red-500': selected,
                          })}
                        >
                          {tab === 'Unsplash' && (
                            <PhotographIcon
                              className={cx('icon text-gray-500', {
                                'text-red-500': selected,
                              })}
                            />
                          )}
                          <span>{tab}</span>
                        </button>
                      )}
                    </Tab>
                  ))}
                </Tab.List>
                <div className="flex gap-1">
                  <button className="btn">
                    <SparklesIcon className="icon text-gray-500" />
                    <span className="sr-only lg:not-sr-only">Random</span>
                  </button>
                  <button className="btn">Remove</button>
                </div>
              </div>
              <Tab.Panels className="p-2">
                <Tab.Panel>
                  <UploadBox
                    id="cover-upload"
                    sizes="1480x1020"
                    onUpload={(value) => {}}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <UploadLinkForm id="cover-link" onSubmit={(value) => {}} />
                </Tab.Panel>
                <Tab.Panel>
                  <div>
                    <form className="relative">
                      <label htmlFor="search-query">
                        <SearchIcon className="icon absolute left-3 top-3 cursor-text" />
                        <input
                          type="search"
                          name="search-query"
                          id="search-query"
                          placeholder="Type in to search"
                          required={true}
                          className="block w-full py-2 pl-9 pr-16 border border-gray-200 rounded focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-black/5"
                        />
                        <button
                          type="submit"
                          className="btn btn-primary absolute right-1 top-1 text-sm leading-none"
                        >
                          Search
                        </button>
                      </label>
                    </form>
                    <span className="block mt-2 text-xs text-gray-400">
                      Photos by{' '}
                      <a
                        href="https://unsplash.com?utm_source=referral&utm_medium=typiform"
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Unsplash
                      </a>
                    </span>
                    <div className="grid grid-cols-3 gap-2 mt-4 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                      <InfiniteScroll
                        hasMore={true}
                        dataLength={12}
                        loader={
                          <RefreshIcon
                            className="icon text-gray-400 motion-safe:animate-spin"
                            style={{ animationDirection: 'reverse' }}
                          />
                        }
                        next={() => {}}
                      >
                        <div>
                          <button className="relative w-full h-16 bg-gray-50 rounded overflow-hidden">
                            <Image
                              src="https://images.unsplash.com/photo-1629649439562-4c682cd0c0d4"
                              alt="Photo"
                              layout="fill"
                              objectFit="cover"
                              objectPosition="center"
                            />
                          </button>
                          <span className="block truncate text-xs text-gray-400">
                            by{' '}
                            <a
                              href="https://?utm_source=referral&utm_medium=typiform"
                              target="_blank"
                              rel="noreferrer"
                              className="underline"
                            >
                              John Doe Ackerman
                            </a>
                          </span>
                        </div>
                      </InfiniteScroll>
                    </div>
                  </div>
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </Popover.Panel>
        </Transition>
      </Popover>
    </div>
  )
}

export { EditorCover }
