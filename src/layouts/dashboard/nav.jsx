import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import { alpha } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import ListItemButton from '@mui/material/ListItemButton';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useResponsive } from 'src/hooks/use-responsive';

import { account } from 'src/_mock/account';

import Logo from 'src/components/logo';
import Scrollbar from 'src/components/scrollbar';

import { NAV } from './config-layout';
import navConfig from './config-navigation';

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav }) {
  const pathname = usePathname();
  const upLg = useResponsive('up', 'lg');

  const { user } = useSelector((state) => state.auth); // Get the user from the state
  const userRole = user?.role || account.role; // Default to mock account role if no user role

  useEffect(() => {
    onCloseNav(); // Close navigation only when the route/pathname changes
  }, [pathname, onCloseNav]);
  

  // Filter the navigation config based on user role
  const filteredNavConfig = navConfig.filter((item) => {
    if (!item.roles || item.roles.includes(userRole)) {
      return true;
    }
    return false;
  });

  const renderAccount = (
    <Box
      sx={{
        my: 3,
        mx: 2.5,
        py: 2,
        px: 2.5,
        display: 'flex',
        borderRadius: 1.5,
        alignItems: 'center',
        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.12),
      }}
    >
      <Avatar src={account.photoURL} alt="photoURL" />
      <Box sx={{ ml: 2 }}>
        <Typography variant="subtitle2">{account.displayName}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {userRole}
        </Typography>
      </Box>
    </Box>
  );

  const renderMenu = (
    <Stack component="nav" spacing={0.5} sx={{ px: 2 }}>
      {filteredNavConfig.map((item) => (
        <NavItem key={item.title} item={item} />
      ))}
    </Stack>
  );

  const renderContent = (
    <Scrollbar
      sx={{
        height: 1,
        '& .simplebar-content': {
          height: 1,
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      <Logo sx={{ mt: 3, ml: 3 }} />
      {renderAccount}
      {renderMenu}
      <Box sx={{ flexGrow: 1 }} />
    </Scrollbar>
  );

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.WIDTH },
      }}
    >
      {upLg ? (
        <Box
          sx={{
            height: 1,
            position: 'fixed',
            width: NAV.WIDTH,
            borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
          }}
        >
          {renderContent}
        </Box>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

// ----------------------------------------------------------------------

function NavItem({ item }) {
  const pathname = usePathname();
  const active = item.path === pathname;
  const [open, setOpen] = useState(false);

  const { user } = useSelector((state) => state.auth); // Get the user from the state
  const userRole = user?.role || account.role; // Set a default role if no user is logged in

  // Handle click for expanding/collapsing children
  const handleClick = () => {
    if (item.children) {
      setOpen(!open);
    }
  };

  // Filter children based on user role, if item has children
  const filteredChildren = item.children
    ? item.children.filter((child) => {
        // If roles are defined, check if the user's role is included
        if (child.roles) {
          return child.roles.includes(userRole);
        }
        return true; // Allow if no roles are defined
      })
    : [];

    return (
      <>
        <ListItemButton
          onClick={handleClick}
          component={RouterLink}
          href={item.path ? item.path : ''}
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            // justifyContent: 'space-between',
            fontWeight: 'fontWeightMedium',
            ...(active && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
            {item.icon}
          </Box>
  
          <Box component="span">{item.title} </Box>
          <Box component="span" sx={{ml: 2, alignItems: 'center'}}>
            {item.children && (open ? <ExpandLess /> : <ExpandMore />)}
          </Box>
          
        </ListItemButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
            {filteredChildren &&
              filteredChildren.map((childItem) => <NavItem key={childItem.title} item={childItem} />)}
          {/* <List component="div" disablePadding>
          </List> */}
        </Collapse>
      </>
    );
}

NavItem.propTypes = {
  item: PropTypes.object.isRequired,
};

function NestedMenu({ menuItems }) {
  const pathname = usePathname();
  const active = menuItems.path === pathname;

  return (
    <>
      {menuItems.map((nestedItem) => (
        <ListItemButton
          component={RouterLink}
          href={nestedItem.path}
          sx={{
            minHeight: 44,
            borderRadius: 0.75,
            typography: 'body2',
            color: 'text.secondary',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightMedium',
            ...(active && {
              color: 'primary.main',
              fontWeight: 'fontWeightSemiBold',
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
              },
            }),
          }}
        >
          <Box component="span" sx={{ width: 24, height: 24, mr: 2 }}>
            {nestedItem.icon}
          </Box>

          <Box component="span">{nestedItem.title} </Box>
        </ListItemButton>
      ))}
    </>
  );
}

NestedMenu.propTypes = {
  menuItems: PropTypes.array,
};
