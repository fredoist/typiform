import { NextApiRequest, NextApiResponse } from 'next'

const API = process.env.UNSPLASH_API
const TOKEN = process.env.UNSPLASH_TOKEN

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} not allowed`)
  }
  const { id } = req.query
  try {
    const request = await fetch(
      `${API}/photo/${id}/download?client_id=${TOKEN}`
    )
    const response = await request.json()
    res.status(200).json(response)
  } catch (error) {
    res.status(500).end(error)
  }
}
