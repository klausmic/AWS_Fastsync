import React, { useState } from "react";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, Button, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import fastsyn from "../logo/fastsync.png"

const NavBar = () => {
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const home = () => {
    navigate('/');
  }
  return (
    <AppBar color="secondary" position="static">
      <Box px={2}>
        <Toolbar disableGutters>
          <img src={fastsyn} onClick={home} style={ {marginBottom:'0px' ,marginTop: '0px', maxWidth: '1090px', maxHeight: '60px'} } sx={{ display: { xs: "none", md: "" }, mr: 0 }} />
          {/* <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ mr: 2, display: { xs: "none", md: "flex" } }}
          >
            FastSync
          </Typography> */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              keepMounted
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: "block", md: "none" } }}
            >
              <MenuItem onClick={() => handleMenuClick("/create-project")}>
             <Typography  textAlign="center"><strong>Create Project</strong></Typography>
              </MenuItem>
              <MenuItem onClick={() => handleMenuClick("/list-projects")}>
                <Typography textAlign="center">List Projects</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}
          >
            FastSync
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Button
              sx={{ my: 2, color: "white", display: "block" }}
              onClick={() => handleMenuClick("/create-project")}
            >
              Create Project
            </Button>
            <Button
              sx={{ my: 2, color: "white", display: "block" }}
              onClick={() => handleMenuClick("/list-projects")}
            >
              List Projects
            </Button>
          </Box>
        </Toolbar>
      </Box>
    </AppBar>
  );
};

export default NavBar;
