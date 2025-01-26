import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

type AppIconConfig = {
  forceAvatar?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  id?: string
}

const FORCE_AVATAR_APPS = new Set(['jupyterlab', 'didata', 'rstudio', 'jupyter', 'sciterminal'])
const SVG_APPS = new Set(['zenodo-public', 'sciterminal'])

const SIZE_MAPS = {
  sm: { avatar: 'h-8 w-8', image: 32 },
  md: { avatar: 'h-12 w-12', image: 48 },
  lg: { avatar: 'h-20 w-20', image: 80 }
}

export function getAppIcon(appName: string, config: AppIconConfig = {}): React.ReactNode {
  const { forceAvatar = false, size = 'md', className = '', id = '' } = config
  const dimensions = SIZE_MAPS[size]

  const shouldUseAvatar = forceAvatar || FORCE_AVATAR_APPS.has(appName)
  const isSvg = SVG_APPS.has(appName)
  const imageExt = isSvg ? 'svg' : 'png'

  if (shouldUseAvatar) {
    return (
      <Avatar className={`${dimensions.avatar} ${className}`}>
        <AvatarImage
          src={`/app-icons/${appName}.${imageExt}`}
          className="m-auto"
        />
        <AvatarFallback className="text-2xl">
          {appName.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <Image
      src={`/app-icons/${appName}.${imageExt}`}
      alt={`${appName} icon`}
      width={dimensions.image}
      height={dimensions.image}
      className={className}
      onError={(e) => {
        const target = document.getElementsByClassName(`${id}-${appName}-icon`)[0]

        e.currentTarget.style.display = 'none'
        const fallback = document.createElement('div')
        fallback.id = `/app-icons/${appName}.${imageExt}`
        fallback.className = `${dimensions.avatar} flex items-center justify-center bg-muted text-2xl rounded-full ${className} ${id}-${appName}-icon`
        fallback.textContent = appName.slice(0, 2).toUpperCase()

        if (!target) {
          e.currentTarget.replaceWith(fallback)
        } else {
          target.replaceWith(fallback)
        }
      }}
    />
  )
}
