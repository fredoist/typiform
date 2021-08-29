import * as React from 'react'
import cx from 'classnames'
import { useAtom } from 'jotai'
import Image from 'next/image'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Popover, Tab, Transition } from '@headlessui/react'
import {
  EmojiHappyIcon,
  PhotographIcon,
  RefreshIcon,
  SearchIcon,
  SparklesIcon,
} from '@heroicons/react/outline'

import { UploadBox } from 'components/UploadBox'
import { UploadLinkForm } from 'components/UploadLinkForm'
import { headerAtom } from 'lib/atoms/form'
import { formHeader, formStyle } from 'lib/types/form'

type searchResults = {
  total: number
  total_pages: number
  results: {
    id: string
    description: string
    user: { name: string; links: { html: string } }
    urls: { thumb: string; full: string }
  }[]
}

const EditorHeader = ({
  header,
  style,
}: {
  header: formHeader
  style: formStyle
}) => {
  const [, setHeader] = useAtom(headerAtom)
  const [query, setQuery] = React.useState<string | null>(null)
  const [searchPage, setSearchPage] = React.useState<number>(1)
  const [searchResults, setSearchResults] = React.useState<searchResults>({
    total: 0,
    total_pages: 0,
    results: [],
  })

  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  return (
    <header className="relative group">
      {header.cover && (
        <div className="relative">
          <div
            className={cx(
              'relative w-full h-32 lg:h-56 overflow-hidden pointer-events-none bg-gray-100',
              {
                'animate-pulse': isLoading,
              }
            )}
          >
            {header.cover && (
              <Image
                alt="Cover"
                src={header.cover}
                unoptimized={true}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="w-full h-full object-center object-cover"
                onLoadingComplete={() => {
                  setIsLoading(false)
                }}
              />
            )}
          </div>
          <Popover
            className={cx('relative mx-auto z-10', {
              'max-w-5xl': style.fullWidth,
              'max-w-xl': !style.fullWidth,
            })}
          >
            <Popover.Button className="absolute right-2 bottom-2 p-2 text-xs font-medium bg-white hover:bg-gray-100 rounded shadow leading-none">
              Change cover
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
              <Popover.Panel className="absolute right-0 w-full max-w-sm bg-white rounded shadow-lg ring-1 ring-black/5 p-2 z-10">
                <Tab.Group>
                  <div className="flex items-center justify-between text-sm">
                    <Tab.List className="flex gap-1">
                      {['Upload', 'Link', 'Unsplash'].map((tab) => (
                        <Tab as={React.Fragment} key={tab}>
                          {({ selected }) => (
                            <button
                              className={cx('btn', {
                                '!bg-red-50 text-red-500': selected,
                              })}
                            >
                              {tab === 'Unsplash' && (
                                <PhotographIcon
                                  className={cx('icon text-gray-500', {
                                    '!text-red-500': selected,
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
                      <button
                        className="btn"
                        onClick={async () => {
                          const request = await fetch('/api/unsplash/random')
                          const response = await request.json()
                          setHeader((prev) => ({
                            ...prev,
                            cover: response.urls.full,
                          }))
                          setIsLoading(true)
                        }}
                      >
                        {isLoading ? (
                          <RefreshIcon
                            className="icon text-gray-500 animate-spin"
                            style={{ animationDirection: 'reverse' }}
                          />
                        ) : (
                          <SparklesIcon className="icon text-gray-500" />
                        )}
                        <span className="sr-only lg:not-sr-only">Random</span>
                      </button>
                      <button
                        className="btn"
                        onClick={() => {
                          setHeader((prev) => ({
                            ...prev,
                            cover: undefined,
                          }))
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <Tab.Panels className="p-2">
                    <Tab.Panel>
                      <UploadBox
                        id="cover-upload"
                        onUpload={(value) => {
                          setHeader((prev) => ({ ...prev, cover: value }))
                        }}
                      />
                    </Tab.Panel>
                    <Tab.Panel>
                      <UploadLinkForm
                        id="cover-link"
                        onSubmit={(value) => {
                          setHeader((prev) => ({ ...prev, cover: value }))
                        }}
                      />
                    </Tab.Panel>
                    <Tab.Panel>
                      <div>
                        <form
                          className="relative"
                          onSubmit={async (e) => {
                            e.preventDefault()
                            const form = e.target as HTMLFormElement
                            const query = form.elements.namedItem(
                              'query'
                            ) as HTMLInputElement
                            setQuery(query.value)
                            const request = await fetch(
                              `/api/unsplash/search?query=${query.value}&page=${searchPage}`
                            )
                            const response = await request.json()
                            setSearchResults(response)
                            setSearchPage((prev) => prev + 1)
                          }}
                        >
                          <label htmlFor="search-query">
                            <SearchIcon className="icon absolute left-3 top-3 cursor-text" />
                            <input
                              type="search"
                              name="query"
                              id="query"
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
                            href="https://unsplash.com?utm_source=typiform&utm_medium=referral"
                            target="_blank"
                            rel="noreferrer"
                            className="underline"
                          >
                            Unsplash
                          </a>
                        </span>
                        <div
                          id="search-results"
                          className="mt-4 max-h-60 overflow-y-auto custom-scrollbar pr-1"
                        >
                          <InfiniteScroll
                            hasMore={searchPage < searchResults.total_pages}
                            dataLength={searchResults.results.length}
                            scrollableTarget="search-results"
                            className="grid grid-cols-3 gap-2"
                            loader={
                              <div className="relative w-full h-16 bg-gray-300 rounded overflow-hidden animate-pulse" />
                            }
                            next={async () => {
                              const request = await fetch(
                                `/api/unsplash/search?query=${query}&page=${searchPage}`
                              )
                              const response = await request.json()
                              setSearchResults((prev) => {
                                return {
                                  ...prev,
                                  results: [
                                    ...prev.results,
                                    ...response.results,
                                  ],
                                }
                              })
                              setSearchPage((prev) => prev + 1)
                            }}
                          >
                            {searchResults.results.map(
                              ({ id, urls, description, user }) => (
                                <div key={id}>
                                  <button
                                    className={cx(
                                      'relative w-full h-16 bg-gray-50 rounded overflow-hidden',
                                      { 'opacity-50': isLoading }
                                    )}
                                    disabled={isLoading}
                                    onClick={async () => {
                                      if (isLoading) return
                                      setHeader((prev) => ({
                                        ...prev,
                                        cover: urls.full,
                                      }))
                                      setIsLoading(true)
                                      // send track photo download request when the
                                      // user choose a photo as cover image
                                      await fetch(
                                        `/api/unsplash/${id}/download`
                                      )
                                    }}
                                  >
                                    <Image
                                      src={urls.thumb}
                                      unoptimized={true}
                                      alt={description}
                                      layout="fill"
                                      className="w-full h-full object-cover object-center"
                                    />
                                  </button>
                                  <span className="block truncate text-xs text-gray-400">
                                    by{' '}
                                    <a
                                      href={`${user.links.html}?utm_source=typiform&utm_medium=referral`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="underline"
                                    >
                                      {user.name}
                                    </a>
                                  </span>
                                </div>
                              )
                            )}
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
      )}
      <div
        className={cx('mx-auto px-2', {
          'max-w-5xl': style.fullWidth,
          'max-w-xl': !style.fullWidth,
        })}
      >
        <div
          className={cx({ 'h-8 md:h-12 lg:h-16': header.cover && header.icon })}
        >
          {header.icon && (
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
          )}
        </div>
        <div className="pt-4 flex gap-2 text-gray-400 text-sm lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          {!header.icon && (
            <button
              className="btn"
              onClick={() => {
                setHeader((state) => ({ ...state, icon: '/icon.png' }))
              }}
            >
              <EmojiHappyIcon className="icon" />
              <span>Add icon</span>
            </button>
          )}
          {!header.cover && (
            <button
              className="btn"
              onClick={async () => {
                const request = await fetch('/api/unsplash/random')
                const response = await request.json()
                setHeader((state) => ({
                  ...state,
                  cover: response.urls.full,
                }))
              }}
            >
              <PhotographIcon className="icon" />
              <span>Add cover</span>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export { EditorHeader }
