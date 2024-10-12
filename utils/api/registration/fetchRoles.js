import axios from "axios";

export const fetchRoles = async () => {
  try {
    const res = await axios.post("http://localhost:8080/role/getRoles", {
      withCredentials: true,
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch roles:", error);
    throw error;
  }
};
