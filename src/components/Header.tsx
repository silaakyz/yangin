import { Flame, TreePine } from 'lucide-react';

const Header = () => {
  return (
    <header className="gradient-header text-primary-foreground py-4 px-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <TreePine className="h-8 w-8" />
            <Flame className="h-4 w-4 absolute -bottom-1 -right-1 text-warning" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Orman Yangını İzleme Sistemi</h1>
            <p className="text-sm opacity-80">Bursa • Bilecik • Yalova Bölgesi</p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-primary-foreground/10 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Canlı İzleme</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
