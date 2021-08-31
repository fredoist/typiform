import { NextPage } from 'next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useUser } from '@auth0/nextjs-auth0'
import {
  AnnotationIcon,
  ArrowRightIcon,
  AtSymbolIcon,
  DocumentTextIcon,
  LoginIcon,
  PencilIcon,
} from '@heroicons/react/outline'
import { Logo } from 'components/Logo'
import { Layout } from 'components/Layout'

const IndexPage: NextPage = () => {
  const router = useRouter()
  const { user } = useUser()

  if (user) {
    router.push(`/create`)
  }

  return (
    <Layout
      title="Simple online form builder that works like a doc - Typiform"
      icon="/icon.svg"
    >
      <div className="lg:w-1/4">
        <div className="flex px-4 py-6 items-center justify-between">
          <Logo />
          <a className="btn" href="/api/auth/login?returnTo=/create">
            <span>Log In</span>
            <LoginIcon className="icon" />
          </a>
        </div>
        <div className="p-4">
          <h1 className="font-bold text-3xl leading-none mb-4">
            Easy form builder that works like a doc
          </h1>
          <p className="text-gray-700 py-2">
            Seamlessly create online forms for all purposes and collect data
            without knowing how to code
          </p>
          <Link passHref href="/create">
            <button className="btn btn-primary mt-4 flex">
              <span>Create a form</span>
              <ArrowRightIcon className="icon" />
            </button>
          </Link>
          <span className="text-sm">No account required</span>
        </div>
        <div className="p-4">
          <ul>
            <li className="flex items-center gap-2 my-2">
              <DocumentTextIcon className="icon text-gray-400" />
              <span>Create unlimited forms</span>
            </li>
            <li className="flex items-center gap-2 my-2">
              <AnnotationIcon className="icon text-gray-400" />
              <span>Receive unlimited responses</span>
            </li>
            <li className="flex items-center gap-2 my-2">
              <PencilIcon className="icon text-gray-400" />
              <span>Easily customize to match your brand</span>
            </li>
            <li className="flex items-center gap-2 my-2">
              <AtSymbolIcon className="icon text-gray-400" />
              <span>Simple form elements</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="p-4 lg:flex-1 bg-gradient-to-tr from-blue-600 to-blue-700 flex items-center justify-center">
        <div className="w-3/4">
          <Image
            src="/landing/screenshot.png"
            width={840}
            height={411}
            className="shadow-2xl rounded overflow-hidden"
            alt="App screenshot"
          />
        </div>
      </div>
    </Layout>
  )
}

export default IndexPage
