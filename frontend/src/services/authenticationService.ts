import { jwtDecode } from "jwt-decode";


const TOKEN_KEY = 'token';

export function getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
}

export function clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
}
export function isAuthenticated(): boolean {
    return Boolean(getToken());
}

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length > 5;
};

export const validatePassword = (pass: string): boolean => {
    return pass.length >= 10;
};

export function getUserInfo(): any {
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch (error) {
    return null;
    }
}

export function getMyId(): number | null {
    const user = getUserInfo();
    return user ? user.id : null;
}