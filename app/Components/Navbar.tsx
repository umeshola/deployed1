'use client';

import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UploadButton } from '../../utils/uploadthing';
import Signup from './Signup';
import { ADD_PHOTO, LOGIN } from '../../graphql/quries'; // Import ADD_PHOTO and LOGIN mutation

export default function Home() {
    const [showSignup, setShowSignup] = useState(false);
    const [showLogin, setShowLogin] = useState(false); // State to show/hide Login form
    const [token, setToken] = useState<string | null>(null);
    const [uploadedImage, setUploadedImage] = useState<{ title: string, url: string } | null>(null); // State to track uploaded image details
    const [name, setName] = useState(''); // State for login input
    const [error, setError] = useState('');
    console.log(uploadedImage)
    // Check localStorage for token on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    // Handle Logout
    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setShowSignup(false);
        setShowLogin(false);
    };

    // Use the ADD_PHOTO mutation
    const [addPhoto] = useMutation(ADD_PHOTO, {
        onCompleted: () => {
            alert('Photo added successfully!');
        },
        onError: (error) => {
            alert(`Error adding photo: ${error.message}`);
        },
    });

    // Use the LOGIN mutation
    const [login] = useMutation(LOGIN, {
        onCompleted: (data) => {
            const token = data.login; // Assuming your mutation returns the token directly
            localStorage.setItem('token', token); // Store the token in localStorage
            setToken(token); // Update the state with the token
            setShowLogin(false); // Hide login form after successful login
            setError('');
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    // Handle Login form submission
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '') {
            setError('Name is required');
            return;
        }
        try {
            await login({ variables: { name } });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex justify-between mx-28">
            <div>
                <h1 className="text-3xl">Uhhhg..</h1>
            </div>
            <main className="flex flex-col items-center justify-between">
                <UploadButton
                    endpoint="imageUploader"
                    onClientUploadComplete={(res) => {
                        if (res && res.length > 0) {
                            const uploadedFile = res[0]; // Get the first uploaded file
                            const title = uploadedFile.name; // Get the image name
                            const imageUrl = uploadedFile.url; // Get the image URL
                            setUploadedImage({ title, url: imageUrl }); // Set the uploaded image details

                            // Call the addPhoto mutation to store the image in the backend
                            addPhoto({
                                variables: {
                                    title,
                                    image: imageUrl,
                                },
                            });
                        }
                    }}
                    onUploadError={(error: Error) => {
                        alert(`ERROR! ${error.message}`);
                    }}
                />
            </main>

            <div className="flex space-x-4">
                {token ? (
                    <h1 className="text-red-500 text-xl cursor-pointer" onClick={handleLogout}>
                        Logout
                    </h1>
                ) : (
                    <>
                        {/* Show Login Button */}
                        <h1
                            className="text-blue-500 text-xl cursor-pointer"
                            onClick={() => setShowLogin(!showLogin)}
                        >
                            Login
                        </h1>

                        {/* Show Signup Button */}
                        <h1
                            className="text-blue-500 text-xl cursor-pointer"
                            onClick={() => setShowSignup(!showSignup)}
                        >
                            SignUp
                        </h1>
                    </>
                )}
            </div>

            {/* Conditionally render the Login form */}
            {showLogin && !token && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-neutral-900 p-4 rounded-lg shadow-lg">
                        <form onSubmit={handleLogin} className="space-y-4">
                            <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-3 py-2 border bg-neutral-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            {error && (
                                <div className="text-red-500">
                                    {error}
                                </div>
                            )}
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            >
                                Login
                            </button>
                        </form>
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => setShowLogin(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            {/* Conditionally render the Signup component */}
            {showSignup && !token && (
                <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50">
                    <div className="bg-neutral-900 p-4 rounded-lg shadow-lg">
                        <Signup />
                        <button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => setShowSignup(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
