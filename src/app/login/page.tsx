'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { setAuthData } from '@/utils/auth'

const Login = () => {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Cllear error when user types
        if (error) setError('')
    }

    const onSignIn = async () => {
        setIsLoading(true)
        setError('')

        try {

            if (!formData.email || !formData.password) {
                setError('Please fill in all fields')
                return
            }

            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                })
            })

            const data = await res.json()

            if (data.success) {
                // store auth data
                setAuthData(data.data)
                router.push('/dashboard')
            } else {
                setError(data.message || 'Login failed')
            }
        } catch (error) {
            console.error('Login error:', error)
            setError('An error occurred during login')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSignIn()
    }

    return (
        <div className='grid grid-cols-2 w-full h-screen border border-gray-300'>
            <div className='bg-white flex flex-col justify-between w-full h-full'>
                <span></span>
                <form onSubmit={handleSubmit} className='flex flex-col items-start justify-center space-y-6 p-16'>
                    <h3 className="text-black font-bold text-2xl">Welcome back</h3>

                    {error && (
                        <div className='w-full p-3 bg-red-50 border border-red-200 rounded-lg'>
                            <p className='text-red-600 text-sm'>{error}</p>
                        </div>
                    )}

                    <div className='w-full space-y-2'>
                        <label htmlFor="email" className='text-black font-medium text-sm'>Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className='w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='name@example.com'
                            required
                        />
                    </div>

                    <div className='w-full space-y-2'>
                        <label htmlFor="password" className='text-black font-medium text-sm'>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className='w-full rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
                            placeholder='**********'
                            required
                        />
                    </div>

                    <div className='flex items-center space-x-2'>
                        <input
                            type="checkbox"
                            id="remember"
                            className='w-4 h-4 border border-gray-200 rounded focus:ring-2 focus:ring-gray-400'
                        />
                        <label htmlFor="remember" className='text-gray-500 text-sm'>Remember me</label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className='bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 px-5 py-3 rounded-lg w-full text-center text-white font-medium transition-colors'
                    >
                        {isLoading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className='text-center pb-8'>
                    <span className='text-gray-500 text-sm'>© 2024 tentwenty</span>
                </div>
            </div>

            <div className='bg-blue-600 flex flex-col items-start justify-center space-y-6 p-16'>
                <h2 className="text-white font-bold text-4xl">ticktock</h2>
                <p className='text-white text-base leading-relaxed'>
                    Introducing ticktock, our cutting-edge timesheet web application designed to revolutionize how you manage employee work hours. With ticktock, you can effortlessly track and monitor employee attendance and productivity from anywhere, anytime, using any internet-connected device.
                </p>
            </div>
        </div>
    )
}

export default Login