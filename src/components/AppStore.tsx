import React from "react"
import { useEffect } from "react"

interface App {
  name: string
  label: string
  img: string
  description: string
  type: string
  url: string
}

export default function AppStore({ setShowModal }: { setShowModal: React.Dispatch<React.SetStateAction<boolean>> }
) {
  const [appstore, setAppstore] = React.useState<App[]>([]) as any[]
  const [selectedCategory, setSelectedCategory] = React.useState('ide') as any

  useEffect(() => {
    fetch('/appstore.json').then((res) => res.json()).then(setAppstore)
  }, [])


  const categories = appstore?.reduce((acc: string[], app: App): string[] => Array.from(new Set([...acc, app.type])), [])

  return (
    <div className="p-5 rounded-xl container mx-auto mb-16 absolute top-16 left-16 right-16 bottom-16 bg-white z-50 ">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-xl mb-6">App Store </h1>
        <button onClick={() => setShowModal(false)} className="bg-sky-500 hover:bg-sky-700 rounded px-2 py-1 text-[12px] float-right">
          Close
        </button>
      </div>
      <hr />
      <div className="mt-4 flex flex-wrap w-full">
        <div>
          <div className="sm:hidden">
            <label htmlFor="Tab" className="sr-only">Tab</label>
            <select id="Tab" className="w-full rounded-md border-gray-200">
              {categories.map((category: string) => <option  key={category}>{category}</option>)}
            </select>
          </div>

          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex gap-6" aria-label="Tabs">
                {categories.map((category: string) => <a
                  key={category}
                  href="#"
                  onClick={() => setSelectedCategory(category)}
                  className={`shrink-0 border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 ${selectedCategory === category && 'border-gray-300'}`}
                  aria-current="page"
                >
                  {category}
                </a>)}
              </nav>
            </div>
          </div>
        </div>

      </div>
      <div className="flex flex-wrap gap-4 mt-4">
        {appstore?.filter((f: App) => f.type === selectedCategory).map((app: any) => (
          <div className="px-5 pt-5 pb-2 w-96 h-auto border"  key={app.label}>
            <div className="flex flex-start gap-2 items-center mb-1">
              <img src={app.img || '/app.png'} className="rounded-full w-8 h-8" />
              <h2 className="text-md">{app.label}</h2>
            </div>
            <p className="text-[12px]">{app.description}</p>
            <button
              className="bg-sky-500 hover:bg-sky-700 rounded px-2 py-1 text-[12px] float-right mt-2">
              Install
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}