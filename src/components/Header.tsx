import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from './AuthContext';

export default function Header() {
    const [visible, setVisible] = useState<boolean>(false);
    const { isLoggedIn, logout } = useAuth();

    const handleLogout = () => {
        logout();
        setVisible(true);
    };

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         checkIfLoggedIn();
    //     }, 100);

    //     return () => clearInterval(interval);
    // }, []);

    const closePopup = () => {
        setVisible(false);
    }

    return (
        <>

            <header className="text-white ">
                <nav className="container mx-auto flex items-center justify-between py-4 px-6">
                    <div className="flex items-center">
                        <img src="/favicon.ico" alt="Icon" className="mr-5 h-6 w-6" />
                        <h1 className="text-2xl font-bold">My Frontend</h1>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/" passHref>
                            <span className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">Home</span>
                        </Link>
                        <Link href="/about" passHref>
                            <span className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">About</span>
                        </Link>
                        <Link href="/contact" passHref>
                            <span className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">Contact</span>
                        </Link>
                        <Link href="/user" passHref>
                            <span className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">Register</span>
                        </Link>

                        {isLoggedIn ?
                            <button onClick={logout} className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded underline cursor-pointer">Log out</button>
                            :
                            <Link href="/authenticate" passHref>
                                <span className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">Log in</span>
                            </Link>}
                    </div>
                </nav>

            </header>
            <main>
                <div
                    className={`container mx-auto absolute inset-0 top-20 flex flex-col justify-between h-2/6 w-4/12 p-6 rounded-md
                    bg-[#D6D6D6] bg-opacity-80 text-lg text-center text-black ${visible ? 'visible' : 'invisible'}`}
                >
                    <p>you are logged out</p>
                    <button onClick={closePopup} className="rounded-lg bg-white py-2 px-6 text-lg font-medium bg-opacity-50 hover:bg-opacity-100 cursor-pointer" >Close</button>
                </div>
            </main>
        </>

    )
};
