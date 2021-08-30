import { NextPage } from 'next'
import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import cx from 'classnames'
import { Sidebar } from 'components/Sidebar'
import { useUser } from '@auth0/nextjs-auth0'
import { useFormFetch } from 'lib/hooks/useFormFetch'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import {
  blocksAtom,
  headerAtom,
  optionsAtom,
  styleAtom,
  titleAtom,
} from 'lib/atoms/form'
import { sidebarAtom } from 'pages/create'
import { Tab } from '@headlessui/react'
import { PencilIcon } from '@heroicons/react/outline'
import { useResponses } from 'lib/hooks/useResponses'

const FormDashboard: NextPage = () => {
  // const [showSidebar, toggleSidebar] = useAtom(sidebarAtom)
  // const [title, setTitle] = useAtom(titleAtom)
  // const [header, setHeader] = useAtom(headerAtom)
  // const [style, setStyle] = useAtom(styleAtom)
  // const [options, setOptions] = useAtom(optionsAtom)
  // const [blocks, setBlocks] = useAtom(blocksAtom)
  const router = useRouter()
  const { id } = router.query
  const { responses, error, isLoading } = useResponses(`${id}`)
  // const { form } = useFormFetch(`${id}`)
  // const { user } = useUser()

  // React.useEffect(() => {
  //   if (form) {
  //     setTitle(form.title)
  //     setHeader(form.header)
  //     setStyle(form.style)
  //     setOptions(form.options)
  //     setBlocks(form.blocks)
  //   }
  // }, [form, setTitle, setHeader, setStyle, setOptions, setBlocks])

  if (isLoading) return <p>Loading</p>
  if (error) return <p>Error</p>

  return (
    <main className="leading-tight text-gray-800 w-screen h-screen overflow-hidden flex">
      {/* <Head>
        <title>{title ? title : 'Untitled form'}</title>
        <link
          rel="icon"
          href={header.icon ? header.icon : '/img/defaultIcon.svg'}
        />
      </Head> */}
      <Sidebar show={false} />
      <section className="w-screen h-screen overflow-y-auto flex-1 shadow-lg ring-1 ring-black/10">
        <header className="p-4 lg:p-8 flex items-center gap-2">
          <h2 className="font-bold text-2xl flex-1 truncate">Form title</h2>
          <Link href={`/${id}/edit`}>
            <a className="btn btn-primary">
              <PencilIcon className="icon" />
              <span>Edit</span>
            </a>
          </Link>
        </header>
        <Tab.Group as="div" className="px-4 lg:px-8">
          <Tab.List className="border-b border-gray-200 flex gap-x-6">
            <Tab as={React.Fragment}>
              {({ selected }) => (
                <button
                  className={cx('py-2 focus:outline-none border-b-2', {
                    'border-black': selected,
                    'border-transparent hover:border-gray-300': !selected,
                  })}
                >
                  Summary
                </button>
              )}
            </Tab>
            <Tab as={React.Fragment}>
              {({ selected }) => (
                <button
                  className={cx('py-2 focus:outline-none border-b-2', {
                    'border-black': selected,
                    'border-transparent hover:border-gray-300': !selected,
                  })}
                >
                  Responses
                </button>
              )}
            </Tab>
            <Tab as={React.Fragment}>
              {({ selected }) => (
                <button
                  className={cx('py-2 focus:outline-none border-b-2', {
                    'border-black': selected,
                    'border-transparent hover:border-gray-300': !selected,
                  })}
                >
                  Share
                </button>
              )}
            </Tab>
            <Tab as={React.Fragment}>
              {({ selected }) => (
                <button
                  className={cx('py-2 focus:outline-none border-b-2', {
                    'border-black': selected,
                    'border-transparent hover:border-gray-300': !selected,
                  })}
                >
                  Settings
                </button>
              )}
            </Tab>
          </Tab.List>
          <Tab.Panels className="py-4">
            <Tab.Panel>
              <div>Summary Tab</div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="overflow-x-auto w-full">
                {responses && (
                  <table className="w-full table">
                    <thead className="border-b border-gray-200">
                      <th className="p-2 text-left">Date</th>
                      {responses[0] &&
                        Object.entries(responses[0].data).map((o: any, k) => (
                          <th key={k} className="p-2 text-left">
                            {o[0]}
                          </th>
                        ))}
                    </thead>
                    <tbody>
                      {responses.map((response: any) => {
                        const timestamp = new Date(response.__createdtime__)
                        const date = new Intl.DateTimeFormat('en-US', {
                          dateStyle: 'long',
                          timeStyle: 'medium',
                        }).format(timestamp)

                        return (
                          <tr key={response.id}>
                            <td className="py-4 px-2">{date}</td>
                            {response.data &&
                              Object.entries(response.data).map(
                                (o: any, k: number) => (
                                  <td key={k} className="py-4 px-2">
                                    {o[1]}
                                  </td>
                                )
                              )}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div>Share Tab</div>
            </Tab.Panel>
            <Tab.Panel>
              <div>Options tab</div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </section>
    </main>
  )
}

export default FormDashboard
