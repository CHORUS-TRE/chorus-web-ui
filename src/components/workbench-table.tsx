'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { EllipsisVerticalIcon } from 'lucide-react'

import { workbenchList } from '@/components/actions/workbench-view-model'

import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '~/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as TableRowComponent
} from '~/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { Workbench } from '~/domain/model'
import { useToast } from '~/hooks/use-toast'

import { WorksbenchDeleteForm } from './forms/workbench-forms'
import { useNavigation } from './store/navigation-context'

export default function WorkbenchTable({
  onUpdate
}: {
  onUpdate?: () => void
}) {
  const [error, setError] = useState<string | null>(null)
  const [workbenches, setWorkbenches] = useState<Workbench[]>([])
  const [deleted, setDeleted] = useState<boolean>(false)
  const { toast } = useToast()

  const params = useParams<{ workspaceId: string }>()
  const { setBackground, background } = useNavigation()

  const workspaceId = params?.workspaceId

  const list = useCallback(() => {
    setTimeout(() => {
      workbenchList()
        .then((response) => {
          if (response?.error) setError(response.error)
          if (response?.data) setWorkbenches(response?.data)
        })
        .catch((error) => {
          setError(error.message)
        })
    }, 2000)
  }, [])

  useEffect(() => {
    workbenchList()
      .then((response) => {
        if (response?.error) {
          setError(response.error)
          toast({
            title: 'Error!',
            description: response.error,
            variant: 'destructive'
          })
        }
        if (response?.data) setWorkbenches(response?.data)
      })
      .catch((error) => {
        setError(error.message)
        toast({
          title: 'Error!',
          description: error.message,
          variant: 'destructive'
        })
      })
  }, [])

  const TableHeads = () => (
    <>
      <TableHead>Name</TableHead>
      <TableHead className="hidden md:table-cell">Created</TableHead>

      <TableHead>Status</TableHead>
      <TableHead>
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ workbench }: { workbench?: Workbench }) => {
    const link = `/workspaces/${workbench?.workspaceId}/${workbench?.id}`

    return (
      <TableRowComponent>
        <TableCell className="p-1 font-medium">
          <Link
            href={link}
            className="text-muted hover:border-b-2 hover:border-accent [&.active]:border-b-2 [&.active]:border-accent"
          >
            {workbench?.shortName}
          </Link>
        </TableCell>

        <TableCell
          className="hidden p-1 md:table-cell"
          title={workbench?.createdAt.toLocaleDateString()}
        >
          {workbench && formatDistanceToNow(workbench?.createdAt)} ago
        </TableCell>
        <TableCell className="p-1">
          <Badge variant="outline">{workbench?.status}</Badge>
        </TableCell>
        <TableCell className="p-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <EllipsisVerticalIcon className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black text-white">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem disabled>Edit</DropdownMenuItem>
              <DropdownMenuItem>
                <WorksbenchDeleteForm
                  id={workbench?.id}
                  onUpdate={() => {
                    setDeleted(true)
                    toast({
                      title: 'Success!',
                      description: 'Desktop deleted',
                      className: 'bg-background text-white'
                    })

                    if (background?.workbenchId === workbench?.id)
                      setBackground(undefined)
                    if (onUpdate) onUpdate()

                    list()
                  }}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRowComponent>
    )
  }

  const CardContainer = ({ workbenches }: { workbenches?: Workbench[] }) => (
    <Card className="border-0 border-r-0 bg-background text-white">
      <CardHeader>
        <CardTitle>Desktops</CardTitle>
        <CardDescription>Your running desktops</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRowComponent>
              <TableHeads />
            </TableRowComponent>
          </TableHeader>
          <TableBody>
            {workbenches?.map((w) => <TableRow key={w.id} workbench={w} />)}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-{workbenches?.length}</strong> of{' '}
          <strong>{workbenches?.length}</strong> apps
        </div>
      </CardFooter>
    </Card>
  )

  const nextWorkbenches = workbenches?.filter(
    (w) => w.workspaceId === workspaceId
  )

  return (
    <div className="mb-4 grid flex-1 items-start gap-4">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all">
          <CardContainer workbenches={nextWorkbenches} />
        </TabsContent>
        <TabsContent value="active">
          <CardContainer
            workbenches={nextWorkbenches?.filter((a) => a.status === 'active')}
          />
        </TabsContent>
        <TabsContent value="archived">
          <CardContainer
            workbenches={nextWorkbenches?.filter((a) => a.status !== 'active')}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
