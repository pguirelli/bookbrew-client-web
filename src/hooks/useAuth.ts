interface User {
  id: number;
  name: string;
  email: string;
  cpf: string;
}

export const useAuth = () => {
  const getUserId = (): number | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    const user: User = JSON.parse(userStr);
    return user.id;
  };

  const getUser = (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    return JSON.parse(userStr);
  };

  return { getUserId, getUser };
};
