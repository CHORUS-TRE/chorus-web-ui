import { useState } from "react"
import { useAuth } from './AuthContext'
import { HiCollection, HiLogout, HiLogin, HiExclamation } from "react-icons/hi"
import { useRouter } from "next/router"

export default function Header() {
    const router = useRouter()
    const [visible, setVisible] = useState<boolean>(false)
    const { isLoggedIn, logout } = useAuth()
    const handleLogin = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        router.push('/authenticate')
    }

    const handleLogout = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault()
        logout() // Perform logout
        setVisible(true) // Show logout notification
    }

    const closePopup = () => {
        setVisible(false) // Hide logout notification
    }

    return (
        <header className="text-white h-12">
            <nav className="container mx-auto w-full bg-transparent flex items-center
                     p-3 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                <div className="w-full mx-auto items-center flex justify-between flex-wrap ">
                    <a
                        className="text-white text-md  font-semibold uppercase hidden lg:inline-block hover:text-gray-300"
                        href="/"
                        onClick={e => { e.preventDefault(); router.push('/') }}
                    >
                        Horus
                    </a>
                    <div className="flex align-middle items-center gap-2 text-orange-500">
                    <HiExclamation /><p className="text-[12px] ">Development Testbed, Horus v1</p> <HiExclamation /></div>
                    <div className="flex items-center justify-between lg:flex-grow-0">
                        <div className="flex items-center justify-between gap-x-8">
                            {/* <a
                                className="text-white text-sm uppercase hidden lg:inline-block font-semibold hover:text-gray-300"
                                href="/"
                                onClick={e => e.preventDefault()}
                            >
                                <>
                                    <span className="text-sm">User</span>
                                    <HiUserCircle className="w-6 h-6 ml-2" />
                                </>
                            </a> */}

                            <a
                                className="text-white text-sm uppercase hidden lg:inline-block font-semibold hover:text-gray-300"
                                href="/dashboard"
                                onClick={e => { e.preventDefault(); router.push('/dashboard') }}
                            >
                                <div className="flex items-center">
                                    <span className="text-sm">Dashboard</span>
                                    <HiCollection className="w-6 h-6 ml-2" />
                                </div>
                            </a>

                            {isLoggedIn &&
                                <a
                                    className="text-white text-sm uppercase hidden lg:inline-block font-semibold hover:text-gray-300"
                                    href="/authenticate"
                                    onClick={handleLogout}
                                >

                                    <div className="flex items-center">
                                        <span className="text-sm">Logout</span>
                                        <HiLogout className="w-6 h-6 ml-2" />
                                    </div>
                                </a>
                            }

                            {!isLoggedIn &&
                                <a className="text-white text-sm uppercase hidden lg:inline-block font-semibold hover:text-gray-300"
                                    href="/authenticate"
                                    onClick={handleLogin}
                                >
                                    <div className="flex items-center">
                                        <span className="text-sm">Login</span>
                                        <HiLogin className="w-6 h-6 ml-2" />
                                    </div>
                                </a>
                            }
                        </div>
                    </div>
                </div>
            </nav >
        </header >
    )
};
