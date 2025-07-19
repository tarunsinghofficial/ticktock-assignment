import { NextRequest, NextResponse } from 'next/server';
import { users, weeks } from '../_mockData';

const statuses = ['approved', 'pending', 'submitted', 'approved', 'missing'];

let timesheets: any[] = [];
users.forEach((user: any) => {
    weeks.forEach((week: any, i: number) => {
        timesheets.push({
            id: user.id * 10 + week.weekNumber,
            weekNumber: week.weekNumber,
            date: week.date,
            status: statuses[i % statuses.length],
            userId: user.id,
            userName: user.name,
        });
    });
});

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    let filtered = timesheets;
    if (userId) {
        filtered = filtered.filter((ts: any) => ts.userId === parseInt(userId));
    }
    return NextResponse.json({
        success: true,
        data: filtered,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, weekNumber, date, status } = body;
        const newTimesheet = {
            id: timesheets.length + 1,
            weekNumber,
            date,
            status: status || 'draft',
            userId: parseInt(userId),
            userName: users.find((u: any) => u.id === parseInt(userId))?.name || 'Unknown',
        };
        timesheets.push(newTimesheet);
        return NextResponse.json({
            success: true,
            data: newTimesheet,
        }, { status: 201 });
    } catch {
        return NextResponse.json(
            { success: false, message: 'Failed to create timesheet' },
            { status: 500 }
        );
    }
} 