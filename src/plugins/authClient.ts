import axios from "axios";

const authClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/auth`,
  headers: { "Content-type": "application/json" },
});

export default authClient;
