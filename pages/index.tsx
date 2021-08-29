import type { NextPage } from 'next'
import Link from 'next/link'
import { useUser } from '@auth0/nextjs-auth0'

const IndexPage: NextPage = () => {
  const { user, error, isLoading } = useUser()
  if (isLoading) return <h1>Loading</h1>
  if (error) return <h1>Error</h1>

  return (
    <div>
      <h1>Hello, {user?.name}</h1>
      {user ? (
        <Link href="/create">Create a form</Link>
      ) : (
        <a href="/api/auth/login">Log In</a>
      )}
    </div>
  )
}

export default IndexPage
