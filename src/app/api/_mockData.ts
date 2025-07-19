// src/app/api/_mockData.ts

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Week {
    weekNumber: number;
    date: string;
    days: { day: string; date: string }[];
}

export interface TimesheetEntry {
    day: string;
    date: string;
    project: string;
    hours: number;
    task: string;
    type: string;
}

export interface Timesheet {
    id: number;
    weekNumber: number;
    date: string;
    status: string;
    userId: number;
    userName: string;
    totalHours?: number;
    entries?: TimesheetEntry[];
}

export const users: User[] = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com' },
    { id: 3, name: 'Charlie Lee', email: 'charlie@example.com' },
    { id: 4, name: 'Diana Patel', email: 'diana@example.com' },
    { id: 5, name: 'Evan Kim', email: 'evan@example.com' },
];

export const weeks: Week[] = [
    {
        weekNumber: 1, date: '2024-01-01 to 2024-01-04', days: [
            { day: 'Monday', date: '2024-01-01' },
            { day: 'Tuesday', date: '2024-01-02' },
            { day: 'Wednesday', date: '2024-01-03' },
            { day: 'Thursday', date: '2024-01-04' },
        ]
    },
    {
        weekNumber: 2, date: '2024-01-08 to 2024-01-11', days: [
            { day: 'Monday', date: '2024-01-08' },
            { day: 'Tuesday', date: '2024-01-09' },
            { day: 'Wednesday', date: '2024-01-10' },
            { day: 'Thursday', date: '2024-01-11' },
        ]
    },
    {
        weekNumber: 3, date: '2024-01-15 to 2024-01-18', days: [
            { day: 'Monday', date: '2024-01-15' },
            { day: 'Tuesday', date: '2024-01-16' },
            { day: 'Wednesday', date: '2024-01-17' },
            { day: 'Thursday', date: '2024-01-18' },
        ]
    },
    {
        weekNumber: 4, date: '2024-01-22 to 2024-01-25', days: [
            { day: 'Monday', date: '2024-01-22' },
            { day: 'Tuesday', date: '2024-01-23' },
            { day: 'Wednesday', date: '2024-01-24' },
            { day: 'Thursday', date: '2024-01-25' },
        ]
    },
    {
        weekNumber: 5, date: '2024-01-29 to 2024-02-01', days: [
            { day: 'Monday', date: '2024-01-29' },
            { day: 'Tuesday', date: '2024-01-30' },
            { day: 'Wednesday', date: '2024-01-31' },
            { day: 'Thursday', date: '2024-02-01' },
        ]
    },
];

export const projects: string[] = [
    'Project A',
    'Project B',
    'Project C',
    'Project D',
]; 