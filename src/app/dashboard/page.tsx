'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCurrentUser, isAuthenticated } from '@/utils/auth'
import Footer from '../components/Footer'

const STATUS_STYLES: Record<string, string> = {
    COMPLETED: 'bg-green-100 text-green-700',
    INCOMPLETE: 'bg-yellow-100 text-yellow-800',
    MISSING: 'bg-pink-100 text-pink-700',
}

const STATUS_LABELS: Record<string, string> = {
    COMPLETED: 'COMPLETED',
    INCOMPLETE: 'INCOMPLETE',
    MISSING: 'MISSING',
}

const Dashboard = () => {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [timesheets, setTimesheets] = useState<any[]>([])
    const [loadingTimesheets, setLoadingTimesheets] = useState(true)

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            router.push('/login')
            return
        }
        // Get current user data
        const currentUser = getCurrentUser()
        setUser(currentUser)
        setIsLoading(false)
    }, [router])

    useEffect(() => {
        const fetchTimesheets = async () => {
            if (!user) return
            setLoadingTimesheets(true)
            try {
                const res = await fetch(`/api/weekly-timesheets?userId=${user.id}`)
                const data = await res.json()
                // Map statuses to match UI
                const mapped = (data.data || []).map((ts: any, idx: number) => {
                    let status = 'COMPLETED'
                    if (ts.status?.toLowerCase() === 'pending') status = 'INCOMPLETE'
                    if (ts.status?.toLowerCase() === 'submitted') status = 'INCOMPLETE'
                    if (ts.status?.toLowerCase() === 'missing') status = 'MISSING'
                    return { ...ts, status }
                })
                setTimesheets(mapped)
            } catch {
                setTimesheets([])
            } finally {
                setLoadingTimesheets(false)
            }
        }
        if (user) fetchTimesheets()
    }, [user])

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f8f8f8]">
            <main className="container mx-auto py-8">
                <div className="bg-white rounded-md shadow p-6">
                    <h2 className="text-xl font-bold mb-6">Your Timesheets</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm border-separate border-spacing-0 rounded-lg overflow-hidden shadow-md">
                            <thead>
                                <tr className="text-gray-500 text-xs uppercase bg-[#f9fafb]">
                                    <th className="text-left px-4 py-4 border-b-1 border-[#e5e7eb]">Week #</th>
                                    <th className="text-left px-4 py-4 border-b-1 border-[#e5e7eb]">Date</th>
                                    <th className="text-left px-4 py-4 border-b-1 border-[#e5e7eb]">Status</th>
                                    <th className="text-center px-4 py-4 border-b-1 border-[#e5e7eb]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingTimesheets ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 bg-white">Loading...</td>
                                    </tr>
                                ) : timesheets.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-400 bg-white">No timesheets found.</td>
                                    </tr>
                                ) : (
                                    timesheets.map((ts, idx) => (
                                        <tr key={ts.id}>
                                            <td className="px-4 py-4 font-medium text-gray-900 bg-[#f9fafb] border-b-1 border-[#e5e7eb]">
                                                {ts.weekNumber || idx + 1}
                                            </td>
                                            <td className="px-4 py-4 text-gray-500 bg-white border-b-1 border-[#e5e7eb]">{ts.date}</td>
                                            <td className="px-4 py-4 bg-white border-b-1 border-[#e5e7eb]">
                                                <span className={`px-2 py-1 rounded-md text-xs font-semibold ${STATUS_STYLES[ts.status] || 'bg-gray-100 text-gray-500'}`}>
                                                    {STATUS_LABELS[ts.status] || ts.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 bg-white border-b-1 border-[#e5e7eb] text-center">
                                                {ts.status === 'INCOMPLETE' ? (
                                                    <a href={`/dashboard/timesheet/${ts.id}`} className="text-blue-600 font-medium hover:underline">Update</a>
                                                ) : ts.status === 'MISSING' ? (
                                                    <a href="#" className="text-blue-600 font-medium hover:underline">Create</a>
                                                ) : (
                                                    <a href={`/dashboard/timesheet/${ts.id}`} className="text-blue-600 font-medium hover:underline">View</a>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Footer />
            </main>
        </div>
    )
}

export default Dashboard
