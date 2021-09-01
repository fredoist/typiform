import { NextPage } from 'next'
import * as React from 'react'
import Link from 'next/link'
import { Layout } from 'components/Layout'

const ErrorPage: NextPage = () => {
  return (
    <Layout title="Page Not Found" className="flex justify-center items-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Page Not Found</h1>
        <p className="text-sm text-gray-500 py-2">
          The page you were looking for was not found
        </p>
        <Link href="/">
          <a className="text-blue-500">Back to homepage</a>
        </Link>
      </div>
    </Layout>
  )
}

export default ErrorPage
