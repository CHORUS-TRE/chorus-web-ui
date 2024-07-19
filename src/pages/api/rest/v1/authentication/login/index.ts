import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  data: { token: string } | null
  error: Error | null
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'POST') {
    console.log(req.body)
    res.status(200).json({ data: { token: 'Hello, Im a token' }, error: null })
  }

  res.status(200).json({ data: null, error: new Error('Method not allowed') })
}
