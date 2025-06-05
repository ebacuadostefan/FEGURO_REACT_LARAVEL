import AxiosInstance from "../../AxiosInstance";

const RoleService = {
  fetchRoles: async () => {
    return AxiosInstance.get("/fetchRoles")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default RoleService;