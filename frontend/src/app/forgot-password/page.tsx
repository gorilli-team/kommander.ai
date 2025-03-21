"use client";
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Password reset requested for:', email);
    setIsSubmitted(true);
  };

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Reset your password</h2>
        <p className="text-center text-gray-600 mb-6">
          Input your registered email to reset your password
        </p>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your email"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="bg-green-50 p-4 rounded-md">
              <p className="text-green-800">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox.
              </p>
            </div>
            <button 
              onClick={() => setIsSubmitted(false)}
              className="text-blue-600 hover:text-blue-500"
            >
              Try a different email
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Remember your password? <Link href="/login" className="text-blue-600 hover:text-blue-500">Back to login</Link>
        </p>
      </div>
    </div>
  );
}