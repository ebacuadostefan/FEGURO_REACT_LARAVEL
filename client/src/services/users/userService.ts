import AxiosInstance from "../../AxiosInstance";
import { PaginatedUsers } from "../../interfaces/users/PaginatedUsers";
import { User } from "../../interfaces/users/User";

const UserService = {
  loadUsers: async (
    page = 1,
    search = ""
  ): Promise<{ users: PaginatedUsers }> => {
    try {
      const response = await AxiosInstance.get(
        `/fetchUsers?page=${page}&search=${encodeURIComponent(search)}`
      );
      return response.data;
    } catch (error) {
      console.error("Error loading users:", error);
      throw error;
    }
  },

  getUser: async (userId: number): Promise<{ user: User }> => {
    try {
      const response = await AxiosInstance.get(`/user/show/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${userId}:`, error);
      throw error;
    }
  },

  storeUser: async (data: FormData) => {
    try {
      const response = await AxiosInstance.post("/user/store", data);
      return response;
    } catch (error) {
      console.error("Error storing user:", error);
      throw error;
    }
  },

  updateUser: async (userId: number, data: FormData) => {
    try {
      const response = await AxiosInstance.post(`/user/update/${userId}`, data);
      return response;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      throw error;
    }
  },

  deleteUser: async (userId: number) => {
    try {
      const response = await AxiosInstance.delete(`/user/delete/${userId}`);
      return response;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
    }
  },

};

export default UserService;