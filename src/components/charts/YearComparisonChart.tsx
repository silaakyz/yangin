import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const monthLabels = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
const monthAliases = [
  ["ocak", "january"],
  ["şubat", "subat", "february"],
  ["mart", "march"],
  ["nisan", "april"],
  ["mayıs", "mayis", "may"],
  ["haziran", "june"],
  ["temmuz", "july"],
  ["ağustos", "agustos", "august"],
  ["eylül", "eylul", "september"],
  ["ekim", "october"],
  ["kasım", "kasim", "november"],
  ["aralık", "aralik", "december"],
];

const yearTable = {
  2023: "yangin_2023",
  2024: "yangin_2024",
  2025: "yangin_2025",
} as const;

const useYearComparisonData = () => {
  return useQuery({
    queryKey: ['year-comparison'],
    queryFn: async () => {
      const results = await Promise.all(
        Object.entries(yearTable).map(async ([yearStr, table]) => {
          const { data } = await supabase.from(table).select("yangin_ay");
          return { year: Number(yearStr), data: data ?? [] };
        })
      );

      return monthLabels.map((label, idx) => {
        const aliases = monthAliases[idx] ?? [];
        const monthData: Record<string, number | string> = { month: label };
        
        results.forEach(({ year, data }) => {
          const count = data.filter((f) => {
            const val = (f.yangin_ay ?? "").toString().toLowerCase();
            return aliases.some((alias) => val === alias);
          }).length;
          monthData[`y${year}`] = count;
        });
        
        return monthData;
      });
    },
  });
};

const YearComparisonChart = () => {
  const { data = [], isLoading } = useYearComparisonData();

  const chartColors = {
    y2023: 'hsl(var(--chart-1))',
    y2024: 'hsl(var(--chart-2))',
    y2025: 'hsl(var(--chart-3))',
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-4 h-full animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Yıllık Karşılaştırma</h3>
      </div>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={isLoading ? [] : data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value: number, name: string) => {
                const yearMap: Record<string, string> = { y2023: '2023', y2024: '2024', y2025: '2025' };
                return [value, yearMap[name] || name];
              }}
            />
            <Legend 
              formatter={(value) => {
                const yearMap: Record<string, string> = { y2023: '2023', y2024: '2024', y2025: '2025' };
                return yearMap[value] || value;
              }}
              wrapperStyle={{ fontSize: '12px' }}
            />
            <Bar dataKey="y2023" fill={chartColors.y2023} radius={[2, 2, 0, 0]} />
            <Bar dataKey="y2024" fill={chartColors.y2024} radius={[2, 2, 0, 0]} />
            <Bar dataKey="y2025" fill={chartColors.y2025} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default YearComparisonChart;
