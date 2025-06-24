import Link from 'next/link'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export const Dashboard = () => (
  <Card>
    <CardHeader>
      <CardTitle>Welcome to the workspace administration</CardTitle>
    </CardHeader>
    <CardContent>Lorem ipsum sic dolor amet...</CardContent>
    <CardFooter>
      <Link href="/admin#workspaces">Workspaces</Link>
    </CardFooter>
  </Card>
)
