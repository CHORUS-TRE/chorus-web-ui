import { Workspace } from '~/domain/model'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from './ui/card'

export default function WorkspaceHeader({
  workspace
}: {
  workspace?: Workspace
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl">Project: {workspace?.name}</CardTitle>
        <div>
          <p className="text-xs text-muted-foreground">
            <strong>Type: </strong>
            {workspace?.tags.join(', ')}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Status: </strong>
            {workspace?.status}
          </p>
          <p className="text-xs text-muted-foreground">
            <strong>Creation date: </strong>
            {workspace?.createdAt.toLocaleDateString()}
          </p>
        </div>
        <CardDescription>{workspace?.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">
          <span>{workspace?.ownerId}</span>
        </p>
      </CardContent>
    </Card>
  )
}
