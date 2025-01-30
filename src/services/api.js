import axios from "axios";

// Axios instance
const api = axios.create({
    // Where React communicates with Spring Boot
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // allows session-based cookies
});

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            // Store user data in localStorage or state management
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            // Transform the error into a user-friendly format
            if (error.response) {
                throw error.response.data;
            }
            throw { message: 'Network error occurred' };
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post('/register', userData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw error.response.data;
            }
            throw { message: 'Network error occurred' };
        }
    }
};

const transService = {
    add: async(transaction) => {
        try {
            const response = await api.post('/transaction/add', transaction);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw error.response.data;
            }
            throw { message: 'Network error occurred'}
        }
    },

}

export default {
    authService,
    transService
};