import {
  UserCreateInput,
  UserProfileUpdateInput,
  userUpdateInput,
} from "@/schema/user.schema";
import { axiosInstance } from "../axiosinstance";

const resolveSearch = (value?: string | unknown) => {
  return typeof value === "string" ? value.trim() : undefined;
};

export const fetchUsers = async (search?: string | unknown) => {
  const trimmedSearch = resolveSearch(search);
  const { data } = await axiosInstance.get("/users", {
    params: trimmedSearch ? { search: trimmedSearch } : undefined,
  });
  return data.users;
};

export const addUser = async (dataToSend: UserCreateInput) => {
  const { data } = await axiosInstance.post("/users", dataToSend);
  return data.user;
};

export const updateUser = async ({
  id,
  dataToSend,
}: {
  id: number;
  dataToSend: userUpdateInput;
}) => {
  const { data } = await axiosInstance.patch(`/users/${id}`, dataToSend);
  return data.user;
};

export const deleteUser = async (id: number) => {
  const { data } = await axiosInstance.delete(`/users/${id}`);
  return data.user;
};

export const fetchUser = async (id: number) => {
  const { data } = await axiosInstance.get(`/users/${id}`);
  return data.user;
};

export const fetchMe = async () => {
  const { data } = await axiosInstance.get("/users/me");
  return data.user;
};

export const updateMe = async (dataToSend: UserProfileUpdateInput) => {
  const { data } = await axiosInstance.patch("/users/me", dataToSend);
  return data.user;
};
