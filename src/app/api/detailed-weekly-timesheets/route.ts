import { NextRequest, NextResponse } from 'next/server';
import { users, weeks, projects, User, Week, Timesheet, TimesheetEntry } from '../_mockData';

const detailedTimesheets: Timesheet[] = [];
users.forEach((user: User) => {
    weeks.forEach((week: Week) => {
        const entries: TimesheetEntry[] = week.days.slice(0, Math.floor(Math.random() * 4) + 1).map((d, idx) => ({
            day: d.day,
            date: d.date,
            project: projects[(user.id + idx) % projects.length],
            hours: 6 + ((user.id + idx) % 3),
            task: `Work on ${projects[(user.id + idx) % projects.length]}`,
            type: 'Feature',
        }));
        detailedTimesheets.push({
            id: user.id * 10 + week.weekNumber,
            weekNumber: week.weekNumber,
            date: week.date,
            status: 'approved',
            userId: user.id,
            userName: user.name,
            totalHours: entries.reduce((sum, e) => sum + e.hours, 0),
            entries,
        });
    });
});

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const timesheetId = searchParams.get('timesheetId');
    const userId = searchParams.get('userId');

    let filtered = detailedTimesheets;
    if (timesheetId) {
        filtered = filtered.filter((ts: Timesheet) => ts.id === parseInt(timesheetId));
    }
    if (userId) {
        filtered = filtered.filter((ts: Timesheet) => ts.userId === parseInt(userId));
    }
    return NextResponse.json({
        success: true,
        data: filtered,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, weekNumber, date, status, entries } = body;
        const totalHours = entries ? entries.reduce((sum: number, entry: TimesheetEntry) => sum + entry.hours, 0) : 0;
        const newTimesheet: Timesheet = {
            id: detailedTimesheets.length + 1,
            weekNumber,
            date,
            status: status || 'draft',
            userId: parseInt(userId),
            userName: users.find((u: User) => u.id === parseInt(userId))?.name || 'Unknown',
            totalHours,
            entries: entries || [],
        };
        detailedTimesheets.push(newTimesheet);
        return NextResponse.json({
            success: true,
            data: newTimesheet,
        }, { status: 201 });
    } catch {
        return NextResponse.json(
            { success: false, message: 'Failed to create detailed timesheet' },
            { status: 500 }
        );
    }
} 