import * as React from 'react'
import { NextPage } from 'next'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useUser } from '@auth0/nextjs-auth0'

import { Sidebar } from 'components/Sidebar'
import { EditorNavbar } from 'components/Editor/EditorNavbar'
import { EditorHeader } from 'components/Editor/EditorHeader'
import { EditablePage } from 'components/Editor/EditablePage'
import { sidebarAtom } from 'pages/create'
import {
  blocksAtom,
  headerAtom,
  optionsAtom,
  styleAtom,
  titleAtom,
} from 'lib/atoms/form'
import { useFormFetch } from 'lib/hooks/useFormFetch'
import { mutate } from 'swr'
import { OverlayPage } from 'components/OverlayPage'
import { Layout } from 'components/Layout'

const EditPage: NextPage = () => {
  const [showSidebar, toggleSidebar] = useAtom(sidebarAtom)
  const [title, setTitle] = useAtom(titleAtom)
  const [header, setHeader] = useAtom(headerAtom)
  const [style, setStyle] = useAtom(styleAtom)
  const [options, setOptions] = useAtom(optionsAtom)
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const router = useRouter()
  const { id } = router.query
  const { form, isLoadingForm, formError } = useFormFetch(`${id}`)
  const { user, error, isLoading } = useUser()

  React.useEffect(() => {
    if (form) {
      setTitle(form.title)
      setHeader(form.header)
      setStyle(form.style)
      setOptions(form.options)
      setBlocks(form.blocks)
    }
  }, [form, setTitle, setHeader, setStyle, setOptions, setBlocks])

  if (isLoading || isLoadingForm) {
    return (
      <OverlayPage
        title="Loading"
        description="We're fethcing this form data"
      />
    )
  }
  if (error || formError) {
    return (
      <OverlayPage
        title="Error"
        description="Something went wrong while fetching form data"
      />
    )
  }

  if (form.workspace !== user?.sub) {
    return (
      <OverlayPage
        title="Unautorized"
        description="You don't have permission to edit this form"
      />
    )
  }

  return (
    <Layout title={title} icon={header.icon} className="flex">
      <Sidebar show={showSidebar} />
      <section className="w-screen h-screen overflow-y-auto flex-1 shadow-lg ring-1 ring-black/10">
        <EditorNavbar
          title={title}
          icon={header.icon}
          style={style}
          options={options}
          toggleSidebar={toggleSidebar}
          workspace={form.workspace}
          onPublish={() => {
            const request = fetch(`/api/forms/${id}/update`, {
              method: 'PATCH',
              body: JSON.stringify({
                id: id,
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
              .then(({ id }) => {
                mutate(`/api/forms/${id}`)
                mutate(`/api/forms/user/${user?.sub}`)
              })
          }}
        />
        <EditorHeader header={header} style={style} />
        <EditablePage title={title} blocks={blocks} style={style} />
      </section>
    </Layout>
  )
}

export default EditPage
