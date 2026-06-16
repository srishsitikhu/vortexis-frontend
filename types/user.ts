export type User = {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  role: string;
};

export enum RoleEnum {
  Admin = "Admin",
  Customer = "Customer",
}
