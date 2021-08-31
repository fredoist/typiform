import { NextApiRequest, NextApiResponse } from 'next'
import { withApiAuthRequired } from '@auth0/nextjs-auth0'

const INSTANCE = process.env.HARPERDB_URL
const TOKEN = process.env.HARPERDB_TOKEN

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH'])
    res.status(405).end(`Method ${req.method} not allowed`)
  }

  const body = JSON.parse(req.body)
  const request = await fetch(`${INSTANCE}`, {
    method: 'POST',
    redirect: 'follow',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${TOKEN}`,
    },
    body: JSON.stringify({
      operation: 'update',
      schema: 'typiform',
      table: 'forms',
      records: [body],
    }),
  })
  const response = await request.json()
  res.status(200).json({ id: response.update_hashes[0] })
})
