export interface UserProfile {
  id?: number;
  name: string;
  status?: boolean;
}

export interface User {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  password?: string;
  status?: boolean;
  idProfile?: number;
  creationDate?: string;
  updateDate?: string;
  lastLoginDate?: string;
  passwordUpdateDate?: string;
}

export interface UserRequest {
  id?: number;
  name: string;
  lastName: string;
  email: string;
  cpf: string;
  phone: string;
  password?: string;
  status?: boolean;
  profile: UserProfile;
  creationDate?: string;
  updateDate?: string;
  lastLoginDate?: string;
  passwordUpdateDate?: string;
}