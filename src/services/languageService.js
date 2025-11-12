import api from "./apiClient";

export const getAllLanguages = async () => {
    const response = await api.get("/languages");
    return response.data;
};