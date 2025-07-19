import { NextRequest, NextResponse } from 'next/server';
import { users } from '../_mockData';

export async function GET() {
    return NextResponse.json({
        success: true,
        data: users,
    });
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;
        // Password is always 'password123' for demo
        const user = users.find((u: any) => u.email === email);
        if (user && password === 'password123') {
            return NextResponse.json({
                success: true,
                data: { user, token: 'mock-token' },
            });
        }
        return NextResponse.json(
            { success: false, message: 'Invalid credentials' },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { success: false, message: 'Login failed' },
            { status: 500 }
        );
    }
} 