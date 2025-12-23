import { Flame, TrendingUp, TrendingDown, Minus, Users, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface YearSummaryCardsProps {
  selectedYear: number;
}

const yearTable = {
  2023: "yangin_2023",
  2024: "yangin_2024",
  2025: "yangin_2025",
} as const;

const useYearSummary = (year: number) => {
  return useQuery({
    queryKey: ['year-summary', year],
    queryFn: async () => {
      const table = yearTable[year as keyof typeof yearTable];
      if (!table) return null;

      const { data, count } = await supabase
        .from(table)
        .select('kullanilan_personel_sayisi, yangin_neden, isletme_id', { count: 'exact' });

      const fires = data ?? [];
      const totalFires = count ?? 0;
      const totalPersonnel = fires.reduce((sum, f) => sum + (f.kullanilan_personel_sayisi ?? 0), 0);
      
      // Find most common cause
      const causeCounts: Record<string, number> = {};
      fires.forEach((f) => {
        const cause = f.yangin_neden ?? 'Bilinmeyen';
        causeCounts[cause] = (causeCounts[cause] || 0) + 1;
      });
      const topCause = Object.entries(causeCounts).sort((a, b) => b[1] - a[1])[0];

      // Find most affected isletme
      const isletmeCounts: Record<number, number> = {};
      fires.forEach((f) => {
        if (f.isletme_id) {
          isletmeCounts[f.isletme_id] = (isletmeCounts[f.isletme_id] || 0) + 1;
        }
      });
      const topIsletme = Object.entries(isletmeCounts).sort((a, b) => b[1] - a[1])[0];

      return {
        totalFires,
        totalPersonnel,
        avgPersonnelPerFire: totalFires > 0 ? Math.round(totalPersonnel / totalFires) : 0,
        topCause: topCause ? { name: topCause[0], count: topCause[1] } : null,
        topIsletmeId: topIsletme ? Number(topIsletme[0]) : null,
        topIsletmeCount: topIsletme ? topIsletme[1] : 0,
      };
    },
  });
};

const useYearTrend = (currentYear: number) => {
  const previousYear = currentYear - 1;
  const currentQuery = useYearSummary(currentYear);
  const previousQuery = useYearSummary(previousYear);

  const currentFires = currentQuery.data?.totalFires ?? 0;
  const previousFires = previousQuery.data?.totalFires ?? 0;
  
  let trend: 'up' | 'down' | 'same' = 'same';
  let percentage = 0;
  
  if (previousFires > 0) {
    percentage = Math.round(((currentFires - previousFires) / previousFires) * 100);
    trend = percentage > 0 ? 'up' : percentage < 0 ? 'down' : 'same';
  }

  return { trend, percentage: Math.abs(percentage), isLoading: currentQuery.isLoading || previousQuery.isLoading };
};

const isletmeNames: Record<number, string> = {
  1: 'Bilecik Merkez',
  2: 'Bozüyük',
  3: 'Bursa Merkez',
  4: 'Gemlik',
  5: 'İnegöl',
  6: 'İznik',
  7: 'Karacabey',
  8: 'Keles',
  9: 'M.Kemalpaşa',
  10: 'Orhaneli',
  11: 'Yalova',
};

const YearSummaryCards = ({ selectedYear }: YearSummaryCardsProps) => {
  const { data, isLoading } = useYearSummary(selectedYear);
  const { trend, percentage, isLoading: trendLoading } = useYearTrend(selectedYear);

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-fire-critical' : trend === 'down' ? 'text-forest-dark' : 'text-muted-foreground';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
      {/* Total Fires */}
      <div className="bg-card rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Toplam Yangın</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {isLoading ? '...' : data?.totalFires ?? 0}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-fire-high/10 flex items-center justify-center">
            <Flame className="h-5 w-5 text-fire-high" />
          </div>
        </div>
        {!trendLoading && selectedYear > 2023 && (
          <div className={`flex items-center gap-1 mt-2 text-xs ${trendColor}`}>
            <TrendIcon className="h-3 w-3" />
            <span>{percentage}% {trend === 'up' ? 'artış' : trend === 'down' ? 'azalış' : 'değişim yok'}</span>
          </div>
        )}
      </div>

      {/* Personnel */}
      <div className="bg-card rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">Toplam Personel</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {isLoading ? '...' : data?.totalPersonnel?.toLocaleString() ?? 0}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Ort: {isLoading ? '...' : data?.avgPersonnelPerFire ?? 0} kişi/yangın
        </p>
      </div>

      {/* Top Cause */}
      <div className="bg-card rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">En Sık Neden</p>
            <p className="text-sm font-bold text-foreground mt-1 line-clamp-1">
              {isLoading ? '...' : data?.topCause?.name ?? '-'}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {isLoading ? '...' : data?.topCause?.count ?? 0} yangın
        </p>
      </div>

      {/* Most Affected Region */}
      <div className="bg-card rounded-xl shadow-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide">En Riskli Bölge</p>
            <p className="text-sm font-bold text-foreground mt-1 line-clamp-1">
              {isLoading ? '...' : (data?.topIsletmeId ? isletmeNames[data.topIsletmeId] : '-')}
            </p>
          </div>
          <div className="h-10 w-10 rounded-full bg-fire-critical/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-fire-critical" />
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {isLoading ? '...' : data?.topIsletmeCount ?? 0} yangın
        </p>
      </div>
    </div>
  );
};

export default YearSummaryCards;
