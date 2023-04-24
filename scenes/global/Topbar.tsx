import Link from 'next/link';
import { useContext } from 'react';
import { Box, IconButton, useTheme } from '@mui/material';
import { ColorModeContext, tokens } from '../../theme';
import InputBase from '@mui/material/InputBase';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SearchIcon from '@mui/icons-material/Search';
import Logo from '@/components/icons/Logo';
import s from './topbar.module.css';

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      <Box width={'100%'} minWidth={'500px'}>
        <Link href="/" className="logo" aria-label="Logo">
          <Logo />
        </Link>
      </Box>
      <Box display="flex" width={'100%'} className="justify-center">
        {/* SEARCH BAR */}
        <Box
          display="flex"
          height="auto"
          sx={{
            background: colors.primary[400],
            borderRadius: '3px',
            width: '500px'
          }}
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>
      </Box>
      {/* ICONS */}
      <Box width={'100%'} className="flex justify-end">
        <Box
          width={'100%'}
          maxWidth={'200px'}
          minWidth={'200px'}
          className="flex justify-between"
        >
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === 'dark' ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
