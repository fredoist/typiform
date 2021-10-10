import * as React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import cx from 'classnames'
import { Sidebar } from 'components/editor/Sidebar'
import { getSession, UserProfile, useUser } from '@auth0/nextjs-auth0'
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
import { Layout } from 'components/editor/Layout'
import { SEO } from 'components/common/SEO'

interface PageProps {
  user: UserProfile
  form: any
  responses: any
  notAllowed: boolean
}

const FormDashboard: NextPage<PageProps> = ({ user, form, responses, notAllowed }) => {
  const [showSidebar, toggleSidebar] = useAtom(sidebarAtom)
  const router = useRouter()
  const { id } = router.query

  if (notAllowed) {
    return (
      <OverlayPage
        title="Not Allowed"
        description="You can't access this page"
      />
    )
  }

  return (
    <Layout>
      <SEO
        title={
          form.title ? `Dashboard: ${form.title}` : 'Dashboard: Untitled form'
        }
        icon={form.header.icon}
      />
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
            {form.workspace === user?.sub && (
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
                  value={`https://typiform.vercel.app/${id}/viewform`}
                  onClick={(e) => {
                    const target = e.target as HTMLInputElement
                    target.select()
                    navigator.clipboard.writeText(target.value)
                    toast('Link copied to clipboard')
                  }}
                />
              </div>
              <div className="max-w-md mt-4">
                <strong className="block mb-4">Share on social media</strong>
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                    form.title
                  )}&url=${encodeURIComponent(
                    `https://typiform.vercel.app/${id}/viewform`
                  )}`}
                  className="bg-blue-400 text-white btn py-3 px-4 hover:bg-blue-500 gap-4"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    className="icon fill-current"
                  >
                    <path d="M496 109.5a201.8 201.8 0 01-56.55 15.3 97.51 97.51 0 0043.33-53.6 197.74 197.74 0 01-62.56 23.5A99.14 99.14 0 00348.31 64c-54.42 0-98.46 43.4-98.46 96.9a93.21 93.21 0 002.54 22.1 280.7 280.7 0 01-203-101.3A95.69 95.69 0 0036 130.4c0 33.6 17.53 63.3 44 80.7A97.5 97.5 0 0135.22 199v1.2c0 47 34 86.1 79 95a100.76 100.76 0 01-25.94 3.4 94.38 94.38 0 01-18.51-1.8c12.51 38.5 48.92 66.5 92.05 67.3A199.59 199.59 0 0139.5 405.6a203 203 0 01-23.5-1.4A278.68 278.68 0 00166.74 448c181.36 0 280.44-147.7 280.44-275.8 0-4.2-.11-8.4-.31-12.5A198.48 198.48 0 00496 109.5z" />
                  </svg>
                  <span>Share to twitter</span>
                </a>
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = getSession(req, res)
  const user = session && session.user

  const formReq = await fetch(`${process.env.HARPERDB_URL}`, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${process.env.HARPERDB_TOKEN}`,
    },
    body: JSON.stringify({
      operation: 'sql',
      sql: `SELECT * FROM typiform.forms WHERE id='${query.id}'`,
    }),
  })
  const formRes = await formReq.json()
  const form = formRes[0]

  const responsesReq = await fetch(`${process.env.HARPERDB_URL}`, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${process.env.HARPERDB_TOKEN}`,
    },
    body: JSON.stringify({
      operation: 'sql',
      sql: `SELECT * FROM typiform.responses WHERE formID='${query.id}' ORDER BY __createdtime__ DESC`,
    }),
  })
  const responsesRes = await responsesReq.json()
  const responses = responsesRes

  // formRes returns an empty array if no form is found on DB
  if (formRes <= 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
      form: form,
      responses: responses,
      notAllowed:
        (user &&
          !form.options.publicResponses &&
          form.workspace !== user.sub) ||
        (!form.options.publicResponses && !user),
    },
  }
}

export default FormDashboard
