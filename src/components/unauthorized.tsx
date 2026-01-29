import { ShieldAlert } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Unauthorized() {
  return (
    <div className="flex flex-col items-center justify-center p-8 pt-32 text-center">
      <Card className="w-full max-w-md border-destructive/50 bg-destructive/5">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-destructive/10 p-3">
              <ShieldAlert className="h-12 w-12 text-destructive" />
            </div>
          </div>
          <CardTitle className="text-xl text-destructive">
            Access Denied
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            You do not have permission to this page. Please contact your system
            administrator if you believe this is an error.
          </p>
          <Button asChild variant="outline">
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
