import Image from 'next/image'
import { Tour } from 'nextstepjs'

import logo from '/public/logo-chorus-primaire-black@2x.svg'

export const steps: Tour[] = [
  {
    tour: 'gettingStartedTour',
    steps: [
      {
        title: 'Welcome to CHORUS!',
        icon: (
          <Image
            src={logo}
            alt="Chorus"
            height={32}
            className="aspect-auto"
            id="logo-tour"
          />
        ),
        content: (
          <div className="min-w-[480px]">
            <h5 className="mb-4 text-2xl font-bold">
              Let&apos;s get you started !
            </h5>
            {/* <Image src={'/placeholder.svg'} alt="Chorus" height={160} width={480} className="h-48 w-[480px]" id="logo-tour" /> */}
            <p className="mb-4">
              CHORUS brings together shared resources to create a secure and
              robust environment where you can analyze data, use specialized
              software, and access computing power for your research.
            </p>
            <p className="mb-4">
              Start by hitting{' '}
              <span className="font-bold">Getting Started</span>{' '}
            </p>
            {/* <p className="mb-4">CHORUS is your gateway to collaborative medical research and AI-driven innovation.</p> */}
            {/* <p className="mb-4">CHORUS is open source and free to use, but resources are limited.</p> */}
            {/* <p className="mb-4">Whether you’re analyzing sensitive health data, developing and testing AI tools, or sharing insights with the research community, CHORUS provides a secure, scalable, and user-friendly environment to support your work.</p> */}
          </div>
        ),
        selector: '#getting-started-step1',
        side: 'left',
        showControls: true,
        showSkip: true,
        pointerPadding: 0,
        pointerRadius: 0
      }
      // {
      //   title: "HOME Workspace",
      //   content: <div className="min-w-[480px]">
      //     <p className="mb-4">Your Home Workspace is the starting point for your CHORUS experience. It acts as a personal dashboard where you can manage your work, access datasets, and monitor your resources.</p>
      //     <p className="mb-4">Designed for efficiency and organization, it provides an overview of your active desktops, running applications, and available datasets.</p>
      //   </div>,
      //   selector: "#getting-started-step-home",
      //   icon: "🏠",
      //   showControls: true,
      //   side: "bottom",
      // },
      // {
      //   title: "DESKTOPS",
      //   content: <div className="min-w-[480px]">
      //     <p className="mb-4">Desktops in CHORUS provide a secure computing environment where you can run applications, analyze data, and collaborate with others.</p>
      //     <p className="mb-4">You can launch a desktop in your Home Workspace or within a project workspace you are involved in.</p>
      //     <p className="mb-4">With flexible and scalable resources, desktops can be customized to meet your project’s specific needs. You can also open multiple instances simultaneously, enabling you to manage different research tasks in parallel.</p>
      //   </div>,
      //   selector: "#getting-started-step2",
      //   nextRoute: "/workspaces",
      //   prevRoute: "/",
      //   icon: "🔍",
      //   showControls: true,
      //   side: "right",
      // },

      // {
      //   title: "WORKSPACES",
      //   content: <div className="min-w-[480px]">
      //     <p className="mb-4">Workspaces in CHORUS serve as secure sandboxes for managing research projects. Each workspace has specific security and privacy settings based on its governance policies, ensuring compliance with ethical and legal requirements.</p>
      //     <p className="mb-4">Within a workspace, you can collaborate with team members, manage datasets, and access specialized research tools tailored to your project’s needs. Workspaces provide an organized and secure environment, making it easier to track progress, maintain compliance, and streamline research workflows.</p>
      //   </div>,
      //   selector: "#getting-started-step3",
      //   nextRoute: "/app-store",
      //   prevRoute: "/workspaces",
      //   icon: "🔍",
      //   showControls: true,
      //   side: "bottom",
      // },
      // {
      //   title: "Applications",
      //   content: <div className="min-w-[480px]">
      //     <p className="mb-4">CHORUS provides access to a wide range of research applications, including data management tools, statistical analysis software, and AI-based solutions. </p>
      //     <p className="mb-4">You can launch applications from your desktop or within a workspace.</p>
      //   </div>,
      //   selector: "#getting-started-step4",
      //   prevRoute: "/app-store",
      //   icon: "🔍",
      //   showControls: true,
      //   side: "bottom",
      // }
    ]
  }
]
