import * as React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import toast from 'react-hot-toast'
import { useUser } from '@auth0/nextjs-auth0'

import { EditorNavbar } from 'components/editor/EditorNavbar'
import { EditorHeader } from 'components/editor/EditorHeader'
import { EditablePage } from 'components/editor/EditablePage'
import {
  blocksAtom,
  headerAtom,
  optionsAtom,
  styleAtom,
  titleAtom,
} from 'lib/atoms/form'
import { Sidebar } from 'components/Sidebar'
import { mutate } from 'swr'
import { Layout } from 'components/Layout'

export const sidebarAtom = atomWithStorage('showSidebar', false)

const CreatePage: NextPage = () => {
  const [showSidebar, toggleSidebar] = useAtom(sidebarAtom)
  const [title, setTitle] = useAtom(titleAtom)
  const [header, setHeader] = useAtom(headerAtom)
  const [style, setStyle] = useAtom(styleAtom)
  const [options, setOptions] = useAtom(optionsAtom)
  const [blocks, setBlocks] = useAtom(blocksAtom)
  const { user } = useUser()
  const router = useRouter()

  React.useEffect(() => {
    setTitle(null)
    setHeader({ icon: undefined, cover: undefined })
    setStyle({ fontStyle: 'font-sans', fullWidth: false, smallText: false })
    setOptions({ lockedResponses: false, publicResponses: false })
    setBlocks([])
  }, [setTitle, setHeader, setStyle, setOptions, setBlocks])

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
          onPublish={() => {
            const request = fetch(`/api/forms`, {
              method: 'POST',
              body: JSON.stringify({
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
                success: 'Redirecting to form view',
                error: 'Error creating form',
              })
              .then((res) => res.json())
              .then(({ id }) => {
                router.push(`/${id}`)
                mutate(`/api/forms/${id}`)
                if (user) mutate(`/api/forms/${user?.sub}`)
              })
          }}
        />
        <EditorHeader header={header} style={style} />
        <EditablePage title={title} blocks={blocks} style={style} />
      </section>
    </Layout>
  )
}

export default CreatePage
