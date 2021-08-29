import type { NextPage } from 'next'
import Head from 'next/head'
import { useAtom } from 'jotai'

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

const CreatePage: NextPage = () => {
  const [title] = useAtom(titleAtom)
  const [header] = useAtom(headerAtom)
  const [style] = useAtom(styleAtom)
  const [options] = useAtom(optionsAtom)
  const [blocks] = useAtom(blocksAtom)

  return (
    <main className="leading-tight text-gray-800 w-screen h-screen overflow-hidden">
      <Head>
        <title>{title ? title : 'Untitled form'}</title>
        <link rel="icon" href={header.icon} />
      </Head>
      <section className="w-screen h-screen overflow-y-auto">
        <EditorNavbar
          title={title}
          icon={header.icon}
          style={style}
          options={options}
        />
        <EditorHeader header={header} style={style} />
        <EditablePage title={title} blocks={blocks} style={style} />
      </section>
    </main>
  )
}

export default CreatePage
