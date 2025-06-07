
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { MatrixDisplay } from '@/components/MatrixDisplay';
import { useTheme } from '@/components/ThemeProvider';

interface MatrixNodeProps {
  data: {
    label: string;
    matrix: number[][];
    description: string;
    isInput?: boolean;
    headNumber?: number;
    headColor?: {
      primary: string;
      secondary: string;
      border: string;
    };
  };
}

export function MatrixNode({ data }: MatrixNodeProps) {
  const { isDark } = useTheme();
  
  // Apply head-specific styling if headNumber is provided
  const getHeadStyles = () => {
    if (!data.headNumber || !data.headColor) {
      return {
        borderColor: isDark ? '#475569' : '#e2e8f0',
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        shadowColor: 'rgba(0, 0, 0, 0.1)'
      };
    }

    return {
      borderColor: data.headColor.border,
      backgroundColor: isDark ? `${data.headColor.primary}10` : data.headColor.secondary,
      shadowColor: `${data.headColor.primary}40`
    };
  };

  const headStyles = getHeadStyles();
  
  return (
    <Card 
      className="min-w-[280px] transition-all duration-300 shadow-xl rounded-lg relative overflow-hidden"
      style={{
        borderColor: headStyles.borderColor,
        backgroundColor: headStyles.backgroundColor,
        borderWidth: data.headNumber ? '3px' : '1px',
        borderStyle: data.headNumber ? 'solid' : 'solid',
        boxShadow: `0 10px 25px ${headStyles.shadowColor}, 0 4px 10px ${headStyles.shadowColor}`
      }}
    >
      {/* Head indicator stripe */}
      {data.headNumber && (
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: data.headColor?.primary }}
        />
      )}
      
      <div className="p-4">
        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            {data.headNumber && (
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: data.headColor?.primary }}
              >
                {data.headNumber}
              </div>
            )}
            <h3 
              className={`font-semibold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
              style={data.headNumber ? { color: data.headColor?.primary } : {}}
            >
              {data.label}
            </h3>
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {data.description}
          </p>
        </div>
        
        <div className="flex justify-center">
          <MatrixDisplay matrix={data.matrix} /> 
        </div>
      </div>
      
      {!data.isInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 !border-2 rounded-full transition-colors duration-300"
          style={{
            backgroundColor: data.headColor?.primary || (isDark ? '#3b82f6' : '#3b82f6'),
            borderColor: isDark ? '#1e293b' : '#ffffff'
          }}
        />
      )}
      
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 !border-2 rounded-full transition-colors duration-300"
        style={{
          backgroundColor: data.headColor?.primary || (isDark ? '#8b5cf6' : '#8b5cf6'),
          borderColor: isDark ? '#1e293b' : '#ffffff'
        }}
      />
    </Card>
  );
}
