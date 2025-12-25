import VehicleChart from './charts/VehicleChart';
import BusinessVehicleExcessChart from './charts/BusinessVehicleExcessChart';
import DangerRankingChart from './charts/DangerRankingChart';
import MonthlyFireChart from './charts/MonthlyFireChart';
import TreeTypeChart from './charts/TreeTypeChart';
import YearlyFireChart from './charts/YearlyFireChart';
import FireCauseChart from './charts/FireCauseChart';
import YearComparisonChart from './charts/YearComparisonChart';
import YearSummaryCards from './charts/YearSummaryCards';
import BusinessInfo from './BusinessInfo';
import YearSelector from './YearSelector';
import type { Business } from '@/types/forest';
import { useRealtimeSubscription } from '@/hooks/useSupabaseDashboard';

interface DashboardProps {
  businesses: Business[];
  selectedDistrict: string | null;
  selectedYear: number;
  onYearChange: (year: number) => void;
  isLoading?: boolean;
  errorMessage?: string;
}

const Dashboard = ({ 
  businesses, 
  selectedDistrict, 
  selectedYear, 
  onYearChange, 
  isLoading, 
  errorMessage 
}: DashboardProps) => {
  // Enable realtime updates
  useRealtimeSubscription();
  
  const business = selectedDistrict 
    ? businesses.find(b => b.districtId === selectedDistrict)
    : null;

  if (isLoading) {
    return <div className="bg-card rounded-xl shadow p-6">Supabase verileri yükleniyor...</div>;
  }

  if (errorMessage) {
    return <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4">{errorMessage}</div>;
  }

  return (
    <div className="space-y-4">
      {/* Year Selector */}
      <YearSelector selectedYear={selectedYear} onYearChange={onYearChange} />

      {/* Year Summary Cards */}
      <YearSummaryCards selectedYear={selectedYear} />

      {/* Business Info Card */}
      <BusinessInfo businesses={businesses} districtId={selectedDistrict} />

      {/* Year Comparison Chart - Full Width */}
      <YearComparisonChart />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VehicleChart />
        <BusinessVehicleExcessChart />
        <DangerRankingChart />
        <MonthlyFireChart business={business} selectedYear={selectedYear} />
        <TreeTypeChart business={business} />
        <YearlyFireChart business={business} />
        <FireCauseChart business={business} />
      </div>
    </div>
  );
};

export default Dashboard;
