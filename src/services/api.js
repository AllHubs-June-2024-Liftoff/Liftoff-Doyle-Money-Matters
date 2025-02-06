import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const authService = {
    login: async (credentials) => {
        try {
            const response = await api.post(`/login`, credentials);
            console.log("Login Response Data:", response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        } catch (error) {
            if (error.response) {
                throw error.response.data;
            }
            throw { message: 'Network error occurred' };
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post(`/register`, userData);
            return response.data;
        } catch (error) {
            if (error.response) {
                throw error.response.data;
            }
            throw { message: 'Network error occurred' };
        }
    }
};

const tagService = {
    getUserTags: async (userId) => {
        try {
            const response = await api.get(`/api/tags/user/${userId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error("API response error data:", error.response.data);
                console.error("API response error status", error.response.status);
                console.error("API response error headers", error.response.headers);
            } else if (error.request) {
                console.error("No response received", error.request);
            } else {
                console.error("Error setting up the request", error.message);
            }
            throw { message: 'Network error occurred' };
        }
    },

    createTag: async (tagData, userId) => {
        try {
            const response = await api.post('/api/tags/add', tagData, {
                params: { user_id: userId }
            });
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error("API response error data:", error.response.data);
                console.error("API response error status", error.response.status);
                console.error("API response error headers", error.response.headers);
            } else if(error.request) {
                console.error("No response received", error.request);
            } else {
                console.error("Error setting up the request", error.message);
            }
            throw { message: 'Network error occurred' };
        }
    }
};


const transService = {
    add: async (transaction, params) => {
        if (!params.user_id) {
            console.error("Error: 'user_id' is missing in API call!", params);
            throw new Error("User ID missing")
        }
        try {
          const response = await api.post(
            `/api/transactions/add`,
            transaction,
            { params: params }
          );
          return response.data;
        } catch (error) {
          console.error("API request failed:", error);

          if (error.response) {
            console.error("API response error data:", error.response.data);
            console.error("API  response error status", error.response.status);
            console.error("API response error headers", error.response.headers);
          } else if (error.request) {
            console.error("No response received", error.request);
          } else {
            console.error("Error setting up the request", error.message);
          }
          throw { message: "Network error occurred" };
        }
    },

    getAll: async(budget_id, params) => {
        try {

            const response = await api.get(`/api/transactions/budget/${budget_id}`, {params : params});

            return response.data;
        } catch (error) {
            if (error.response) {
                console.error("API response error data:", error.response.data);
                console.error("API  response error status", error.response.status);
                console.error("API response error headers", error.response.headers);
            
            } else if(error.request) {
                console.error("No response received", error.request);
            } else {
                console.error("Error setting up the request", error.message);
            }
            throw { message: 'Network error occurred'}
            
        }
    },

    getTag: async(tag_id, params) => {
        try {
            const response = await api.get(`/api/tags/${tag_id}`, {params : params})
            return response.data;
        } catch (error) {
            if (error.response) {
                console.error("API response error data:", error.response.data);
                console.error("API  response error status". error.response.status);
                console.error("API response error headers", error.response.headers);
            
            } else if(error.request) {
                console.error("No response received", error.request);
            } else {
                console.error("Error setting up the request", error.message);
            }
            throw { message: 'Network error occurred'}
            
        }
    },

    update: async(id, params) => {
        try{
            const response = await api.put(`/api/transactions/update/${id}`, {params: params});
            return response.data;
        }catch (error) {
            if (error.response) {
                console.error("API response error data:", error.response.data);
                console.error("API  response error status", error.response.status);
                console.error("API response error headers", error.response.headers);
            
            } else if(error.request) {
                console.error("No response received", error.request);
            } else {
                console.error("Error setting up the request", error.message);
            }
            throw { message: 'Network error occurred'}
            
        }
    },

delete: async (id, params = {}) => {
    if (!id) {
        console.error("Error: Transaction ID is missing.");
        return;
    }

        try {
        const response = await api.delete(`/api/transactions/delete/${id}`, { params });
        return response.data;
        } catch (error) {
        console.error("Delete request error:", error);
        throw error;
        }
    },

    search: async(query, budget_id) => {
        try {
            const response = await api.get(`/api/transactions/search?query=${query}&budget_id=${budget_id}`);

            return response.data;
        }catch (error) {
            if (error.response) {
                console.error("API response error data:", error.response.data);
                console.error("API  response error status", error.response.status);
                console.error("API response error headers", error.response.headers);
            
            } else if(error.request) {
                console.error("No response received", error.request);
            } else {
                console.error("Error setting up the request", error.message);
            }
            throw { message: 'Network error occurred'}
        }
    }
}


const budgetService = {

    getByUser: async (user_id) => {
        try{
            const response = await api.get(`/api/budgets/user/${user_id}`)
            return response.data;
        }catch (error) {
            if (error.response) {
                console.error("API response error data:", error.response.data);
                console.error("API  response error status", error.response.status);
                console.error("API response error headers", error.response.headers);
            
            } else if(error.request) {
                console.error("No response received", error.request);
            } else {
                console.error("Error setting up the request", error.message);
            }
            throw { message: 'Network error occurred'}
        }

    },

    add: async (budget,  params) => {
        if (!params.user_id) {
            console.error("Error: 'user_id' is missing in API call!", params);
            throw new Error("User ID missing")
        }
        
        try{
            const response = await api.post(`/api/budgets/add`, budget, {params : params})
            return response.data;
        }catch (error) {
            if (error.response) {
                console.error("API response error data:", error.response.data);
                console.error("API  response error status", error.response.status);
                console.error("API response error headers", error.response.headers);
            
            } else if(error.request) {
                console.error("No response received", error.request);
            } else {
                console.error("Error setting up the request", error.message);
            }
            throw { message: 'Network error occurred'}
        }

    }
}

export default {
    authService,
    transService,
    tagService,
    budgetService
};