import axios from "axios";
import { UserProfile, UserRequest } from "../types/user.types.ts";

const API_URL = "http://localhost:8081/bff/user-profiles";

const API_URL_USER = "http://localhost:8081/bff/users";

export const userService = {
  getAllUserProfiles: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getUserProfileById: async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  createUserProfile: async (userProfile: UserProfile) => {
    const response = await axios.post(API_URL, userProfile);
    return response.data;
  },

  updateUserProfile: async (id: number, userProfile: UserProfile) => {
    const response = await axios.put(`${API_URL}/${id}`, userProfile);
    return response.data;
  },

  deleteUserProfile: async (id: number) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await axios.get(API_URL_USER);
    return response.data;
  },

  getUserById: async (id: number) => {
    const response = await axios.get(`${API_URL_USER}/${id}`);
    return response.data;
  },

  createUser: async (user: UserRequest) => {
    const response = await axios.post(API_URL_USER, user);
    return response.data;
  },

  updateUser: async (id: number, user: UserRequest) => {
    const response = await axios.put(`${API_URL_USER}/${id}`, user);
    return response.data;
  },

  deleteUser: async (id: number) => {
    const response = await axios.delete(`${API_URL_USER}/${id}`);
    return response.data;
  },
};
