import React, { useEffect, useState } from "react";
import { MenuItem, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { customerService } from "../../services/customer.service.ts";

interface MenuItemsManagementProps {
  user: any;
  isAuthenticated: boolean;
  logout: () => void;
}

export const MenuItemsManagement: React.FC<MenuItemsManagementProps> = ({
  user,
  isAuthenticated,
  logout,
}) => {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState<number>(0);

  const isAdmin = user?.profile.id === 1;
  const isManager = user?.profile.id === 2;
  const isModerator = user?.profile.id === 3;
  const isCustomer = user?.profile.id === 4;

  const getCustomer = async () => {
    const customer = await customerService.getCustomerByUserId(user?.id ?? 0);
    return customer;
  };

  useEffect(() => {
    const loadCustomer = async () => {
      const customer = await getCustomer();
      setCustomerId(customer.id ?? 0);

      if (customer) {
        loadCustomer();
      }
    };
  }, []);

  return isAuthenticated ? (
    <>
      {(isAdmin || isManager) && (
        <>
          <MenuItem onClick={() => navigate("/process-order")}>
            Processar Pedido
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-promotion")}>
            Promoções
          </MenuItem>
          <MenuItem onClick={() => navigate("/moderate-reviews")}>
            Avaliações
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-category")}>
            Categoria
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-brand")}>Marca</MenuItem>
          <MenuItem onClick={() => navigate("/manage-product")}>
            Produto
          </MenuItem>
          <MenuItem onClick={() => navigate("/register-user")}>
            Novo Usuário
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-user")}>
            Gerenciar Usuários
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-customer")}>
            Clientes
          </MenuItem>
          <MenuItem onClick={() => navigate("/user-profile")}>Perfis</MenuItem>
        </>
      )}
      {isModerator && (
        <>
          <MenuItem onClick={() => navigate("/moderate-reviews")}>
            Avaliações
          </MenuItem>
          <MenuItem onClick={() => navigate("/manage-product")}>
            Produto
          </MenuItem>
        </>
      )}
      {isCustomer && (
        <>
          <MenuItem onClick={() => navigate("/customer-profile")}>
            Meus Dados
          </MenuItem>
          <MenuItem onClick={() => navigate("/customer-orders")}>
            Meus Pedidos
          </MenuItem>
          <MenuItem onClick={() => navigate("/customer-review/" + customerId)}>
            Minhas Avaliações
          </MenuItem>
        </>
      )}
      <Divider />
      <MenuItem onClick={() => navigate("/change-password")}>
        Alterar Senha
      </MenuItem>
      <MenuItem
        onClick={() => {
          logout();
          navigate("/login");
        }}
      >
        Sair
      </MenuItem>
    </>
  ) : null;
};
