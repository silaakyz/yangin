import { districts, businesses } from '@/data/mockData';
import { MapPin, TreePine } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegionMapProps {
  selectedDistrict: string | null;
  onDistrictSelect: (districtId: string) => void;
}

const dangerColors = {
  low: 'bg-fire-low hover:bg-fire-low/80',
  medium: 'bg-fire-medium hover:bg-fire-medium/80',
  high: 'bg-fire-high hover:bg-fire-high/80',
  critical: 'bg-fire-critical hover:bg-fire-critical/80 animate-pulse',
};

const RegionMap = ({ selectedDistrict, onDistrictSelect }: RegionMapProps) => {
  const groupedDistricts = districts.reduce((acc, district) => {
    if (!acc[district.province]) {
      acc[district.province] = [];
    }
    acc[district.province].push(district);
    return acc;
  }, {} as Record<string, typeof districts>);

  const getDistrictDanger = (districtId: string) => {
    const business = businesses.find(b => b.districtId === districtId);
    return business?.dangerLevel || 'low';
  };

  return (
    <div className="bg-card rounded-xl shadow-lg p-4 h-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
        <TreePine className="h-5 w-5 text-primary" />
        <h2 className="font-semibold text-foreground">Bölge Haritası</h2>
      </div>

      {/* Interactive Map Area */}
      <div className="relative bg-secondary/30 rounded-lg p-4 mb-4 min-h-[280px] overflow-hidden">
        {/* Map Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Province Labels */}
        <div className="absolute top-2 left-2 text-xs font-medium text-muted-foreground">BURSA</div>
        <div className="absolute top-2 right-12 text-xs font-medium text-muted-foreground">BİLECİK</div>
        <div className="absolute top-2 right-1/3 text-xs font-medium text-muted-foreground">YALOVA</div>

        {/* District Markers */}
        {districts.map((district) => {
          const danger = getDistrictDanger(district.id);
          const isSelected = selectedDistrict === district.id;
          
          return (
            <button
              key={district.id}
              onClick={() => onDistrictSelect(district.id)}
              className={cn(
                "absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300",
                "flex flex-col items-center gap-1 group z-10"
              )}
              style={{ left: `${district.coordinates.x}%`, top: `${district.coordinates.y}%` }}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300",
                  "shadow-md border-2 border-card",
                  dangerColors[danger],
                  isSelected && "ring-4 ring-primary/50 scale-125"
                )}
              >
                <MapPin className="h-4 w-4 text-primary-foreground" />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium px-1.5 py-0.5 rounded bg-card/90 shadow-sm",
                  "opacity-0 group-hover:opacity-100 transition-opacity",
                  isSelected && "opacity-100"
                )}
              >
                {district.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Province Sections */}
      <div className="space-y-3">
        {Object.entries(groupedDistricts).map(([province, dists]) => (
          <div key={province}>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              {province}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {dists.map((district) => {
                const danger = getDistrictDanger(district.id);
                const isSelected = selectedDistrict === district.id;
                
                return (
                  <button
                    key={district.id}
                    onClick={() => onDistrictSelect(district.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                      "border shadow-sm",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary shadow-glow"
                        : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-secondary"
                    )}
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          dangerColors[danger].split(' ')[0]
                        )}
                      />
                      {district.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground mb-2">Tehlike Seviyeleri</p>
        <div className="flex flex-wrap gap-3">
          {[
            { level: 'Düşük', color: 'bg-fire-low' },
            { level: 'Orta', color: 'bg-fire-medium' },
            { level: 'Yüksek', color: 'bg-fire-high' },
            { level: 'Kritik', color: 'bg-fire-critical' },
          ].map((item) => (
            <div key={item.level} className="flex items-center gap-1.5">
              <span className={cn("w-3 h-3 rounded-full", item.color)} />
              <span className="text-xs text-muted-foreground">{item.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegionMap;
