import { Box } from '@mui/material';
import Header from '../../../components/Header';
import PieChart from '../../../components/PieChart';
import DashboardLayout from '@/components/DashboardLayout';
import { ReactNode } from 'react';

const Pie = () => {
  return (
    <Box m="20px">
      <Header title="Pie Chart" subtitle="Simple Pie Chart" />
      <Box height="75vh">
        <PieChart />
      </Box>
    </Box>
  );
};

Pie.getLayout = (page: ReactNode) => <DashboardLayout>{page}</DashboardLayout>;

export default Pie;
