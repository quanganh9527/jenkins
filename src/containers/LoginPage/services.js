import { httpClient } from "../../utilities";

const login = (identifier, password) => {
  return httpClient.post("/auth/login", { identifier, password });
};

const update = (data) => {
  console.log('will update here');
  return httpClient.post("/users", { data });
};

const getProfile = () => {
  return httpClient.get("/users/me");
};
const setHeaderToken = token => httpClient.setAuthTokenToHeaders(token);

export { login, update, getProfile, setHeaderToken };
