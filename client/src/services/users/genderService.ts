import AxiosInstance from "../../AxiosInstance";

const GenderService = {
  fetchGenders: async () => {
    return AxiosInstance.get("/fetchGenders")
      .then((response) => response)
      .catch((error) => {
        throw error;
      });
  },
};

export default GenderService;