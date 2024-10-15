"use client"
import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { SINGUP } from "../graphql/quries";

export default function Home() {
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // Check localStorage for token on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
    }, []);

    const [signup] = useMutation(SINGUP, {
        onCompleted: (data) => {
            const token = data.signup;  // Assuming your mutation returns the token directly
            // Store the token in localStorage
            localStorage.setItem('token', token);
            setToken(token); // Update the state with the token
            setSuccess(true);
        },
        onError: (error) => {
            setError(error.message);
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() === '') {
            setError('Name is required');
            return;
        }

        try {
            await signup({ variables: { name } });
            setError('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setToken(null); // Clear the token from state
        setSuccess(false);
        setError('');
    };

    return (
        <div className="w-full mt-20 max-w-md mx-auto bg-neutral-600 shadow-md rounded-lg overflow-hidden">
            <div className="px-6 py-4">
                <h2 className="text-2xl font-bold text-center mb-4">
                    {token ? 'Welcome' : 'Sign Up'}
                </h2>
                {token ? (
                    <div className="text-center">
                        <div className="text-green-600 mb-4">You are logged in!</div>
                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <div className="text-red-500 flex items-center">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mr-2"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {error}
                            </div>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        >
                            Sign Up
                        </button>
                    </form>
                )}
            </div>
            <div className="px-6 py-4 bg-gray-50 text-sm text-center text-gray-500">
                By signing up, you agree to our Terms and Conditions.
            </div>
        </div>
    );
}
