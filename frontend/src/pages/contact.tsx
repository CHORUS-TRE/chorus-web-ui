import Head from 'next/head';
import Link from 'next/link';
import Header from '../components/Header';
import React, { ChangeEvent, FormEvent, useState } from 'react';


export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);
    };


    return (
        <div className=' bg-gradient-to-b from-[#05514d] to-[#15162c] '>
            <Head>
                <title>Contact Us | My T3 App</title>
                <meta name="description" content="Contact us page" />
            </Head>
            <Header />
            <main className="flex min-h-screen flex-col items-center justify-center text-white">
                <h1 className="text-4xl font-bold">Contact Us</h1>
                {/* <p className="mt-4 text-center">
                    Have any questions? Reach out to us through our contact form.
                </p> */}
                <form onSubmit={handleSubmit} className='w-1/3 mt-8'>
                    <div className="mb-4">
                        <label htmlFor="name" className="block mb-2">Name:</label>
                        <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-2">Email:</label>
                        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="border rounded p-2 w-full text-black" />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block mb-2">Message:</label>
                        <textarea id="message" name="message" value={formData.message} onChange={handleChange} className="border rounded p-2 w-full text-black" rows={3}></textarea>
                    </div>
                    <button type="submit" className="bg-[#05514d] text-white px-4 py-2 rounded">Send</button>
                </form>
            </main>
        </div >
    );
}
