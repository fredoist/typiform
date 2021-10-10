import * as React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import { useAtom } from 'jotai'
import { getSession } from '@auth0/nextjs-auth0'

import { Sidebar } from 'components/editor/Sidebar'
import { EditorNavbar } from 'components/editor/EditorNavbar'
import { EditorHeader } from 'components/editor/EditorHeader'
import { EditablePage } from 'components/editor/EditablePage'
import { sidebarAtom } from 'pages/create'
import {
  blocksAtom,
  headerAtom,
  optionsAtom,
  styleAtom,
  titleAtom,
} from 'lib/atoms/form'
import { Layout } from 'components/editor/Layout'
import { SEO } from 'components/common/SEO'
import { OverlayPage } from 'components/common/OverlayPage'

interface PageProps {
  form: any // TODO: Add form response types
  notAllowed: boolean
}

const EditPage: NextPage<PageProps> = ({ form, notAllowed }) => {
  const [showSidebar, toggleSidebar] = useAtom(sidebarAtom)
  const [title, setTitle] = useAtom(titleAtom)
  const [header, setHeader] = useAtom(headerAtom)
  const [style, setStyle] = useAtom(styleAtom)
  const [options, setOptions] = useAtom(optionsAtom)
  const [blocks, setBlocks] = useAtom(blocksAtom)

  React.useEffect(() => {
    if (form) {
      setTitle(form.title)
      setHeader(form.header)
      setStyle(form.style)
      setOptions(form.options)
      setBlocks(form.blocks)
    }
  }, [form, setTitle, setHeader, setStyle, setOptions, setBlocks])

  if (notAllowed) {
    return (
      <OverlayPage
        title="Not Allowed"
        description="You can't access this page"
      />
    )
  }

  return (
    <Layout>
      <SEO title={title ? title : 'Untitled form'} icon={header.icon} />
      <Sidebar show={showSidebar} />
      <section className="w-screen h-screen overflow-y-auto flex-1 shadow-lg ring-1 ring-black/10">
        <EditorNavbar
          title={title}
          icon={header.icon}
          style={style}
          options={options}
          toggleSidebar={toggleSidebar}
          workspace={form.workspace}
        />
        <EditorHeader header={header} style={style} />
        <EditablePage title={title} blocks={blocks} style={style} />
      </section>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = getSession(req, res)
  const user = session && session.user

  if (!user) {
    return {
      redirect: {
        destination: `/api/auth/login?returnTo=/${query.id}/edit`,
        permanent: false,
      },
    }
  }

  const formReq = await fetch(`${process.env.HARPERDB_URL}`, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${process.env.HARPERDB_TOKEN}`,
    },
    body: JSON.stringify({
      operation: 'sql',
      sql: `SELECT * FROM typiform.forms WHERE id='${query.id}'`,
    }),
  })
  const formRes = await formReq.json()
  const form = formRes[0]

  // formRes returns an empty array if no form is found on DB
  if(formRes <= 0) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      user,
      form: form,
      notAllowed: form.workspace !== user.sub,
    },
  }
}

export default EditPage
