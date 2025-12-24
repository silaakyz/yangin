import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { Truck, AlertTriangle } from 'lucide-react';
import { useVehicleTypeData } from '@/hooks/useSupabaseDashboard';

const VehicleChart = () => {
  const { data = [], isLoading } = useVehicleTypeData();

  const getBarColor = (asim: number) => {
    if (asim > 0) return 'hsl(var(--destructive))';
    return 'hsl(var(--primary))';
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-4 h-full animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Truck className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Araç Türü Bazında Kullanım</h3>
      </div>
      
      <div className="h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={isLoading ? [] : data} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="vehicleType" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={60}
            />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  mevcut: 'Mevcut Araç',
                  kullanilan: 'Kullanılan',
                  asim: 'Aşım'
                };
                return [value, labels[name] || name];
              }}
            />
            <Legend 
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value) => {
                const labels: Record<string, string> = {
                  mevcut: 'Mevcut Araç',
                  kullanilan: 'Kullanılan',
                  asim: 'Aşım'
                };
                return labels[value] || value;
              }}
            />
            <Bar dataKey="mevcut" name="mevcut" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="kullanilan" name="kullanilan" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="asim" name="asim" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Aşım olan araç türleri listesi */}
      {data.filter(v => v.asim > 0).length > 0 && (
        <div className="mt-4 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm font-medium text-destructive">Aşım Olan Araç Türleri</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {data.filter(v => v.asim > 0).map((vehicle, idx) => (
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
