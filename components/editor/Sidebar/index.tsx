import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import cx from 'classnames'
import { mutate } from 'swr'
import { useUser } from '@auth0/nextjs-auth0'
import { Menu, Transition } from '@headlessui/react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import {
  DocumentTextIcon,
  DotsHorizontalIcon,
  DuplicateIcon,
  LoginIcon,
  LogoutIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from '@heroicons/react/outline'

import { useFetchAll } from 'lib/hooks/useFetchAll'
import { Logo } from 'components/common/Logo'

const Sidebar = ({ show }: { show: boolean }) => {
  const { user, isLoading, error } = useUser()
  const { forms, isLoadingForms, formsError } = useFetchAll(user?.sub)
  const router = useRouter()
  const [userForms, setUserForms] = React.useState([])

  React.useEffect(() => {
    setUserForms(forms)
  }, [forms])

  if (isLoading || isLoadingForms) {
    return <aside />
  }
  if (formsError || error) {
    console.log(formsError || error)
    return <aside />
  }

  return (
    <Transition
      show={show}
      as={React.Fragment}
      enter="transition duration-200"
      enterFrom="-translate-x-full"
      enterTo="translate-x-0"
      leave="transition duration-95"
      leaveFrom="translate-x-0"
      leaveTo="-translate-x-full"
    >
      <aside className="w-4/5 md:w-2/5 lg:w-1/5 bg-gray-50 flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Logo />
          {user && (
            <a href="/api/auth/logout" className="btn text-sm">
              <span>Log Out</span>
              <LogoutIcon className="icon text-gray-500" />
            </a>
          )}
        </div>
        {!user ? (
          <div className="p-4 flex-1">
            <div className="bg-gray-100 p-4 rounded border border-gray-200">
              <h2 className="font-semibold text-lg mb-4">Log In</h2>
              <p className="text-sm">
                Create an account and get access to all features
              </p>
              <div className="mt-2">
                <a
                  href="/api/auth/login?returnTo=/create"
                  className="btn border border-gray-300 justify-center gap-4 hover:bg-gray-200"
                >
                  <span>Log In</span>
                  <LoginIcon className="icon text-gray-500" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <React.Fragment>
            <div className="p-4">
              <label htmlFor="form-filter" className="block relative bg-white">
                <SearchIcon className="icon absolute left-3 top-3 cursor-text" />
                <input
                  type="search"
                  name="form-filter"
                  id="form-filter"
                  placeholder="Type in to filter your forms"
                  className="w-full p-2 rounded border bg-transparent pl-8 border-gray-300 focus:ring-4 focus:ring-black/10 focus:border-gray-400 focus:outline-none transition-colors"
                  onChange={(e) => {
                    const target = e.target as HTMLInputElement
                    if (userForms) {
                      setUserForms(
                        forms.filter((form: any) =>
                          form.title
                            .toLocaleLowerCase()
                            .includes(target.value.toLocaleLowerCase())
                        )
                      )
                    }
                  }}
                />
              </label>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {userForms &&
                userForms.length > 0 &&
                userForms.map((form: any) => (
                  <div
                    key={form.id}
                    className="flex items-center hover:bg-gray-200 justify-between"
                  >
                    <Link href={`/${form.id}`}>
                      <a className="py-2 px-4 flex items-center gap-2 truncate w-full">
                        {form.header.icon ? (
                          <Image
                            src={form.header.icon}
                            alt="Icon"
                            width={18}
                            height={18}
                            unoptimized={true}
                          />
                        ) : (
                          <DocumentTextIcon className="icon text-gray-500" />
                        )}
                        <span className="w-full truncate">
                          {form.title ? form.title : 'Untitled form'}
                        </span>
                      </a>
                    </Link>
                    <Menu as="div" className="relative">
                      <Menu.Button className="p-2">
                        <span className="sr-only">Show form options</span>
                        <DotsHorizontalIcon className="icon" />
                      </Menu.Button>
                      <Transition
                        as={React.Fragment}
                        enter="transition duration-200"
                        enterFrom="scale-95 opacity-0"
                        enterTo="scale-100 opacity-100"
                        leave="transition duration-95"
                        leaveFrom="scale-100 opacity-100"
                        leaveTo="scale-95 opacity-0"
                      >
                        <Menu.Items className="absolute right-0 shadow-lg bg-white ring-1 ring-black/10 rounded z-50 py-2">
                          <Menu.Item as={React.Fragment}>
                            {({ active }) => (
                              <button
                                className={cx(
                                  'py-2 px-4 hover:bg-gray-100 flex items-center gap-2 w-full',
                                  { 'bg-gray-100': active }
                                )}
                                onClick={() => {
                                  const duplicateForm = fetch(`/api/forms`, {
                                    method: 'POST',
                                    body: JSON.stringify({
                                      ...form,
                                      id: undefined,
                                    }),
                                  })
                                  toast
                                    .promise(duplicateForm, {
                                      loading: `Duplicating form`,
                                      success: `Redirecting to edit page`,
                                      error: `Error while duplicating form`,
                                    })
                                    .then((res) => res.json())
                                    .then(({ id }) => {
                                      mutate(
                                        `/api/forms/user/${user.sub}`
                                      ).then(() => {
                                        router.push(`/${id}/edit`)
                                      })
                                    })
                                }}
                              >
                                <DuplicateIcon className="icon text-gray-500" />
                                <span>Duplicate</span>
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item as={React.Fragment}>
                            {({ active }) => (
                              <button
                                className={cx(
                                  'py-2 px-4 hover:bg-gray-100 flex items-center gap-2 w-full',
                                  { 'bg-gray-100': active }
                                )}
                                onClick={() => {
                                  const deleteForm = fetch(
                                    `/api/forms/${form.id}/delete`,
                                    {
                                      method: 'DELETE',
                                      body: JSON.stringify({
                                        workspace: form.workspace,
                                      }),
                                    }
                                  )
                                  toast
                                    .promise(deleteForm, {
                                      loading: `Deleting form`,
                                      success: `Form has been deleted`,
                                      error: `Error while deleting form`,
                                    })
                                    .then(async () => {
                                      await mutate(`/api/forms/${user.sub}`)
                                      router.push(`/create`)
                                    })
                                }}
                              >
                                <TrashIcon className="icon text-gray-500" />
                                <span>Delete</span>
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                ))}
            </div>
          </React.Fragment>
        )}
        <div>
          <Link href="/create">
            <a className="flex items-center gap-2 px-2 py-3 w-full border-t border-gray-300 hover:bg-gray-100 transition-colors">
              <PlusIcon className="icon" />
              <span>Create new form</span>
            </a>
          </Link>
        </div>
      </aside>
    </Transition>
  )
}

export { Sidebar }
