import axios from "axios";

const BASE_URL = "https://trueshift-backend-1.onrender.com";

export const api = axios.create({
  baseURL: BASE_URL,
});

// JWT Token Management
export const setAuthToken = (token: string) => {
  localStorage.setItem("jwt_token", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getAuthToken = () => {
  return localStorage.getItem("jwt_token");
};

export const clearAuthToken = () => {
  localStorage.removeItem("jwt_token");
  delete api.defaults.headers.common["Authorization"];
};

// Initialize token from localStorage
const token = getAuthToken();
if (token) {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

// Auth APIs
export const authAPI = {
  register: (data: { email: string; password: string; name: string }) =>
    api.post("/api/auth/register", data),
  
  verifyOtp: (email: string, otp: string) =>
    api.post("/api/auth/verify-otp", null, { params: { email, otp } }),
  
  login: (email: string, password: string) =>
    api.post("/api/auth/login", null, { params: { email, password } }),
};

// Company APIs
export const companyAPI = {
  register: (data: { email: string; name: string }) =>
    api.post("/api/company/register", data),
  
  getByTrustCode: (code: string) =>
    api.get(`/api/company/trust/${code}`),
  
  getAll: () =>
    api.get("/api/company/all"),
};

// Employee APIs
export const employeeAPI = {
  create: (data: any) =>
    api.post("/api/employees", data),
  
  getById: (id: number) =>
    api.get(`/api/employees/${id}`),
  
  getByTrustCode: (trustCode: string) =>
    api.get(`/api/employees/trust/${trustCode}`),
};

// Verification APIs
export const verificationAPI = {
  submitRequest: (data: any) =>
    api.post("/api/verify/request", data),
  
  getById: (id: number) =>
    api.get(`/api/verify/${id}`),
  
  getAll: () =>
    api.get("/api/verify/all"),
};
