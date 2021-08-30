import * as React from 'react'
import { NextPage } from 'next'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import Head from 'next/head'
import toast from 'react-hot-toast'
import { useUser } from '@auth0/nextjs-auth0'

import { Sidebar } from 'components/Sidebar'
import { EditorNavbar } from 'components/EditorNavbar'
import { EditorHeader } from 'components/EditorHeader'
import { EditablePage } from 'components/EditablePage'
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

const EditPage: NextPage = () => {
  const [showSidebar, toggleSidebar] = useAtom(sidebarAtom)
  const [title, setTitle] = useAtom(titleAtom)
  const [header, setHeader] = useAtom(headerAtom)
  const [style, setStyle] = useAtom(styleAtom)
  const [options, setOptions] = useAtom(optionsAtom)
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const router = useRouter()
  const { id } = router.query
  const { form } = useFormFetch(`${id}`)
  const { user } = useUser()

  React.useEffect(() => {
    if (form) {
      setTitle(form.title)
      setHeader(form.header)
      setStyle(form.style)
      setOptions(form.options)
      setBlocks(form.blocks)
    }
  }, [form, setTitle, setHeader, setStyle, setOptions, setBlocks])

  return (
    <main className="leading-tight text-gray-800 w-screen h-screen overflow-hidden flex">
      <Head>
        <title>{title ? title : 'Untitled form'}</title>
        <link
          rel="icon"
          href={header.icon ? header.icon : '/img/defaultIcon.svg'}
        />
      </Head>
      <Sidebar show={showSidebar} />
      <section className="w-screen h-screen overflow-y-auto flex-1 shadow-lg ring-1 ring-black/10">
        <EditorNavbar
          title={title}
          icon={header.icon}
          style={style}
          options={options}
          toggleSidebar={toggleSidebar}
          onPublish={() => {
            const request = fetch(`/api/forms/${id}`, {
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
    </main>
  )
}

export default EditPage
