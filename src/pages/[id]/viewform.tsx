import * as React from 'react'
import { GetServerSideProps, NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import cx from 'classnames'
import { useForm } from 'react-hook-form'
import { formBlock } from 'lib/types/form'
import { ArrowRightIcon } from '@heroicons/react/outline'
import toast from 'react-hot-toast'
import { sanitize } from 'lib/utils/sanitize'
import { Layout } from 'components/editor/Layout'
import { SEO } from 'components/common/SEO'

const ViewFormPage: NextPage<{ form: any }> = ({ form }) => {
  const router = useRouter()
  const { id } = router.query
  const { register, handleSubmit } = useForm()

  return (
    <Layout>
      <SEO
        title={form.title ? form.title : 'Untitled form'}
        icon={form.header.icon}
      />
      <section className="w-screen h-screen overflow-y-auto">
        <header className="relative">
          {form.header.cover && (
            <div className="relative w-full h-32 lg:h-56 overflow-hidden pointer-events-none bg-gray-100">
              <Image
                alt="Cover"
                src={form.header.cover}
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                className="w-full h-full object-center object-cover"
              />
            </div>
          )}
          <div
            className={cx('mx-auto px-2', {
              'max-w-5xl': form.style.fullWidth,
              'max-w-xl': !form.style.fullWidth,
            })}
          >
            {form.header.icon && (
              <div
                className={cx(
                  'w-16 h-16 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded overflow-hidden',
                  {
                    'relative mt-5': !form.header.cover,
                    'absolute -translate-y-1/2': form.header.cover,
                  }
                )}
              >
                <Image
                  src={form.header.icon}
                  alt="Icon"
                  width={128}
                  height={128}
                />
              </div>
            )}
          </div>
        </header>
        <div
          className={cx(form.style.fontStyle, 'mx-auto mt-6 px-2', {
            'max-w-5xl': form.style.fullWidth,
            'max-w-xl': !form.style.fullWidth,
            'text-sm': form.style.smallText,
            'text-base': !form.style.smallText,
            'pt-20': form.header.cover && form.header.icon,
          })}
        >
          <h1
            id="form-title"
            className={cx(
              form.style.fontStyle,
              'mt-2 mb-6 font-bold leading-none focus:outline-none',
              {
                'text-xl lg:text-2xl': form.style.smallText,
                'text-2xl lg:text-3xl': !form.style.smallText,
              }
            )}
          >
            {form.title}
          </h1>
          {!form.options.lockedResponses ? (
            <form
              className="pb-20"
              onSubmit={handleSubmit((data) => {
                const submitForm = fetch(`/api/forms/${id}/responses`, {
                  method: 'POST',
                  body: JSON.stringify({ data: data, formID: id }),
                })
                toast
                  .promise(submitForm, {
                    loading: 'Submitting responses',
                    success: 'Responses have been saved',
                    error: 'Error while submitting responses',
                  })
                  .then(() => {
                    router.push(`/${id}/thank-you`)
                  })
              })}
            >
              {form.blocks.map((block: formBlock) => (
                <div key={block.id} className="my-2">
                  {['textarea', 'input'].includes(block.tag)
                    ? React.createElement(block.tag, {
                        ...block.props,
                        placeholder: block.value,
                        ...register(
                          `${
                            block.value
                              ? `${sanitize(block.value).toString()}`
                              : 'Untitled question'
                          }`,
                          {
                            required: true,
                          }
                        ),
                      })
                    : React.createElement(block.tag, block.props, block.value)}
                </div>
              ))}
              <button
                type="submit"
                className="btn btn-primary py-2 focus:ring-4 focus:ring-red-500/40 focus:outline-none mt-12"
              >
                <span>Submit</span>
                <ArrowRightIcon className="icon" />
              </button>
            </form>
          ) : (
            <p>This form no longer accepts responses</p>
          )}
        </div>
      </section>
      <a
        className="absolute right-2 bottom-2 inline-block p-2 rounded shadow-lg bg-white ring-1 ring-black/10 text-sm"
        href="https://typiform.vercel.app"
        target="_blank"
        rel="noreferrer"
      >
        <span>Powered by Typiform</span>
      </a>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const request = await fetch(`${process.env.HARPERDB_URL}`, {
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
  const response = await request.json()

  if (response.length <= 0) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      form: response[0],
    },
  }
}

export default ViewFormPage
