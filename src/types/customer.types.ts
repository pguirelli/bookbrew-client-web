export interface Address {
    id?: number;
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    type: string;
    city: string;
    state: string;
    country: string;
  }
  
  export interface Customer {
    id?: number;
    userId?: number;
    name: string;
    lastName: string;
    email: string;
    cpf: string;
    phone: string;
    password: string;
    status?: boolean;
    birthDate: string;
    addresses?: Address[];
    profile?: number;
    creationDate?: string;
    updateDate?: string;
    lastLoginDate?: string;
    passwordUpdateDate?: string;
  }
  
  export interface CustomerUpdate {
    name: string;
    lastName: string;
    email: string;
  }
  