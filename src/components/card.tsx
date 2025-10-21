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
  className,
  ...props
}: {
  title?: React.ReactNode
  description?: React.ReactNode
  content?: React.ReactNode
  footer?: React.ReactNode
  className?: string
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'content'>) => (
  <ShadcnCard
    variant="glass"
    className={cn('flex h-full flex-col', className)}
    {...props}
  >
    <CardHeader className="pb-4">
      {title && (
        <CardTitle className="flex items-center gap-3 text-foreground">
          {title}
        </CardTitle>
      )}
      <CardDescription className="mb-3 text-xs text-muted">
        {description}
      </CardDescription>
    </CardHeader>
    <CardContent>{content}</CardContent>
    <div className="flex-grow" />
    <CardFooter className="flex items-end justify-start">{footer}</CardFooter>
  </ShadcnCard>
)

export { Card }
