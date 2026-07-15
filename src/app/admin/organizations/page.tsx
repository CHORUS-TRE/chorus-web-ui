'use client'

import { Building2, Pencil, Plus, Trash2 } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { errorToast } from '@/components/error-toast'
import {
  OrganizationCreateForm,
  OrganizationDeleteForm,
  OrganizationUpdateForm
} from '@/components/forms/organization-forms'
import { toast } from '@/components/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Organization } from '@/domain/model'
import { useDisplayOrganizations } from '@/hooks/use-instance-config'
import { countryName } from '@/lib/countries'
import { useDevStoreCache } from '@/stores/dev-store-cache'
import {
  organizationList,
  organizationLogoDataUrl,
  organizationLogoGet
} from '@/view-model/organization-view-model'

export default function AdminOrganizationsPage() {
  const [organizations, setOrganizations] = useState<
    Organization[] | undefined
  >(undefined)
  const [logos, setLogos] = useState<Record<string, string | undefined>>({})
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null)
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null)
  const displayOrganizations = useDisplayOrganizations()

  const handleToggleSidebar = async (checked: boolean) => {
    const { setDisplayOrganizations } = useDevStoreCache.getState()
    const success = await setDisplayOrganizations(checked)
    if (!success) {
      toast({
        title: 'An error occurred.',
        description: 'Please try again.',
        variant: 'destructive'
      })
    }
  }

  const fetchOrganizations = useCallback(async () => {
    const result = await organizationList()
    if (result.error) {
      toast({ ...errorToast(result.error), variant: 'destructive' })
      return
    }
    setOrganizations(result.data)

    const organizations = result.data ?? []
    const entries = await Promise.all(
      organizations.map(async (organization) => {
        const logoResult = await organizationLogoGet(organization.id)
        return [
          organization.id,
          organizationLogoDataUrl(logoResult.data)
        ] as const
      })
    )
    setLogos(Object.fromEntries(entries))
  }, [])

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  const activeUpdateOrganization = useMemo(
    () => organizations?.find((o) => o.id === activeUpdateId),
    [organizations, activeUpdateId]
  )

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="flex items-center gap-3 text-3xl font-semibold text-muted-foreground">
            <Building2 className="h-9 w-9" />
            Organizations
          </h1>
          <p className="mb-8 text-muted-foreground">
            Manage organizations on the platform.
          </p>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Switch
            checked={displayOrganizations}
            onCheckedChange={handleToggleSidebar}
          />
          <span className="text-sm text-muted-foreground">Show in sidebar</span>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Organization
        </Button>
      </div>

      <Card variant="glass" className="flex flex-col justify-between">
        <CardContent className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="p-2 font-semibold text-foreground">
                  Logo
                </TableHead>
                <TableHead className="p-2 font-semibold text-foreground">
                  Name
                </TableHead>
                <TableHead className="p-2 font-semibold text-foreground">
                  City / Country
                </TableHead>
                <TableHead className="p-2 font-semibold text-foreground">
                  Website
                </TableHead>
                <TableHead className="p-2 text-right font-semibold text-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {organizations?.map((organization) => (
                <TableRow
                  key={organization.id}
                  className="border-muted/40 bg-background/40 transition-colors hover:bg-muted/10"
                >
                  <TableCell className="p-2">
                    <Avatar className="h-8 w-8 rounded-md">
                      {logos[organization.id] && (
                        <AvatarImage
                          src={logos[organization.id]}
                          alt={organization.name}
                        />
                      )}
                      <AvatarFallback className="rounded-md">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="p-2 font-medium">
                    {organization.name}
                  </TableCell>
                  <TableCell className="p-2">
                    {[
                      organization.city,
                      organization.country
                        ? countryName(organization.country)
                        : undefined
                    ]
                      .filter(Boolean)
                      .join(', ') || '—'}
                  </TableCell>
                  <TableCell className="p-2">
                    {organization.websiteUrl || '—'}
                  </TableCell>
                  <TableCell className="p-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveUpdateId(organization.id)}
                      >
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setActiveDeleteId(organization.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {organizations !== undefined && !organizations.length && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No organizations found.
                  </TableCell>
                </TableRow>
              )}
              {organizations === undefined && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Loading…
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>{organizations?.length || 0}</strong> organizations
          </div>
        </CardFooter>
      </Card>

      <OrganizationCreateForm
        state={[showCreateDialog, setShowCreateDialog]}
        onSuccess={() => fetchOrganizations()}
      />

      <OrganizationUpdateForm
        organization={activeUpdateOrganization}
        state={[!!activeUpdateId, () => setActiveUpdateId(null)]}
        onSuccess={() => fetchOrganizations()}
      />

      <OrganizationDeleteForm
        id={activeDeleteId ?? undefined}
        state={[!!activeDeleteId, () => setActiveDeleteId(null)]}
        onSuccess={() => fetchOrganizations()}
      />
    </div>
  )
}
