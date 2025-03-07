import { apiClient } from "./apiClient";

export const getTemplates = async () => {
  try {
    const response = await apiClient.get("/templates");
    return response.data.templates;
  } catch (error) {
    console.error("Error fetching templates:", error.response?.data || error);
    throw error;
  }
};
