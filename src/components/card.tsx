import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { cn } from '@/lib/utils'

const Card = ({
  title,
  description,
  content,
  footer,
  className
}: {
  title?: React.ReactNode
  description?: string
  content?: React.ReactNode
  footer?: React.ReactNode
  className?: string
}) => (
  <ShadcnCard
    className={cn(
      'flex h-full flex-col rounded-2xl border-muted/40 bg-background/60 text-white',
      className
    )}
  >
    <CardHeader className="pb-4">
      <CardTitle className="flex items-center gap-3 pr-2 text-white">
        {title}
      </CardTitle>
      <CardDescription className="mb-3 text-xs text-muted">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>{content}</CardContent>
    <div className="flex-grow" />
    <CardFooter>{footer}</CardFooter>
  </ShadcnCard>
)

export { Card }
