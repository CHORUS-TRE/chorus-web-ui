import type { NextApiRequest, NextApiResponse } from 'next'
import { UserDBEntity } from './user-db-entity'
import { users as data } from '../mocks/users'

type ResponseData = {
  data: UserDBEntity[]
  error: Error | null
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  res.status(200).json({ data, error: null })
}
