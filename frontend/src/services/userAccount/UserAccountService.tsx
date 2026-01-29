import http from "../http-common";

export const login = (accountEmail: string, accountPassword: string) => {
  return http.post("/auth/login", {
    accountEmail,
    password: accountPassword
  });
};
