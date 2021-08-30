import * as React from 'react'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'

import { EditorNavbar } from 'components/EditorNavbar'
import { EditorHeader } from 'components/EditorHeader'
import { EditablePage } from 'components/EditablePage'
import {
  blocksAtom,
  headerAtom,
  optionsAtom,
  styleAtom,
  titleAtom,
} from 'lib/atoms/form'
import { Sidebar } from 'components/Sidebar'

const sidebarAtom = atomWithStorage('showSidebar', false)

const CreatePage: NextPage = () => {
  const [showSidebar, toggleSidebar] = useAtom(sidebarAtom)
  const [title] = useAtom(titleAtom)
  const [header] = useAtom(headerAtom)
  const [style] = useAtom(styleAtom)
  const [options] = useAtom(optionsAtom)
  const [blocks] = useAtom(blocksAtom)

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
        />
        <EditorHeader header={header} style={style} />
        <EditablePage title={title} blocks={blocks} style={style} />
      </section>
    </main>
  )
}

export default CreatePage
