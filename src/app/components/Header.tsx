'use client'

import { clearAuthData, getCurrentUser, isAuthenticated } from '@/utils/auth'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const Header = () => {
    const router = useRouter()

    type User = { id: number; name: string; email: string } | null;
    const [user, setUser] = useState<User>(null);

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            router.push('/login')
            return
        }
        // Get current user data
        const currentUser = getCurrentUser()
        setUser(currentUser)
    }, [router])

    const handleLogout = () => {
        clearAuthData()
        router.push('/login')
    }
    return (
        <header className="bg-white shadow-sm" >
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-10 justify-center">
                        <h1 className="text-2xl font-bold text-black">ticktock</h1>
                        <Link href="/dashboard" className="text-md font-semibold text-gray-900">Timesheets</Link>
                    </div>
                    <div className="flex items-center space-x-1 hover:cursor-pointer" onClick={handleLogout}>
                        {user && <span className="flex items-center gap-1 text-sm text-gray-500">
                            {user?.name}
                            <ChevronDown className='text-gray-500' size={18} />
                        </span>}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header