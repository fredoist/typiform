import { OverlayPage } from 'components/OverlayPage'
import * as React from 'react'
import { NextPage } from 'next'

const ThankYouPage: NextPage = () => {
  return (
    <OverlayPage
      title="Thank you!"
      description="Your responses have been successfully submitted"
    />
  )
}

export default ThankYouPage
