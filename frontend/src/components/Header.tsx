import Link from "next/link";

export default function Header() {
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
                    </div>
                </nav>

            </header>
        </>

    )
};
