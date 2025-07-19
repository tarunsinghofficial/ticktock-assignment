"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Ellipsis } from "lucide-react";
import Footer from "@/app/components/Footer";

const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

function groupByDay(entries: TimesheetEntry[]): { [key: string]: TimesheetEntry[] } {
    const grouped: { [key: string]: TimesheetEntry[] } = {};
    entries.forEach((entry) => {
        if (!grouped[entry.day]) grouped[entry.day] = [];
        grouped[entry.day].push(entry);
    });
    return grouped;
}

// Add type for timesheet entry and data
interface TimesheetEntry {
    day: string;
    project: string;
    task: string;
    hours: number;
    type: string;
    date?: string;
}
interface TimesheetData {
    entries: TimesheetEntry[];
    totalHours: number;
    weekStartDate?: string;
    weekEndDate?: string;
    [key: string]: any;
}

export default function TimesheetDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [data, setData] = useState<TimesheetData | null>(null);
    const [loading, setLoading] = useState(true);
    // Use a unique key for menuOpenIdx: `${day}-${i}`
    const [menuOpenIdx, setMenuOpenIdx] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [showAddModal, setShowAddModal] = useState<{ open: boolean; day: string | null }>({ open: false, day: null });
    const [newTask, setNewTask] = useState({
        project: "",
        type: "",
        description: "",
        hours: 1,
    });
    // For demo, simple project/type options
    const projectOptions = ["Project Name", "Website Redesign", "API Development"];
    const typeOptions = ["Bug fixes", "Feature", "Meeting", "Code Review"];

    // Close menu on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpenIdx(null);
            }
        }
        if (menuOpenIdx !== null) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpenIdx]);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetch(`/api/detailed-weekly-timesheets?timesheetId=${id}`)
            .then((res) => res.json())
            .then((res) => {
                setData(res.data && res.data[0] ? res.data[0] : null);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [id]);

    // Add new task to entries
    const handleAddTask = () => {
        if (!newTask.project || !newTask.type || !newTask.description || !newTask.hours) {
            alert("Please fill in all required fields.");
            return;
        }
        if (!showAddModal.day || !data) return;
        const entry = {
            day: showAddModal.day,
            project: newTask.project,
            task: newTask.description,
            hours: newTask.hours,
            type: newTask.type,
            date: data.entries.find((e: any) => e.day === showAddModal.day)?.date || "",
        };
        // Add to data.entries
        setData((prev: any) => ({
            ...prev,
            entries: [...(prev.entries || []), entry],
            totalHours: (prev.totalHours || 0) + newTask.hours,
        }));
        setShowAddModal({ open: false, day: null });
        setNewTask({ project: "", type: "", description: "", hours: 1 });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }
    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg text-gray-400">Timesheet not found.</div>
            </div>
        );
    }

    // Group entries by day
    const grouped = groupByDay(data.entries || []);
    // Get all days in week (from entries or fallback to Mon-Fri)
    const allDays = Array.from(
        new Set([
            ...dayOrder.filter((d) => Object.keys(grouped).includes(d)),
            ...Object.keys(grouped),
        ])
    ).filter((d) => d);

    // Calculate progress
    const total = data.totalHours || 0;
    const max = 40;
    const percent = Math.min(100, Math.round((total / max) * 100));

    const handleTaskOptions = (key: string) => {
        setMenuOpenIdx(key === menuOpenIdx ? null : key);
    };
    const handleEdit = (entry: any) => {
        // Implement edit logic here
        setMenuOpenIdx(null);
        alert("Edit clicked for " + (entry.task || entry.project));
    };
    const handleDelete = (entry: any) => {
        // Implement delete logic here
        setMenuOpenIdx(null);
        alert("Delete clicked for " + (entry.task || entry.project));
    };

    return (
        <div className="min-h-screen bg-[#f8f8f8] py-8">
            {/* Add Task Modal */}
            {showAddModal.open && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <div>
                            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" onClick={() => setShowAddModal({ open: false, day: null })}>&times;</button>
                            <h2 className="text-lg font-bold mb-4">Add New Entry</h2>
                        </div>
                        <div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Select Project *</label>
                                <select
                                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm"
                                    value={newTask.project}
                                    onChange={e => setNewTask(t => ({ ...t, project: e.target.value }))}
                                >
                                    <option value="">Project Name</option>
                                    {projectOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Type of Work *</label>
                                <select
                                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm"
                                    value={newTask.type}
                                    onChange={e => setNewTask(t => ({ ...t, type: e.target.value }))}
                                >
                                    <option value="">Type of Work</option>
                                    {typeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="block text-sm font-medium mb-1">Task description *</label>
                                <textarea
                                    className="w-full border border-[#e5e7eb] rounded px-3 py-2 text-sm min-h-[80px]"
                                    placeholder="Write text here ..."
                                    value={newTask.description}
                                    onChange={e => setNewTask(t => ({ ...t, description: e.target.value }))}
                                />
                                <div className="text-xs text-gray-400 mt-1">A note for extra info</div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Hours *</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        className="w-8 h-8 border rounded text-lg"
                                        onClick={() => setNewTask(t => ({ ...t, hours: Math.max(1, t.hours - 1) }))}
                                        type="button"
                                    >-</button>
                                    <input
                                        type="number"
                                        className="w-16 border rounded text-center py-1"
                                        value={newTask.hours}
                                        min={1}
                                        onChange={e => setNewTask(t => ({ ...t, hours: Math.max(1, Number(e.target.value)) }))}
                                    />
                                    <button
                                        className="w-8 h-8 border rounded text-lg"
                                        onClick={() => setNewTask(t => ({ ...t, hours: t.hours + 1 }))}
                                        type="button"
                                    >+</button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 mt-6">
                            <button
                                className="flex-1 bg-blue-600 text-white rounded-lg px-2.5 py-1.5 font-semibold hover:bg-blue-700"
                                onClick={handleAddTask}
                                type="button"

                            >Add entry</button>
                            <button
                                className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold  hover:bg-gray-100"
                                onClick={() => setShowAddModal({ open: false, day: null })}
                                type="button"
                            >Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="container mx-auto">
                <div className="bg-white rounded-md shadow p-6 mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold">This week's timesheet</h2>
                        <div className="flex flex-col items-end">
                            <div className="flex flex-col gap-1 mt-1">
                                {/* Remove tooltip wrapper */}
                                <span className="text-xs text-center text-gray-900">{total}/40 hrs</span>
                                <span className="text-xs text-right text-gray-400">{percent}%</span>
                                <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden relative">
                                    <div
                                        className="h-2 bg-orange-400 rounded-full"
                                        style={{ width: percent + "%" }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="my-4">
                        <h2 className="text-sm text-gray-500">{data.date}</h2>
                    </div>

                    <div className="space-y-2">
                        {allDays.map((day) => (
                            <div key={day} className="py-2 grid grid-cols-8 space-x-2">
                                <div className="font-semibold text-gray-900 mb-2 text-md">{day.slice(0, 3)}</div>
                                <div className="space-y-2 col-span-7">
                                    {(grouped[day] || []).map((entry: any, i: number) => {
                                        const entryKey = `${day}-${i}`;
                                        return (
                                            <div key={i} className="flex items-center bg-white border border-[#e5e7eb] rounded-md px-4 py-1.5 relative">
                                                <div className="flex-1 text-gray-900 font-semibold text-sm">{entry.task || entry.project || 'Task'}</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="text-gray-500 text-xs w-12 text-right">{entry.hours} hrs</div>
                                                    <div>
                                                        <span className="text-blue-600 bg-blue-100 text-xs px-1 py-1 rounded font-medium">{entry.project || 'Project Name'}</span>
                                                    </div>
                                                    <button type="button" onClick={() => handleTaskOptions(entryKey)} className="text-gray-400 hover:text-gray-600 relative z-20"><Ellipsis className="text-gray-400" size={14} /></button>
                                                    {/* Popover menu */}
                                                    {menuOpenIdx === entryKey && (
                                                        <div ref={menuRef} className="absolute right-0 top-8 z-30 bg-white border border-gray-200 rounded shadow-md w-28 py-1 flex flex-col text-sm">
                                                            <button onClick={() => handleEdit(entry)} className="px-4 py-2 text-left hover:bg-gray-100">Edit</button>
                                                            <button onClick={() => handleDelete(entry)} className="px-4 py-2 text-left hover:bg-gray-100 text-red-500">Delete</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <button
                                        className="w-full border-2 border-dashed border-[#e5e7eb] hover:border-blue-600 rounded-md py-2 text-gray-500 hover:text-blue-600 text-sm font-medium hover:bg-blue-50 mt-1"
                                        onClick={() => setShowAddModal({ open: true, day })}
                                        type="button"
                                    >
                                        + Add new task
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
} 