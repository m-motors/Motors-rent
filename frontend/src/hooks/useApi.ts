import axios from "axios";
import { useContext } from "react";
import { UserContext } from "../store/UserContext";

export const useApi = () => {
  const { state } = useContext(UserContext);

  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_HOST,
    headers: {
      'Content-Type': 'application/json',
      Authorization: state.token ? `Bearer ${state.token}` : undefined,
    },
  });

  return instance;
};


// Exemple d'utilisation 

// GET
// const api = useApi();
// const response = await api.get("/api/example");

// const api = useApi();


// POST 
// const customHeaders = {
//   "X-Special-Feature": "enabled",
// };

// const response = await api.post(
//   "/api/secure-endpoint",
//   { key: "value" },
//   {
//     headers: {
//       ...api.defaults.headers.common,
//       ...customHeaders,
//     },
//   }
// );