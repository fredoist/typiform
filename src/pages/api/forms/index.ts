import { NextApiResponse, NextApiRequest } from 'next'

const INSTANCE = process.env.HARPERDB_URL
const TOKEN = process.env.HARPERDB_TOKEN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH'])
    res.status(405).end(`Method ${req.method} not allowed`)
  }
  try {
    const body = JSON.parse(req.body)
    const request = await fetch(`${INSTANCE}`, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${TOKEN}`,
      },
      body: JSON.stringify({
        operation: 'upsert',
        schema: 'typiform',
        table: 'forms',
        records: [body],
      }),
    })
    const response = await request.json()
    res.status(200).json({ id: response.upserted_hashes[0] })
  } catch (error) {
    console.log(`Error creating form -> ${error}`)
    res.status(500).end(error)
  }
}
