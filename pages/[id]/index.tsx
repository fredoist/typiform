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
import { sidebarAtom } from 'pages/create'
import { Tab } from '@headlessui/react'
import { PencilIcon } from '@heroicons/react/outline'
import { useResponses } from 'lib/hooks/useResponses'
import { LabelSwitch } from 'components/LabelSwitch'
import { mutate } from 'swr'
import toast, { Toaster } from 'react-hot-toast'
import { optionsAtom } from 'lib/atoms/form'
import { EditorNavbar } from 'components/EditorNavbar'

const FormDashboard: NextPage = () => {
  const [showSidebar, toggleSidebar] = useAtom(sidebarAtom)
  const router = useRouter()
  const { id } = router.query
  const { responses, responsesError, isLoadingResponses } = useResponses(
    `${id}`
  )
  const { form, formError, isLoadingForm } = useFormFetch(`${id}`)
  const { user, error, isLoading } = useUser()

  if (isLoadingResponses || isLoadingForm || isLoading) {
    return <p>Loading</p>
  }
  if (formError || responsesError || error) {
    return <p>Error</p>
  }

  return (
    <main className="leading-tight text-gray-800 w-screen h-screen overflow-hidden flex">
      <Toaster />
      <Head>
        <title>{form.title ? form.title : 'Untitled form'}</title>
        <link
          rel="icon"
          href={form.header.icon ? form.header.icon : '/img/defaultIcon.svg'}
        />
      </Head>
      <Sidebar show={showSidebar} />
      <section className="w-screen h-screen overflow-y-auto flex-1 shadow-lg ring-1 ring-black/10">
        <EditorNavbar
          title={form.title}
          icon={form.header.icon}
          style={form.style}
          options={form.options}
          toggleSidebar={toggleSidebar}
          onPublish={() => {
            const request = fetch(`/api/forms/${id}`, {
              method: 'PATCH',
              body: JSON.stringify({
                ...form,
              }),
            })
            toast
              .promise(request, {
                loading: `Wait, we're publishing your form`,
                success: 'Changes were published',
                error: 'Error updating form',
              })
              .then((res) => res.json())
              .then(({ id }) => {
                mutate(`/api/forms/${id}`)
                mutate(`/api/forms/user/${user?.sub}`)
              })
          }}
        />
        <header className="p-4 lg:p-8 flex items-center gap-2">
          <h2 className="font-bold text-2xl flex-1 truncate">
            {form.title ? form.title : 'Untitled form'}
          </h2>
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
              <div className="max-w-md mb-2">
                <LabelSwitch
                  label="Public responses"
                  checked={form.options.publicResponses}
                  onChange={(value) => {
                    const updateForm = fetch(`/api/forms/${id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        ...form,
                        options: { ...form.options, publicResponses: value },
                      }),
                    })
                    toast
                      .promise(updateForm, {
                        loading: `Updating form`,
                        success: `Form has been updated`,
                        error: `Error while updating form`,
                      })
                      .then(() => {
                        mutate(`/api/forms/${id}`)
                      })
                  }}
                />
                <span className="text-sm text-gray-500 px-4">
                  Make the responses page visible to anyone
                </span>
              </div>
              <div className="max-w-md mb-2">
                <LabelSwitch
                  label="Lock responses"
                  checked={form.options.lockedResponses}
                  onChange={(value) => {
                    const updateForm = fetch(`/api/forms/${id}`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        ...form,
                        options: { ...form.options, lockedResponses: value },
                      }),
                    })
                    toast
                      .promise(updateForm, {
                        loading: `Updating form`,
                        success: `Form has been updated`,
                        error: `Error while updating form`,
                      })
                      .then(() => {
                        mutate(`/api/forms/${id}`)
                      })
                  }}
                />
                <span className="text-sm text-gray-500 px-4">
                  Stop receiving responses for this form
                </span>
              </div>
              <div className="max-w-md mb-2 p-4">
                <button
                  className="btn text-red-500 hover:!bg-red-50"
                  onClick={() => {
                    if (
                      confirm('Are you shure you want to delete this form?')
                    ) {
                      const deleteForm = fetch(`/api/forms/${id}`, {
                        method: 'DELETE',
                      })
                      toast
                        .promise(deleteForm, {
                          loading: `Deleting form`,
                          success: `Form has been deleted`,
                          error: `Error while deleting form`,
                        })
                        .then(() => {
                          mutate(`/api/forms/user/${user?.sub}`)
                          router.push(`/${id}/edit`)
                        })
                    }
                  }}
                >
                  Delete form
                </button>
                <span className="text-sm text-gray-500">
                  Stop receiving responses for this form
                </span>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </section>
    </main>
  )
}

export default FormDashboard
