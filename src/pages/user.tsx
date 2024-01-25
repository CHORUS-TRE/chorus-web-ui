import Head from "next/head";
import Header from "../components/Header";
import { ChangeEvent, useState } from "react";
import { createUser } from "api/createUser";

export default function User() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  //const [response, setResponse] = useState<TemplatebackendCreateUserReply>();
  const [response, setResponse] = useState<string>();

  const registerUser = async () => {
    const response = await createUser(formData.firstName,
      formData.lastName,
      formData.email,
      formData.password);
    const result = response ? (response.result ? response.result.id : '') : '';
    setResponse(result == '' ? 'NULL' : result);
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
    setResponse('');
  };

  return (
    <div className=' bg-gradient-to-b from-[#19126c] to-[#15162c] '>

      <Head>
        <title>User registration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <main className="flex min-h-screen flex-col items-center justify-center text-white">
        <div className="text-center">
          <h2 className="mb-4 text-4xl font-extrabold">
            User registration
          </h2>
        </div>

        <form onSubmit={registerUser} className='w-1/3 mt-8 pb-6'>
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-2">First Name:</label>
            <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="border rounded p-2 w-full text-black" />
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-2">Last name:</label>
            <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="border rounded p-2 w-full text-black" />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2">Email:</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="border rounded p-2 w-full text-black" />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2">Password:</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="border rounded p-2 w-full text-black" />
          </div>
        </form>
        <button onClick={registerUser}
          className="rounded-lg bg-white bg-opacity-20 py-2 px-6 text-lg font-medium hover:bg-opacity-30 cursor-pointer"
        >
          Register user
        </button>
        <p className="mt-4">{response && response != 'NULL' && 'Well done ! Your id is ' + response}</p>
        <p className="mt-4">{response == 'NULL' && 'This username is already taken'}</p>

      </main>
    </div>
  );
}
