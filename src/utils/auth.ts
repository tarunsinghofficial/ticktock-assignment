// Authentication utility functions

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface AuthData {
    user: User;
    token: string;
}

// Get current user from session storage
export const getCurrentUser = (): User | null => {
    if (typeof window === 'undefined') return null;

    const userStr = sessionStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

// Get auth token from session storage
export const getAuthToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('authToken');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    return getAuthToken() !== null && getCurrentUser() !== null;
};

// Store authentication data
export const setAuthData = (authData: AuthData): void => {
    if (typeof window === 'undefined') return;

    sessionStorage.setItem('authToken', authData.token);
    sessionStorage.setItem('user', JSON.stringify(authData.user));
};

// Clear authentication data (logout)
export const clearAuthData = (): void => {
    if (typeof window === 'undefined') return;

    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
};

// Get auth headers for API requests
export const getAuthHeaders = (): HeadersInit => {
    const token = getAuthToken();
    return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
    };
}; 