import Link from "next/link"
import { useEffect, useState } from "react"
import { useAuth } from './AuthContext'
import { HiUserCircle, HiCog, HiLogout, HiLogin } from "react-icons/hi"

export default function Header() {
    // State to control visibility of the logout notification
    const [visible, setVisible] = useState<boolean>(false)
    // Extract isLoggedIn and logout function from useAuth hook
    const { isLoggedIn, logout } = useAuth()

    // Handler for the logout process
    const handleLogout = () => {
        logout() // Perform logout
        setVisible(true) // Show logout notification
    }

    // Handler to close the logout notification
    const closePopup = () => {
        setVisible(false) // Hide logout notification
    }

    return (

        <header className="text-white ">
            <nav className="container mx-auto w-full bg-transparent flex items-center p-4 border">
                <div className="w-full mx-auto items-center flex justify-between flex-wrap">
                    <a
                        className="text-white text-md uppercase hidden lg:inline-block"
                        href="/"
                    >
                        Horus
                    </a>
                    <div className="flex items-center justify-between lg:flex-grow-0">
                        <div className="flex items-center justify-between gap-x-2">
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

                            <a
                                className="text-white text-sm uppercase hidden lg:inline-block font-semibold"
                                href="/authenticate"
                            >
                                {isLoggedIn &&
                                    <>
                                        <HiLogout className="w-6 h-6 mr-2" />
                                        <span className="text-sm">Logout</span>
                                    </>
                                }
                                {!isLoggedIn &&
                                    <>
                                        <HiLogin className="w-6 h-6 mr-2" />
                                        <span className="text-sm">Login</span>
                                    </>
                                }
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
};
