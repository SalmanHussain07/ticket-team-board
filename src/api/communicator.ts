
const BASE_URL = "https://localhost:7111";

export interface ApiResponse<T = null> {
    isError: boolean,
    message: string,
    code: string,
    data?: T;
}

export class HttpClient {
    // private static antiforgeryToken: string | null = null;

    // private static async fetchAntiforgeryToken() {
    //     if (!this.antiforgeryToken) {
    //         const response = await fetch('/api/v1/Authentication/get-token', { method: 'GET' });
    //         const tokenData = await response.json();
    //         this.antiforgeryToken = tokenData.token;
    //     }
    // }

    private static async getHeaders() {
        // await this.fetchAntiforgeryToken();

        const token = localStorage.getItem('token');
        const username = localStorage.getItem('user');

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Username': username || ''
            // 'X-CSRF-TOKEN': this.antiforgeryToken || ''
        };
    }

    static async GET<T>(url: string): Promise<ApiResponse<T>> {
        try {
            // console.log(this.getHeaders());
            const response = await fetch(BASE_URL + url, {
                method: 'GET',
                headers: await this.getHeaders(),
            });

            if (!response.ok) {
                return {
                    isError: true,
                    message: response.statusText,
                    code: response.status.toString(),
                    data: undefined
                };
            }

            const data = (await response.json()) as T;
            return {
                isError: false,
                message: 'Success',
                code: response.status.toString(),
                data: data,  
            };
        } catch (error) {
            return {
                isError: true,
                message: error instanceof Error ? error.message : 'Unknown error',
                code: error instanceof Response ? error.status.toString() : '0',
                data: undefined
            };
        }
    }

    static async POST<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(BASE_URL + url, {
                method: 'POST',
                headers: await this.getHeaders(),
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                return {
                    isError: true,
                    message: response.statusText,
                    code: response.status.toString(),
                    data: undefined
                };
            }

            const data = (await response.json()) as T;
            return {
                isError: false,
                message: 'Success',
                code: response.status.toString(),
                data: data,
            };
        } catch (error) {
            return {
                isError: true,
                message: error instanceof Error ? error.message : 'Unknown error',
                code: error instanceof Response ? error.status.toString() : '0',
                data: undefined
            };
        }
    }


    static async Put<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(BASE_URL + url, {
                method: 'Put',
                headers: await this.getHeaders(),
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                return {
                    isError: true,
                    message: response.statusText,
                    code: response.status.toString(),
                    data: undefined
                };
            }

            const data = (await response.json()) as T;
            return {
                isError: false,
                message: 'Success',
                code: response.status.toString(),
                data: data,
            };
        } catch (error) {
            return {
                isError: true,
                message: error instanceof Error ? error.message : 'Unknown error',
                code: error instanceof Response ? error.status.toString() : '0',
                data: undefined
            };
        }
    }

    static async PATCH<T>(url: string, body: unknown): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(BASE_URL + url, {
                method: 'PATCH',
                headers: await this.getHeaders(),
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                return {
                    isError: true,
                    message: response.statusText,
                    code: response.status.toString(),
                    data: undefined
                };
            }

            const data = (await response.json()) as T;
            return {
                isError: false,
                message: 'Success',
                code: response.status.toString(),
                data: data,
            };
        } catch (error) {
            return {
                isError: true,
                message: error instanceof Error ? error.message : 'Unknown error',
                code: error instanceof Response ? error.status.toString() : '0',
                data: undefined
            };
        }
    }

    static async DELETE<T>(url: string): Promise<ApiResponse<T>> {
        try {
            const response = await fetch(BASE_URL + url, {
                method: 'DELETE',
                headers: await this.getHeaders(),
            });

            if (!response.ok) {
                return {
                    isError: true,
                    message: response.statusText,
                    code: response.status.toString(),
                    data: undefined
                };
            }

            const data = (await response.json()) as T;
            return {
                isError: false,
                message: 'Success',
                code: response.status.toString(),
                data: data,
            };
        }
        catch (error) {
            return {
                isError: true,
                message: error instanceof Error ? error.message : 'Unknown error',
                code: error instanceof Response ? error.status.toString() : '0',
                data: undefined
            };
        }
    }
}
