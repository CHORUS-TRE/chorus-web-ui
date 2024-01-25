import Link from "next/link";
import { useEffect, useState } from "react";

export default function Header() {
    const [visible, setVisible] = useState<boolean>(false);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', '');
            setVisible(true);
            setLoggedIn(false);
        }
    }

    // const checkIfLoggedIn = () => {
    //     if (typeof window !== 'undefined') {
    //         const storedToken = localStorage.getItem('token');
    //         if (storedToken && storedToken != '') {
    //             setLoggedIn(true);
    //         } else {
    //             setLoggedIn(false);
    //         }
    //         console.log(storedToken);
    //     }
    // }
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
                        <Link href="/authenticate" passHref>
                            <span className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">Log in</span>
                        </Link>
                        <button onClick={logout} className="px-3 py-1 hover:bg-white hover:bg-opacity-20 rounded cursor-pointer">Log out</button>
                        {/* {loggedIn ?
                            <p className="text-green-500">Logged in</p>
                            :
                            <p className="text-red-500">Logged out</p>} */}
                    </div>
                </nav>

            </header>
            <main>
                <div
                    className={`container mx-auto absolute inset-0 top-20 flex flex-col justify-between h-2/6 w-4/12 p-6 rounded-md
                    bg-[#D6D6D6] text-lg text-center text-black ${visible ? 'visible' : 'invisible'}`}
                >
                    <p>you are logged out</p>
                    <button onClick={closePopup} className="rounded-lg bg-[#898989] py-2 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer" >Close</button>
                </div>
            </main>
        </>

    )
};
