import type { NextPage } from 'next'
import Head from 'next/head'

import { EditorNavbar } from 'containers/EditorNavbar'
import { EditorHeader } from 'containers/EditorHeader'
import { formTitle } from 'entities/form'

const CreatePage: NextPage = () => {
  const title = formTitle.use()

  return (
    <main className="leading-tight text-gray-800 w-screen h-screen overflow-hidden">
      <Head>
        <title>{title ? title : 'Create a form'}</title>
      </Head>
      <section className="w-screen h-screen overflow-y-auto">
        <EditorNavbar />
        <EditorHeader />
      </section>
    </main>
  )
}

export default CreatePage
