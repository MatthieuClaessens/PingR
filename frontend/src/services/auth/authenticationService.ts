
const TOKEN_KEY = 'token';

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
}

export function clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
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