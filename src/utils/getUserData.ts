import { User } from "src/model/user";

export const getCurrentUserData = (): User => {
  const user = localStorage.getItem("userData");
  return user ? JSON.parse(user) : null;
};
