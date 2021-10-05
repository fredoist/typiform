import * as React from 'react'
import { NextPage } from 'next'
import { OverlayPage } from 'components/common/OverlayPage'
import { Layout } from 'components/Layout'

const ThankYouPage: NextPage = () => {
  return (
    <Layout title="Thank you">
      <OverlayPage
        title="Thank you!"
        description="Your responses have been successfully submitted"
      />
    </Layout>
  )
}

export default ThankYouPage
