import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0'
import { Transition } from '@headlessui/react'
import {
  DocumentTextIcon,
  LoginIcon,
  PlusIcon,
  SearchIcon,
} from '@heroicons/react/outline'

import { useFetchAll } from 'lib/hooks/useFetchAll'

const Sidebar = ({ show }: { show: boolean }) => {
  const { user } = useUser()
  const { forms } = useFetchAll(user?.sub)
  const [userForms, setUserForms] = React.useState([])

  React.useEffect(() => {
    setUserForms(forms)
  }, [forms])

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
      <aside className="w-4/5 lg:w-1/5 bg-gray-50 flex flex-col">
        <div></div>
        {!user ? (
          <div className="p-4">
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
                userForms.map((form: any) => (
                  <Link key={form.id} href={`/${form.id}/viewform`}>
                    <a className="py-2 px-4 hover:bg-gray-200 flex items-center gap-2">
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
                      <span className="block truncate">{form.title}</span>
                    </a>
                  </Link>
                ))}
            </div>
            <div>
              <button className="flex items-center gap-2 px-2 py-3 w-full border-t border-gray-300 hover:bg-gray-100 transition-colors">
                <PlusIcon className="icon" />
                <span>Create new form</span>
              </button>
            </div>
          </React.Fragment>
        )}
      </aside>
    </Transition>
  )
}

export { Sidebar }
