import { Fragment, useState } from 'react'
import Image from 'next/image'
import cx from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component'
import { Popover, Tab, Transition } from '@headlessui/react'
import {
  PhotographIcon,
  RefreshIcon,
  SearchIcon,
  SparklesIcon,
} from '@heroicons/react/outline'

import { UploadBox } from 'components/UploadBox'
import { UploadLinkForm } from 'components/UploadLinkForm'
import { formHeader } from 'entities/form'
import { useEffect } from 'react'

interface searchResults {
  total: number
  total_pages: number
  results: {
    id: string
    description: string
    user: { name: string; links: { html: string } }
    urls: { thumb: string; full: string }
  }[]
}

const EditorCover = () => {
  const cover = formHeader.use((state) => state.cover)
  // Unsplash Search Infinite Scroll
  const [query, setQuery] = useState<string | null>(null)
  const [searchPage, setSearchPage] = useState<number>(1)
  const [searchResults, setSearchResults] = useState<searchResults>({
    total: 0,
    total_pages: 0,
    results: [],
  })

  useEffect(() => console.log(searchResults), [searchResults])

  return (
    <div className="relative">
      <div className="relative w-full h-32 lg:h-56 overflow-hidden">
        {cover && (
          <Image
            alt="Cover"
            src={cover}
            loader={({ src }) => src}
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        )}
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
                  <button
                    className="btn"
                    onClick={() => {
                      formHeader.set((state) => ({
                        ...state,
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
                    sizes="1480x1020"
                    onUpload={(value) => {
                      formHeader.set((state) => ({ ...state, cover: value }))
                    }}
                  />
                </Tab.Panel>
                <Tab.Panel>
                  <UploadLinkForm
                    id="cover-link"
                    onSubmit={(value) => {
                      formHeader.set((state) => ({ ...state, cover: value }))
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
                        href="https://unsplash.com?utm_source=referral&utm_medium=typiform"
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
                              results: [...prev.results, ...response.results],
                            }
                          })
                          setSearchPage((prev) => prev + 1)
                        }}
                      >
                        {searchResults.results.map(
                          ({ id, urls, description, user }) => (
                            <div key={id}>
                              <button
                                className="relative w-full h-16 bg-gray-50 rounded overflow-hidden"
                                onClick={() => {
                                  formHeader.set((state) => ({
                                    ...state,
                                    cover: urls.full,
                                  }))
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
                                  href={`${user.links.html}?utm_source=referral&utm_medium=typiform`}
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
  )
}

export { EditorCover }
