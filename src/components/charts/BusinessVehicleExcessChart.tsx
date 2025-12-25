import { Building2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface BusinessExcessData {
  isletme_ad: string;
  isletme_toplam_arac: number;
  yanginda_kullanilan_arac: number;
  arac_asimi: number;
}

const useBusinessVehicleExcess = () => {
  return useQuery({
    queryKey: ['business-vehicle-excess'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('isletme_arac_asimi_view')
        .select('*')
        .order('arac_asimi', { ascending: false });
      
      if (error) throw error;
      return (data || []) as BusinessExcessData[];
    }
  });
};

const BusinessVehicleExcessChart = () => {
  const { data = [], isLoading } = useBusinessVehicleExcess();

  const excessBusinesses = data.filter(b => b.arac_asimi > 0);
  const totalExcess = excessBusinesses.reduce((sum, b) => sum + b.arac_asimi, 0);

  // Prepare chart data - shorten business names
  const chartData = data.map(b => ({
    name: b.isletme_ad?.replace(' Orman İşletmesi', '') || 'Bilinmiyor',
    fullName: b.isletme_ad,
    mevcut: b.isletme_toplam_arac,
    kullanilan: b.yanginda_kullanilan_arac,
    asim: b.arac_asimi
  }));

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl shadow-lg p-4 h-full animate-pulse">
        <div className="h-6 bg-muted rounded w-1/3 mb-4"></div>
        <div className="h-48 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-lg p-4 h-full animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">İşletme Bazında Araç Aşımı</h3>
        </div>
        {excessBusinesses.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-destructive bg-destructive/10 px-2 py-1 rounded-full">
            <AlertTriangle className="h-3 w-3" />
            <span>{excessBusinesses.length} işletmede aşım</span>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-destructive/10 rounded-lg p-3 border border-destructive/20">
          <div className="flex items-center gap-2 text-destructive text-xs mb-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Toplam Aşım</span>
          </div>
          <p className="text-2xl font-bold text-destructive">+{totalExcess}</p>
        </div>
        <div className="bg-primary/10 rounded-lg p-3 border border-primary/20">
          <div className="flex items-center gap-2 text-primary text-xs mb-1">
            <TrendingDown className="h-3.5 w-3.5" />
            <span>Aşımlı İşletme</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{excessBusinesses.length}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ left: 80, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis type="number" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} 
              width={75}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--foreground))'
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  asim: 'Aşım',
                  mevcut: 'Mevcut',
                  kullanilan: 'Kullanılan'
                };
                return [value, labels[name] || name];
              }}
              labelFormatter={(label) => chartData.find(d => d.name === label)?.fullName || label}
            />
            <Bar dataKey="asim" name="asim" radius={[0, 4, 4, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.asim > 0 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {data.map((business, idx) => (
          <div 
            key={idx} 
            className={`flex items-center justify-between p-2 rounded-lg ${
              business.arac_asimi > 0 
                ? 'bg-destructive/10 border border-destructive/20' 
                : 'bg-secondary/30'
            }`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-foreground truncate">
                {business.isletme_ad?.replace(' Orman İşletmesi', '')}
              </p>
              <div className="flex gap-3 text-[10px] text-muted-foreground">
                <span>Mevcut: {business.isletme_toplam_arac}</span>
                <span>Kullanılan: {business.yanginda_kullanilan_arac}</span>
              </div>
            </div>
            <div className={`text-sm font-bold ${
              business.arac_asimi > 0 ? 'text-destructive' : 'text-primary'
            }`}>
              {business.arac_asimi > 0 ? '+' : ''}{business.arac_asimi}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessVehicleExcessChart;
