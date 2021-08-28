import type { NextPage } from 'next'
import Head from 'next/head'

import { EditorNavbar } from 'components/EditorNavbar'
import { EditorHeader } from 'components/EditorHeader'
import { formHeader, formTitle } from 'lib/entities/form'
import { EditablePage } from 'components/EditablePage'

const CreatePage: NextPage = () => {
  const title = formTitle.use()
  const icon = formHeader.use((state) => state.icon)

  return (
    <main className="leading-tight text-gray-800 w-screen h-screen overflow-hidden">
      <Head>
        <title>{title ? title : 'Create a form'}</title>
        <link rel="icon" href={icon} />
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
