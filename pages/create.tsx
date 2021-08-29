import type { NextPage } from 'next'
import Head from 'next/head'

import { EditorNavbar } from 'components/EditorNavbar'
import { EditorHeader } from 'components/EditorHeader'
import { EditablePage } from 'components/EditablePage'
import { useAtom } from 'jotai'
import { headerAtom, titleAtom } from 'lib/atoms/form'

const CreatePage: NextPage = () => {
  const [title] = useAtom(titleAtom)
  const [header] = useAtom(headerAtom)

  return (
    <main className="leading-tight text-gray-800 w-screen h-screen overflow-hidden">
      <Head>
        <title>{title ? title : 'Create a form'}</title>
        <link rel="icon" href={header.icon} />
      </Head>
      <section className="w-screen h-screen overflow-y-auto">
        <EditorNavbar />
        <EditorHeader />
        <EditablePage />
      </section>
    </main>
  )
}

export default CreatePage
