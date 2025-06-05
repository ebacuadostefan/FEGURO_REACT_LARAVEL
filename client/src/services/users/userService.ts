import AxiosInstance from "../../AxiosInstance";
import { PaginatedUsers } from "../../interfaces/users/PaginatedUsers";

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
      throw error;
    }
  },

  storeUser: async (data: any) => {
    return AxiosInstance.post("/storeUser", data)
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },

};

export default UserService;