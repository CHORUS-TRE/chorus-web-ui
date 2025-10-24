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
    <CardHeader className="mb-2 h-24 w-full">
      {title && (
        <CardTitle className="mb-1 flex items-center gap-3">{title}</CardTitle>
      )}

      <CardDescription className="text-xs text-muted-foreground">
        {description}
      </CardDescription>
    </CardHeader>
    {/* <hr className="border-muted/40 pt-3" /> */}
    <CardContent>{content}</CardContent>
    <div className="flex-grow" />
    <CardFooter className="flex items-end justify-start">{footer}</CardFooter>
  </ShadcnCard>
)

export { Card }
