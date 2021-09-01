import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const url = decodeURIComponent(req.query.url as string)
  const request = await fetch(url)
  const response: any = await request.body
  response.pipe(res)
}
