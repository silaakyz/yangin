import VehicleChart from './charts/VehicleChart';
import DangerRankingChart from './charts/DangerRankingChart';
import MonthlyFireChart from './charts/MonthlyFireChart';
import TreeTypeChart from './charts/TreeTypeChart';
import YearlyFireChart from './charts/YearlyFireChart';
import FireCauseChart from './charts/FireCauseChart';
import BusinessInfo from './BusinessInfo';
import { businesses } from '@/data/mockData';

interface DashboardProps {
  selectedDistrict: string | null;
}

const Dashboard = ({ selectedDistrict }: DashboardProps) => {
  const business = selectedDistrict 
    ? businesses.find(b => b.districtId === selectedDistrict)
    : null;

  return (
    <div className="space-y-4">
      {/* Business Info Card */}
      <BusinessInfo districtId={selectedDistrict} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VehicleChart businessId={business?.id} />
        <DangerRankingChart />
        <MonthlyFireChart businessId={business?.id} />
        <TreeTypeChart businessId={business?.id} />
        <YearlyFireChart businessId={business?.id} />
        <FireCauseChart businessId={business?.id} />
      </div>
    </div>
  );
};

export default Dashboard;
