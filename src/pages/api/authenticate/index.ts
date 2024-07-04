import type { NextApiRequest, NextApiResponse } from 'next'
import { UserDBEntity } from '../users/user-db-entity'
import { user as data } from '../mocks/user'

type ResponseData = {
  data: UserDBEntity
  error: Error | null
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ data, error: null })
}
