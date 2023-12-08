import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";
import type { Tournament, User } from "types/models";
import type {
  SignupForTournamentRequest,
  CreateTournamentRequest,
  LoginRequest,
  RegisterRequest,
  EditUserRequest
} from "types/requests";

export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const AUTH_API = "/api/auth";
export const USER_API = "/api/user";
export const TOURNAMENTS_API = "/api/tournaments";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000
});

// Create a separate instance for authentication requests to avoid
// infinite retry loop inside the axios instance interceptor.
export const axiosAuthInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 10000
});

const responseBody = <T>(response: AxiosResponse<T>): T => response.data;

const request = {
  get: async <T>(url: string, requestConfig?: AxiosRequestConfig) => {
    const response = await axiosInstance.get<T>(url, requestConfig);
    return responseBody(response);
  },

  delete: async <T>(url: string, requestConfig?: AxiosRequestConfig) => {
    const response = await axiosInstance.delete<T>(url, requestConfig);
    return responseBody(response);
  },

  post: async <T>(
    url: string,
    body: unknown,
    requestConfig?: AxiosRequestConfig
  ) => {
    const response = await axiosInstance.post<T>(url, body, requestConfig);
    return responseBody(response);
  },

  put: async <T>(
    url: string,
    body: unknown,
    requestConfig?: AxiosRequestConfig
  ) => {
    const response = await axiosInstance.put<T>(url, body, requestConfig);
    return responseBody(response);
  }
};

const user = {
  details: async (id: string) => await request.get<User>(`${USER_API}/${id}`),

  register: async (body: RegisterRequest) =>
    await request.post(`${USER_API}/register`, body),

  update: async (id: string, body: EditUserRequest) =>
    await request.put<User>(`${USER_API}/${id}`, body),

  delete: async (id: string) => await request.delete(`${USER_API}/${id}`)
};

const auth = {
  login: async (body: LoginRequest) => {
    return await request.post<{ userId: string }>(`${AUTH_API}/login`, body);
  },

  logout: async () => {
    await request.post(`${AUTH_API}/logout`, {});
  },

  refresh: async () => {
    await request.get(`${AUTH_API}/refresh`);
  },

  checkAuth: async () => {
    return await request.get<{ userId: string }>(`${AUTH_API}/check-auth`);
  }
};

const tournaments = {
  getAll: async (limit?: number) => {
    return await request.get<Tournament[]>(`${TOURNAMENTS_API}`, {
      params: limit
    });
  },

  createNew: async (body: CreateTournamentRequest) => {
    return await request.post<Tournament>(`${TOURNAMENTS_API}`, body);
  },

  signup: async (tournamentId: string, body: SignupForTournamentRequest) => {
    return await request.put(
      `${TOURNAMENTS_API}/${tournamentId}/sign-up`,
      body
    );
  }
};

const api = {
  auth,
  user,
  tournaments
};

export default api;
