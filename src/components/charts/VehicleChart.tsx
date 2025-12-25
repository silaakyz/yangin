import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Truck, AlertTriangle } from 'lucide-react';
import { useVehicleTypeData } from '@/hooks/useSupabaseDashboard';

const VehicleChart = () => {
  const { data = [], isLoading } = useVehicleTypeData();

  // Calculate totals from vehicle type data (isletme_arac based)
  const totalMevcut = data.reduce((sum, v) => sum + v.mevcut, 0);
  const totalKullanilan = data.reduce((sum, v) => sum + v.kullanilan, 0);
  const excessVehicles = data.filter(v => v.asim > 0);

  return (
    <div className="bg-card rounded-xl shadow-lg p-4 h-full animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Araç Türü Bazında Kullanım</h3>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2 text-primary text-xs mb-1">
            <Truck className="h-3.5 w-3.5" />
            <span>Mevcut Araç</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{isLoading ? '...' : totalMevcut}</p>
        </div>
        <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
          <div className="flex items-center gap-2 text-accent-foreground text-xs mb-1">
            <Truck className="h-3.5 w-3.5" />
            <span>Kullanılan</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{isLoading ? '...' : totalKullanilan}</p>
        </div>
      </div>

      {/* Vehicle Types Table */}
      <div className="bg-secondary/30 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground text-xs mb-3">
          <Truck className="h-3.5 w-3.5" />
          <span>Araç Türleri</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {data.map((vehicle, idx) => (
            <div key={idx} className="flex items-center justify-between bg-background/50 rounded-md px-2 py-1.5">
              <span className="text-xs text-foreground">{vehicle.vehicleType}</span>
              <span className={`text-xs font-semibold ${vehicle.asim > 0 ? 'text-destructive' : 'text-primary'}`}>
                {vehicle.mevcut}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Aşım olan araç türleri listesi */}
      {excessVehicles.length > 0 && (
        <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Aşım Olan Araç Türleri</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {excessVehicles.map((vehicle, idx) => (
              <div key={idx} className="flex items-center justify-between bg-background/50 rounded-md px-2 py-1">
                <span className="text-xs text-foreground">{vehicle.vehicleType}</span>
                <span className="text-xs font-semibold text-destructive">+{vehicle.asim}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleChart;
