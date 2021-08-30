import { NextPage } from 'next'
import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'

const ErrorPage: NextPage = () => {
  return (
    <main className="flex items-center justify-center h-screen w-screen overflow-hidden">
      <Head>
        <title>Page Not Found</title>
      </Head>
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-sm text-gray-500 py-2">
          The page you were looking for was not found
        </p>
        <Link href="/">
          <a className="text-blue-500">Back to homepage</a>
        </Link>
      </div>
    </main>
  )
}

export default ErrorPage
