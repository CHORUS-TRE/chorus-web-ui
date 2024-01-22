import Head from 'next/head';
import Header from '../components/Header';
export default function About() {
    return (
        <div className=' bg-gradient-to-b from-[#2e026d] to-[#15162c] '>
            <Head>
                <title>About Us | My T3 App</title>
                <meta name="description" content="About us page" />
            </Head>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center  text-white">
                <h1 className="text-4xl font-bold">About Us</h1>
                <p className="mt-4 text-center">
                    This is the about page of our T3 App. Here you can find information about our team and mission.
                </p>
            </main>
        </div>
    );
}
