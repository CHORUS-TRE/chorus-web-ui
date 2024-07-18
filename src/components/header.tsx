import { Search } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'
import { Input } from './ui/input'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'

const plateform = {
  navigation: ['Projects', 'Teams', 'Data', 'App Store', 'Getting Started']
}
const showLargeLeftSidebar = true

export function Header() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-8 bg-background px-4  pb-16 sm:static sm:h-auto sm:gap-1 sm:bg-transparent sm:px-6 sm:py-1  ">
      <nav className="flex flex-grow items-center justify-end gap-x-8 pr-8">
        {plateform.navigation.map((item) => (
          <Link
            href="#"
            className="flex items-center justify-center"
            prefetch={false}
          >
            {item}
          </Link>
        ))}
      </nav>
      <div className="relative ml-auto flex-1 pr-4 md:grow-0">
        <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search..."
          className=" h-7 pl-8 md:w-[200px] lg:w-[336px]"
        />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="overflow-hidden rounded-full">
            <img
              src="/placeholder.svg"
              width={36}
              height={36}
              alt="Avatar"
              className="overflow-hidden rounded-full"
            />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
