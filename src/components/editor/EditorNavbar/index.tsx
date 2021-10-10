import * as React from 'react'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import Image from 'next/image'
import cx from 'classnames'
import toast from 'react-hot-toast'
import { Popover, RadioGroup, Transition } from '@headlessui/react'
import { useUser } from '@auth0/nextjs-auth0'
import {
  ArrowRightIcon,
  DotsHorizontalIcon,
  EyeIcon,
  LinkIcon,
  MenuIcon,
  TrashIcon,
} from '@heroicons/react/outline'

import { blocksAtom, headerAtom, optionsAtom, styleAtom } from 'lib/atoms/form'
import { LabelSwitch } from 'components/editor/LabelSwitch'
import { formOptions, formStyle } from 'lib/types/form'
import { mutate } from 'swr'
import { useFetchAll } from 'lib/hooks/useFetchAll'

const fontStyles = [
  { label: 'Default', class: 'font-sans' },
  { label: 'Serif', class: 'font-serif' },
  { label: 'Mono', class: 'font-mono' },
]

const EditorNavbar = ({
  title,
  icon,
  style,
  options,
  toggleSidebar,
  workspace,
}: {
  title: string | null
  icon: string | undefined
  style: formStyle
  options: formOptions
  workspace?: string
  toggleSidebar: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const router = useRouter()
  const { id } = router.query
  const [, setStyle] = useAtom(styleAtom)
  const [, setOptions] = useAtom(optionsAtom)
  const [header] = useAtom(headerAtom)
  const [blocks] = useAtom(blocksAtom)
  const { user } = useUser()

  return (
    <nav className="sticky top-0 inset-x-0 z-50 flex items-center gap-2 p-2 bg-white cursor-default text-sm">
      <button className="btn" onClick={() => toggleSidebar((prev) => !prev)}>
        <span className="sr-only">Toggle sidebar</span>
        <MenuIcon className="icon" />
      </button>
      {icon && (
        <Image
          src={icon}
          alt="Icon"
          width={20}
          height={20}
          objectFit="cover"
          objectPosition="center"
          className="rounded-sm overflow-hidden"
        />
      )}
      <span className="flex-1 truncate">{title}</span>
      <Popover className="lg:relative z-20">
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
          <Popover.Panel className="absolute right-2 translate-y-2 w-60 max-h-[calc(100vh-50px)] overflow-y-auto bg-white shadow-lg ring-1 ring-black/5 rounded divide-y divide-gray-100 z-50">
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
                label="Wider layour"
                checked={style.fullWidth}
                onChange={(value) => {
                  setStyle((state) => ({ ...state, fullWidth: value }))
                }}
              />
            </div>
            <div className="py-2">
              <LabelSwitch
                label="Public responses"
                checked={!user ? true : options.publicResponses}
                onChange={(value) => {
                  if (!user) {
                    return toast.error(`Log in to change this setting`)
                  }
                  if (id) {
                    const updateForm = fetch(`/api/forms/${id}/update`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        id: id,
                        options: { ...options, publicResponses: value },
                      }),
                    })
                    toast
                      .promise(updateForm, {
                        loading: `Updating form`,
                        success: `Form has been updated`,
                        error: `Error while updating form`,
                      })
                      .then(() => {
                        mutate(`/api/forms/${id}`).then(() => {
                          setOptions((state) => ({
                            ...state,
                            publicResponses: value,
                          }))
                        })
                      })
                  } else {
                    setOptions((state) => ({
                      ...state,
                      publicResponses: value,
                    }))
                  }
                }}
              />
              <LabelSwitch
                label="Lock responses"
                checked={!user ? false : options.lockedResponses}
                onChange={(value) => {
                  if (!user) {
                    return toast.error(`Log in first to lock form responses`)
                  }
                  if (id) {
                    const updateForm = fetch(`/api/forms/${id}/update`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        id: id,
                        options: { ...options, lockedResponses: value },
                      }),
                    })
                    toast
                      .promise(updateForm, {
                        loading: `Updating form`,
                        success: `Form has been updated`,
                        error: `Error while updating form`,
                      })
                      .then(() => {
                        mutate(`/api/forms/${id}`).then(() => {
                          setOptions((state) => ({
                            ...state,
                            lockedResponses: value,
                          }))
                        })
                      })
                  } else {
                    setOptions((state) => ({
                      ...state,
                      lockedResponses: value,
                    }))
                  }
                }}
              />
            </div>
            {id && (
              <div className="py-2">
                <a
                  href={`/${id}/viewform`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center gap-2 py-2 px-4 hover:bg-gray-100 transition-colors"
                >
                  <EyeIcon className="icon text-gray-400" />
                  <span>View form</span>
                </a>
                <button
                  className="w-full flex items-center gap-2 py-2 px-4 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    const link = `${window.location.host}/${id}/viewform`
                    navigator.clipboard.writeText(link)
                    toast('Link copied to clipboard', {
                      icon: '📎',
                    })
                  }}
                >
                  <LinkIcon className="icon text-gray-400" />
                  <span>Copy link</span>
                </button>
                <button
                  className="w-full flex items-center gap-2 py-2 px-4 hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    const deleteForm = fetch(`/api/forms/${id}/delete`, {
                      method: 'DELETE',
                      body: JSON.stringify({
                        workspace: workspace,
                      }),
                    })
                    toast
                      .promise(deleteForm, {
                        loading: `Deleting form`,
                        success: `Form has been deleted`,
                        error: `Error while deleting form`,
                      })
                      .then(() => {
                        mutate(`/api/forms/user/${user?.sub}`).then(() => {
                          router.push(`/create`)
                        })
                      })
                  }}
                >
                  <TrashIcon className="icon text-gray-400" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </Popover.Panel>
        </Transition>
      </Popover>
      <button
        className="btn btn-primary"
        onClick={() => {
          const request = fetch(`/api/forms`, {
            method: 'PATCH',
            body: JSON.stringify({
              id: id ? id : null,
              title: title,
              workspace: user?.sub,
              style: style,
              header: header,
              options: !user
                ? { publicResponses: true, lockedResponses: false }
                : options,
              blocks: blocks,
            }),
          })
          toast
            .promise(request, {
              loading: `Wait, we're publishing your form`,
              success: 'Changes were published',
              error: 'Error updating form',
            })
            .then((res) => res.json())
            .then(async ({ id }) => {
              await mutate(`/api/forms/${id}`)
              await mutate(`/api/forms/user/${user?.sub}`)
              router.push(`/${id}`)
            })
        }}
      >
        <span>Publish</span>
        <ArrowRightIcon className="icon" />
      </button>
    </nav>
  )
}

export { EditorNavbar }
