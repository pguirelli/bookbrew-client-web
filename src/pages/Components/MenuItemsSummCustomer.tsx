import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Menu } from '@mui/material';
import { Menu as MenuIcon, Category, Settings, LocalShipping, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { MenuItemsManagement } from "../../pages/Components/MenuItemsManagement.tsx";

interface MenuItemsSummCustomerProps {
  user: any;
  isAuthenticated: boolean;
  logout: () => void;
}

export const MenuItemsSummCustomer: React.FC<MenuItemsSummCustomerProps> = ({ user, isAuthenticated, logout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const drawerContent = (
    <Box sx={{ width: 250 }}>
      <List>
        <ListItem>
          <Typography variant="h6">BookBrew</Typography>
        </ListItem>
        <Divider />
        <ListItem onClick={() => navigate("/")}>
          <ListItemIcon>
            <Category />
          </ListItemIcon>
          <ListItemText primary="Todos os produtos" />
        </ListItem>
        <ListItem onClick={() => navigate("/questions")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Perguntas Frequentes" />
        </ListItem>
        <ListItem onClick={() => navigate("/contact")}>
          <ListItemIcon>
            <LocalShipping />
          </ListItemIcon>
          <ListItemText primary="Contato" />
        </ListItem>
        <ListItem onClick={() => navigate("/about-us")}>
          <ListItemIcon>
            <Settings />
          </ListItemIcon>
          <ListItemText primary="Sobre Nós" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
            BookBrew
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isAuthenticated ? (
              <IconButton color="inherit" onClick={handleProfileMenuOpen}>
                <Person />
              </IconButton>
            ) : (
              <Button color="inherit" onClick={() => navigate("/login")} startIcon={<Person />}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
        {drawerContent}
      </Drawer>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItemsManagement user={user} isAuthenticated={isAuthenticated} logout={logout} />
      </Menu>
    </Box>
  );
};