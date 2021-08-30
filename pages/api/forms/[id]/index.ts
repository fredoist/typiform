import { NextApiRequest, NextApiResponse } from 'next'

const INSTANCE = process.env.HARPERDB_URL
const TOKEN = process.env.HARPERDB_TOKEN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query
  if (req.method === 'GET') {
    const request = await fetch(`${INSTANCE}`, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${TOKEN}`,
      },
      body: JSON.stringify({
        operation: 'sql',
        sql: `SELECT * FROM typiform.forms WHERE id='${id}'`,
      }),
    })
    const response = await request.json()
    res.status(200).json(response[0])
  } else if (req.method === 'PATCH') {
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
  } else {
    res.setHeader('Allow', ['GET', 'PATCH'])
    res.status(405).end(`Method ${req.method} not allowed`)
  }
}
