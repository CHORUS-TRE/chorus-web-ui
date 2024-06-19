import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  content: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ content: 'Hello from CHORUS api!' })
}
