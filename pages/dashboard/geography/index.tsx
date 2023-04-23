import { Box, useTheme } from '@mui/material';
import GeographyChart from '../../../components/GeographyChart';
import Header from '../../../components/Header';
import { tokens } from '../../../theme';
import DashboardLayout from '@/components/DashboardLayout';
import { ReactNode } from 'react';

const Geography = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      <Header title="Geography" subtitle="Simple Geography Chart" />

      <Box
        height="75vh"
        border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px"
      >
        <GeographyChart />
      </Box>
    </Box>
  );
};
Geography.getLayout = (page: ReactNode) => (
  <DashboardLayout>{page}</DashboardLayout>
);
export default Geography;
