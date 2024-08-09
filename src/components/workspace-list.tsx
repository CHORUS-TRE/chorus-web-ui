import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
  CardFooter
} from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuCheckboxItem
} from '~/components/ui/dropdown-menu'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '~/components/ui/tabs'
import {
  Table,
  TableHeader,
  TableRow as TableRowComponent,
  TableHead,
  TableBody,
  TableCell
} from '~/components/ui/table'
import { Badge } from '~/components/ui/badge'
import { Icons } from './ui/icons'
import { Workspace } from '~/domain/model'
import placeholder from '/public/placeholder.svg'
import Image from 'next/image'
import { EllipsisVerticalIcon } from 'lucide-react'

export default function WorkspaceList({
  workspaces,
  handleWorkspaceClicked,
  handleCreateWorkspaceClicked,
  handleDeleteWorkspaceClicked
}: {
  workspaces?: Workspace[]
  handleWorkspaceClicked: (id?: string) => void
  handleCreateWorkspaceClicked: () => void
  handleDeleteWorkspaceClicked: (id?: string) => void
}) {
  const TableHeads = () => (
    <>
      <TableHead className="hidden w-[100px] sm:table-cell">
        <span className="sr-only">Image</span>
      </TableHead>
      <TableHead>Name</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="hidden md:table-cell">Members</TableHead>
      <TableHead className="hidden md:table-cell">Created at</TableHead>
      <TableHead>
        <span className="sr-only">Actions</span>
      </TableHead>
    </>
  )

  const TableRow = ({ workspace }: { workspace?: Workspace }) => (
    <TableRowComponent
    // onClick={() => handleWorkspaceClicked(app?.id)}
    >
      <TableCell className="hidden sm:table-cell">
        <Image
          src={placeholder}
          alt={workspace?.name || 'App image'}
          width="64"
          height="64"
          className="aspect-square rounded-md object-cover"
        />
      </TableCell>
      <TableCell className="font-medium">{workspace?.name}</TableCell>
      <TableCell>
        <Badge variant="outline">{workspace?.status}</Badge>
      </TableCell>
      <TableCell className="font-medium">
        {workspace?.workbenchIds?.toString()}
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {workspace?.createdAt.toLocaleDateString()}
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-haspopup="true" size="icon" variant="ghost">
              <EllipsisVerticalIcon className="h-4 w-4" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDeleteWorkspaceClicked(workspace?.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRowComponent>
  )

  const CardContainer = ({ workspaces }: { workspaces?: Workspace[] }) => (
    <Card>
      <CardHeader>
        <CardTitle>Workspaces</CardTitle>
        <CardDescription>The workspaces you collaborate on</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRowComponent>
              <TableHeads />
            </TableRowComponent>
          </TableHeader>
          <TableBody>
            {workspaces?.map((w) => <TableRow key={w.id} workspace={w} />)}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>32</strong> apps
        </div>
      </CardFooter>
    </Card>
  )

  return (
    <div className="mb-8 grid flex-1 items-start gap-4 pr-8 md:gap-8">
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Icons.ListFilterIcon className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              size="sm"
              className="h-8 gap-1"
              onClick={handleCreateWorkspaceClicked}
            >
              <Icons.CirclePlusIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Workspace
              </span>
            </Button>
          </div>
        </div>
        <TabsContent value="all">
          <CardContainer workspaces={workspaces} />
        </TabsContent>
        <TabsContent value="active">
          <CardContainer
            workspaces={workspaces?.filter((a) => a.status === 'active')}
          />
        </TabsContent>
        <TabsContent value="archived">
          <CardContainer
            workspaces={workspaces?.filter((a) => a.status !== 'active')}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
