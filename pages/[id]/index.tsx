import { NextPage } from 'next'
import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import { Sidebar } from 'components/editor/Sidebar'
import { useUser } from '@auth0/nextjs-auth0'
import { useFormFetch } from 'lib/hooks/useFormFetch'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { sidebarAtom } from 'pages/create'
import { Tab } from '@headlessui/react'
import { MenuIcon, PencilIcon } from '@heroicons/react/outline'
import { useResponses } from 'lib/hooks/useResponses'
import { LabelSwitch } from 'components/editor/LabelSwitch'
import { mutate } from 'swr'
import toast from 'react-hot-toast'
import { OverlayPage } from 'components/common/OverlayPage'
import { Layout } from 'components/Layout'

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
    return (
      <OverlayPage
        title="Loading"
        description="We're fetching this form data"
      />
    )
  }
  if (formError || responsesError || error) {
    console.error(formError || responsesError || error)
    return (
      <OverlayPage
        title="Error"
        description="Something went wrong while fetching form data"
      />
    )
  }

  if (
    (!form.options.publicResponses && form.workspace !== user?.sub) ||
    (!form.options.publicResponses && !user)
  ) {
    return (
      <Layout title="Not Allowed">
        <OverlayPage
          title="Not Allowed"
          description="You can't access this page"
        />
      </Layout>
    )
  }

  return (
    <Layout title={form.title} icon={form.header.icon} className="flex">
      <Sidebar show={showSidebar} />
      <section className="w-screen h-screen overflow-y-auto flex-1 shadow-lg ring-1 ring-black/10">
        <nav className="sticky top-0 inset-x-0 z-50 flex items-center gap-2 p-2 bg-white cursor-default text-sm">
          <button
            className="btn"
            onClick={() => toggleSidebar((prev) => !prev)}
          >
            <span className="sr-only">Toggle sidebar</span>
            <MenuIcon className="icon" />
          </button>
        </nav>
        <header className="p-4 lg:p-8 flex items-center gap-2">
          <Image
            src={form.header.icon ? form.header.icon : '/img/defaultIcon.svg'}
            alt="Icon"
            width={30}
            height={30}
          />
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
                  Responses
                </button>
              )}
            </Tab>
            {form.workspace === user?.sub && (
              <React.Fragment>
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
              </React.Fragment>
            )}
          </Tab.List>
          <Tab.Panels className="py-4">
            <Tab.Panel>
              {responses.length > 0 ? (
                <div className="overflow-x-auto w-full custom-scrollbar">
                  <table className="w-full table">
                    <thead className="border-b border-gray-200">
                      <th className="p-2 text-left">Date</th>
                      {responses[0] &&
                        Object.entries(responses[0].data).map((o: any, k) => (
                          <th key={k} className="p-2 text-left">
                            {o[0].replace('&#x27;', "'")}
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
                </div>
              ) : (
                <p>There are no responses yet</p>
              )}
            </Tab.Panel>
            <Tab.Panel>
              <div className="max-w-md">
                <span className="text-sm block mb-2">
                  Your form link (click to copy)
                </span>
                <input
                  type="text"
                  readOnly={true}
                  className="p-2 focus:outline-none bg-gray-100 rounded w-full"
                  value={`https://${window.location.host}/${id}/viewform`}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement
                    target.select()
                    navigator.clipboard.writeText(target.value)
                    toast('Link copied to clipboard')
                  }}
                />
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="max-w-md mb-2">
                <LabelSwitch
                  label="Public responses page"
                  checked={form.options.publicResponses}
                  onChange={(value) => {
                    const updateForm = fetch(`/api/forms/${id}/update`, {
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
                  Allow everyone to see responses of this form
                </span>
              </div>
              <div className="max-w-md mb-2">
                <LabelSwitch
                  label="Lock responses"
                  checked={form.options.lockedResponses}
                  onChange={(value) => {
                    const updateForm = fetch(`/api/forms/${id}/update`, {
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
                      const deleteForm = fetch(`/api/forms/${id}/delete`, {
                        method: 'DELETE',
                        body: JSON.stringify({
                          workspace: form.workspace,
                        }),
                      })
                      toast
                        .promise(deleteForm, {
                          loading: `Deleting form`,
                          success: `Form has been deleted`,
                          error: `Error while deleting form`,
                        })
                        .then(() => {
                          router.push(`/create`)
                        })
                    }
                  }}
                >
                  Delete form
                </button>
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </section>
    </Layout>
  )
}

export default FormDashboard
