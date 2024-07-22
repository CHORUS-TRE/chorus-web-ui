import Link from 'next/link'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '~/components/ui/dropdown-menu'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '~/components/ui/card'

export function WorkspaceDashboard() {
  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between bg-primary px-6 py-4 text-primary-foreground">
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold"
            prefetch={false}
          >
            <MountainIcon className="h-6 w-6" />
            <span>Collaborative Workspace</span>
          </Link>
          <nav className="hidden gap-4 text-sm font-medium md:flex">
            <Link
              href="#"
              className="hover:text-primary-foreground/80"
              prefetch={false}
            >
              Research
            </Link>
            <Link
              href="#"
              className="hover:text-primary-foreground/80"
              prefetch={false}
            >
              Data Security
            </Link>
            <Link
              href="#"
              className="hover:text-primary-foreground/80"
              prefetch={false}
            >
              Policies
            </Link>
            <Link
              href="#"
              className="hover:text-primary-foreground/80"
              prefetch={false}
            >
              Infrastructure
            </Link>
            <Link
              href="#"
              className="hover:text-primary-foreground/80"
              prefetch={false}
            >
              Machine Learning
            </Link>
            <Link
              href="#"
              className="hover:text-primary-foreground/80"
              prefetch={false}
            >
              Ecology
            </Link>
            <Link
              href="#"
              className="hover:text-primary-foreground/80"
              prefetch={false}
            >
              Inclusivity
            </Link>
            <Link
              href="#"
              className="hover:text-primary-foreground/80"
              prefetch={false}
            >
              Community
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden md:inline-flex">
            <SearchIcon className="mr-2 h-5 w-5" />
            Search
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <img
                  src="/placeholder.svg"
                  width={32}
                  height={32}
                  className="rounded-full"
                  alt="Avatar"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="grid flex-1 grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Research</CardTitle>
            <CardDescription>
              Explore the latest research and findings across various domains.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BookOpenIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Research Papers
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Browse the latest research publications.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FileTextIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Data Sets
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Explore and download curated data sets.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <MicroscopeIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Experiments
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Discover and collaborate on research experiments.
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Data Security</CardTitle>
            <CardDescription>
              Ensure the safety and privacy of your research data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <LockIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Encryption
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Secure your data with advanced encryption methods.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ShieldIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Access Control
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Manage and control access to your sensitive data.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <DatabaseBackupIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Backup and Recovery
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure your data is safe with reliable backups.
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Policies and Compliance</CardTitle>
            <CardDescription>
              Stay up-to-date with the latest policies and regulations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <FileTextIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Policy Documents
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Access and review the latest policy updates.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CheckIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Compliance Checklists
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Ensure your projects meet regulatory requirements.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <BriefcaseIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Legal Resources
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Access legal guidance and support materials.
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Infrastructure</CardTitle>
            <CardDescription>
              Manage and optimize your research infrastructure.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ServerIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Compute Resources
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Access and manage your computational resources.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <DatabaseIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Data Storage
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Manage and scale your data storage solutions.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <NetworkIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Networking
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Optimize your network infrastructure for research.
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Machine Learning</CardTitle>
            <CardDescription>
              Leverage the power of machine learning for your research.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CodeIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    ML Models
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Access and utilize pre-trained ML models.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <CpuIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    ML Infrastructure
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Manage and scale your ML infrastructure.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ClipboardIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    ML Experiments
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Design and track your ML experiments.
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card text-card-foreground">
          <CardHeader>
            <CardTitle>Ecology and Sustainability</CardTitle>
            <CardDescription>
              Explore research and initiatives related to environmental
              sustainability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <LeafIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Sustainability Research
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Discover the latest research on environmental
                    sustainability.
                  </p>
                </div>
              </Link>
              <Link
                href="#"
                className="group flex items-center gap-4 rounded-md bg-card p-4 transition-colors hover:bg-card/80"
                prefetch={false}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <RecycleIcon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium group-hover:underline">
                    Sustainability Initiatives
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Learn about and participate in sustainability initiatives.
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

function BookOpenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function BriefcaseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      <rect width="20" height="14" x="2" y="6" rx="2" />
    </svg>
  )
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function ClipboardIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    </svg>
  )
}

function CodeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

function CpuIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="16" height="16" x="4" y="4" rx="2" />
      <rect width="6" height="6" x="9" y="9" rx="1" />
      <path d="M15 2v2" />
      <path d="M15 20v2" />
      <path d="M2 15h2" />
      <path d="M2 9h2" />
      <path d="M20 15h2" />
      <path d="M20 9h2" />
      <path d="M9 2v2" />
      <path d="M9 20v2" />
    </svg>
  )
}

function DatabaseBackupIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 12a9 3 0 0 0 5 2.69" />
      <path d="M21 9.3V5" />
      <path d="M3 5v14a9 3 0 0 0 6.47 2.88" />
      <path d="M12 12v4h4" />
      <path d="M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16" />
    </svg>
  )
}

function DatabaseIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  )
}

function FileTextIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  )
}

function LeafIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
      <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
    </svg>
  )
}

function LockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function MicroscopeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  )
}

function MountainIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}

function NetworkIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="16" y="16" width="6" height="6" rx="1" />
      <rect x="2" y="16" width="6" height="6" rx="1" />
      <rect x="9" y="2" width="6" height="6" rx="1" />
      <path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" />
      <path d="M12 12V8" />
    </svg>
  )
}

function RecycleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </svg>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

function ServerIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="8" x="2" y="2" rx="2" ry="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" ry="2" />
      <line x1="6" x2="6.01" y1="6" y2="6" />
      <line x1="6" x2="6.01" y1="18" y2="18" />
    </svg>
  )
}

function ShieldIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  )
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
