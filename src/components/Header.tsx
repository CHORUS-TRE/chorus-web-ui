import {  useState } from "react"
import { useAuth } from './AuthContext'
import { HiCollection, HiLogout, HiLogin } from "react-icons/hi"
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
                     p-2 rounded-xl shadow-sm bg-slate-900 bg-opacity-50 backdrop-blur-sm border-slate-700 border-solid border">
                <div className="w-full mx-auto items-center flex justify-between flex-wrap">
                    <a
                        className="text-white text-md uppercase hidden lg:inline-block"
                        href="/"
                    >
                        Horus
                    </a>
                    <div className="flex items-center justify-between lg:flex-grow-0">
                        <div className="flex items-center justify-between gap-x-8">
                            {/* <a
                                className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                                href="/"
                                onClick={e => e.preventDefault()}
                            >
                                <>
                                    <HiUserCircle className="w-6 h-6 mr-2" />
                                    <span className="text-sm">User</span>
                                </>
                            </a> */}

                            {isLoggedIn && <a
                                className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                                href="/dashboard"
                            >
                                <div className="flex items-center">
                                    <HiCollection className="w-6 h-6 mr-2" />
                                    <span className="text-sm">Dashboard</span>
                                </div>
                            </a>
                            }

                            {isLoggedIn &&
                                <a
                                    className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                                    href="/authenticate"
                                    onClick={handleLogout}
                                >

                                    <div className="flex items-center">
                                        <HiLogout className="w-6 h-6 mr-2" />
                                        <span className="text-sm">Logout</span>
                                    </div>
                                </a>
                            }

                            {!isLoggedIn &&
                                <a className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                                    href="/authenticate"
                                    onClick={handleLogin}
                                >
                                    <div className="flex items-center">
                                        <HiLogin className="w-6 h-6 mr-2" />
                                        <span className="text-sm">Login</span>
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
