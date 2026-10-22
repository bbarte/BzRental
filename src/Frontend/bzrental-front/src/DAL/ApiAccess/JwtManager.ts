export class JwtManager {
    private static readonly JWT_KEY = 'accessToken';

    public static setAccessToken(token: string): void {
        localStorage.setItem(this.JWT_KEY, token);
    }

    public static getAccessToken(): string | null {
        return localStorage.getItem(this.JWT_KEY);
    }

    public static removeAccessToken(): void {
        localStorage.removeItem(this.JWT_KEY);
    }
}