import { redirect } from 'next/navigation'

export default function AuthorizationPage() {
  redirect('/admin/authorization/roles')
}
