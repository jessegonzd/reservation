export enum UserType {
  provider = "provider",
  client = "client",
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  userType: UserType;
};
