import * as React from 'react'
import { NextPage } from 'next'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

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
import { Sidebar } from 'components/editor/Sidebar'
import { Layout } from 'components/editor/Layout'
import { SEO } from 'components/common/SEO'

export const sidebarAtom = atomWithStorage('showSidebar', false)

const CreatePage: NextPage = () => {
  const [showSidebar, toggleSidebar] = useAtom(sidebarAtom)
  const [title, setTitle] = useAtom(titleAtom)
  const [header, setHeader] = useAtom(headerAtom)
  const [style, setStyle] = useAtom(styleAtom)
  const [options, setOptions] = useAtom(optionsAtom)
  const [blocks, setBlocks] = useAtom(blocksAtom)

  React.useEffect(() => {
    setTitle(null)
    setHeader({ icon: undefined, cover: undefined })
    setStyle({ fontStyle: 'font-sans', fullWidth: false, smallText: false })
    setOptions({ lockedResponses: false, publicResponses: false })
    setBlocks([])
  }, [setTitle, setHeader, setStyle, setOptions, setBlocks])

  return (
    <Layout>
      <SEO title={title ? title : 'Create a form'} icon={header.icon} />
      <Sidebar show={showSidebar} />
      <section className="w-screen h-screen overflow-y-auto flex-1 shadow-lg ring-1 ring-black/10">
        <EditorNavbar
          title={title}
          icon={header.icon}
          style={style}
          options={options}
          toggleSidebar={toggleSidebar}
        />
        <EditorHeader header={header} style={style} />
        <EditablePage title={title} blocks={blocks} style={style} />
      </section>
    </Layout>
  )
}

export default CreatePage
