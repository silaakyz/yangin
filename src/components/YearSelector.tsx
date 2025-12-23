import { Calendar } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

interface YearSelectorProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
  availableYears?: number[];
}

const YearSelector = ({ selectedYear, onYearChange, availableYears = [2023, 2024, 2025] }: YearSelectorProps) => {
  return (
    <div className="bg-card rounded-xl shadow-lg p-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Yıl Seçimi</h3>
        </div>
        <ToggleGroup 
          type="single" 
          value={selectedYear.toString()} 
          onValueChange={(val) => val && onYearChange(Number(val))}
          className="bg-muted rounded-lg p-1"
        >
          {availableYears.map((year) => (
            <ToggleGroupItem 
              key={year} 
              value={year.toString()}
              className="px-4 py-1.5 text-sm font-medium data-[state=on]:bg-primary data-[state=on]:text-primary-foreground rounded-md transition-all"
            >
              {year}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
};

export default YearSelector;
