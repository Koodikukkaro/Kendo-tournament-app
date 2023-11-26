import axios, {
  type AxiosRequestConfig,
  type AxiosError,
  type AxiosResponse
} from "axios";
import { type Tournament, type User } from "types/models";
import {
  type CreateTournamentRequest,
  type LoginRequest,
  type RegisterRequest
} from "types/requests";

const AUTH_API = "/api/auth";
const USER_API = "/api/user";
const TOURNAMENTS_API = "/api/tournaments";
// const MATCH_API = "/api/auth"

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 5000
});

axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  async (error: AxiosError) => {
    if (error.response !== undefined) {
      const { data, status } = error.response;
      switch (status) {
        case 400:
          console.error(data);
          break;

        case 401:
          console.error("unauthorised");
          break;

        case 404:
          console.error("/not-found");
          break;

        case 500:
          console.error("/server-error");
          break;
      }
    }
    return await Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>): T => response.data;

const request = {
  get: async <T>(url: string, requestConfig?: AxiosRequestConfig) => {
    const response = await axiosInstance.get<T>(url, requestConfig);
    return responseBody(response);
  },
  post: async <T>(url: string, body: unknown) => {
    const response = await axiosInstance.post<T>(url, body);
    return responseBody(response);
  }
};

/*
 * User endpoints
 */
const user = {
  details: async (id: string) => await request.get<User>(`${USER_API}/${id}`),
  register: async (body: RegisterRequest) =>
    await request.post(`${USER_API}/register`, body)
};

/*
 * Auth endpoints
 */
const auth = {
  login: async (body: LoginRequest) => {
    return await request.post<User>(`${AUTH_API}/login`, body);
  },
  logout: async () => {
    await request.post(`${AUTH_API}/logout`, {});
  },
  refresh: async () => {
    await request.post(`${AUTH_API}/refresh`, {});
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
    return await request.post<Tournament>(`${TOURNAMENTS_API}/create`, body);
  }
};

const api = {
  auth,
  user,
  tournaments
};

export default api;
