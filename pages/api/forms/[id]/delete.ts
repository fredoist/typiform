import { NextApiRequest, NextApiResponse } from 'next'
import { getSession, withApiAuthRequired } from '@auth0/nextjs-auth0'

const INSTANCE = process.env.HARPERDB_URL
const TOKEN = process.env.HARPERDB_TOKEN

export default withApiAuthRequired(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', ['DELETE'])
    res.status(405).end(`Method ${req.method} not allowed`)
  }
  const { id } = req.query
  try {
    const body = JSON.parse(req.body)
    const { user }: any = getSession(req, res)

    if (user?.sub !== body.workspace) {
      res.status(403).end(`You're not permitted to complete this action`)
    }

    const request = await fetch(`${INSTANCE}`, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${TOKEN}`,
      },
      body: JSON.stringify({
        operation: 'sql',
        sql: `DELETE FROM typiform.forms WHERE id='${id}' AND workspace='${user?.sub}'`,
      }),
    })
    const response = await request.json()
    res.status(200).json(response)
  } catch (error) {
    console.log(`Error deleting form:${id} -> ${error}`)
    res.status(500).end(error)
  }
})
