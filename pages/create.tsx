import type { NextPage } from 'next'

import { EditorNavbar } from 'containers/EditorNavbar'

const CreatePage: NextPage = () => {
  return (
    <main className="leading-tight text-gray-800 w-screen h-screen overflow-hidden">
      <section className="w-screen h-screen overflow-y-auto">
        <EditorNavbar />
      </section>
    </main>
  )
}

export default CreatePage
