import Head from 'next/head'
import Header from '../components/Header'
import { ChangeEvent, useState } from 'react'
import { authenticateUser } from '../utils/authenticateUser'
import { useAuth } from '../components/AuthContext'
import Link from 'next/link'
import { useRouter } from 'next/router'

// The Authenticate component is used for handling the user authentication process.
export default function Authenticate() {
    const router = useRouter()
    // State for managing user input data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    // Using the useAuth hook to access the login function
    const { login } = useAuth()

    // State for storing the authentication token received from the server
    const [token, setToken] = useState<string>()

    // Function to handle the authentication process
    const authUser = async () => {
        const response = await authenticateUser(formData.email, formData.password)
        const newToken = response ? (response.result ? response.result.token : '') : ''
        setToken(newToken === '' ? 'NULL' : newToken)
        if (newToken && newToken !== 'NULL') {
            login(newToken)
            router.push('/dashboard')
        }
    }

    // Function to handle changes in the form inputs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }))
        setToken('')
    }

    return (
        <div className='bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
            <Head>
                <title>Authentication</title>
            </Head>
            <main className="flex min-h-screen flex-col items-center justify-center text-white">
                <div className="text-center">
                    <h2 className="mb-4 text-4xl font-extrabold">
                        Authentication
                    </h2>
                </div>
                <form onSubmit={authUser} className='w-1/3 mt-8 pb-6'>
                    {/* Form fields for email and password */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2">Password:</label>
                        <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>
                </form>
                {/* Button to submit the form */}
                <button onClick={authUser}
                    className="rounded-lg bg-white bg-opacity-20 py-2 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer"
                >
                    Log in
                </button>
                {/* Link to registration page */}
                <Link href="/user" passHref className='mt-4'>
                    <span className="underline">Or create an account here</span>
                </Link>
                {/* Display login status messages */}
                <p className="mt-4">{token && token !== 'NULL' && 'Welcome back!'}</p>
                <p className="mt-4">{token === 'NULL' && 'Your credentials are not correct'}</p>
            </main>
        </div>
    )
}
