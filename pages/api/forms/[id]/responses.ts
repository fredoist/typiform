import { NextApiRequest, NextApiResponse } from 'next'

const INSTANCE = process.env.HARPERDB_URL
const TOKEN = process.env.HARPERDB_TOKEN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const body = JSON.parse(req.body)
    const request = await fetch(`${INSTANCE}`, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${TOKEN}`,
      },
      body: JSON.stringify({
        operation: 'insert',
        schema: 'typiform',
        table: 'responses',
        records: [body],
      }),
    })
    const response = await request.json()
    res.status(200).json({ id: response.inserted_hashes[0] })
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(500).end(`Method ${req.method} now allowed`)
  }
}
