// FILE: src/components/workflow/LayerBackgroundNode.tsx
import { useTheme } from '@/components/ThemeProvider';

interface LayerBackgroundNodeProps {
  data: {
    label: string;
    color: {
      light: string;
      dark: string;
    };
  };
}

export function LayerBackgroundNode({ data }: LayerBackgroundNodeProps) {
  const { isDark } = useTheme();

  return (
    <div
      className="rounded-2xl shadow-inner transition-colors duration-300 pointer-events-none"
      style={{
        backgroundColor: isDark ? data.color.dark : data.color.light,
        border: `2px dashed ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`
      }}
    >
      <div 
        className={`px-4 py-1 text-lg font-bold opacity-40 ${
          isDark ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        {data.label}
      </div>
    </div>
  );
}