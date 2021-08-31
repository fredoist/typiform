import * as React from 'react'
import Head from 'next/head'
import { Toaster } from 'react-hot-toast'

interface Layout {
  title: string | null
  description?: string
  icon?: string
  children: React.ReactChild | React.ReactChild[]
}

const Layout = ({ title, description, icon, children }: Layout) => {
  title = title || 'Untitled form'
  icon = icon || '/img/defaultIcon.svg'
  return (
    <main
      role="main"
      className="leading-tight text-gray-800 w-screen h-screen overflow-hidden lg:flex"
    >
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="shortcut icon" href={icon} type="image/x-icon" />
      </Head>
      <Toaster />
      {children}
    </main>
  )
}

export { Layout }
