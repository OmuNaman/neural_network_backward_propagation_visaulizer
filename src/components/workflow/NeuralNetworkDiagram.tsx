// FILE: src/components/workflow/NeuralNetworkDiagram.tsx
import { useTheme } from '@/components/ThemeProvider';
import { motion } from 'framer-motion';

interface NeuralNetworkDiagramProps {
  architecture: number[];
  activeNodeId: string | null;
}

const nodeProgressMap: Record<string, number> = {
  'input': 0,
  'calc-z1': 1,
  'activate-a1': 2,
  'calc-z2': 3,
  'activate-a2': 4,
  'calc-z3': 5,
  'activate-a3': 6,
};

export function NeuralNetworkDiagram({ architecture, activeNodeId }: NeuralNetworkDiagramProps) {
  const { isDark } = useTheme();
  const progress = activeNodeId ? nodeProgressMap[activeNodeId] ?? -1 : -1;

  const width = 800;
  const height = 200;
  const layerSpacing = width / (architecture.length + 1);

  const positions = architecture.map((numNeurons, i) => {
    const layerX = layerSpacing * (i + 1);
    const neuronYSpacing = height / (numNeurons + 1);
    return Array.from({ length: numNeurons }, (_, j) => ({
      x: layerX,
      y: neuronYSpacing * (j + 1),
    }));
  });

  const themeColors = {
    inactive: isDark ? 'rgba(100, 116, 139, 0.3)' : 'rgba(156, 163, 175, 0.4)',
    activeNeuron: isDark ? '#38bdf8' : '#0ea5e9',
    activeConnection: isDark ? '#a78bfa' : '#8b5cf6',
    pulse: isDark ? '#f0abfc' : '#e879f9',
  };

  return (
    <div className={`w-full h-full p-4 rounded-lg flex items-center justify-center transition-colors ${isDark ? 'bg-slate-900/50' : 'bg-slate-100'}`}>
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%">
        {/* --- REMOVED THE <defs> and <filter> SECTION --- */}

        {/* Connections */}
        {positions.slice(0, -1).map((layer, i) => {
          const isConnectionsActive = (progress === (i * 2) + 1);
          return layer.map((startNode, j) =>
            positions[i + 1].map((endNode, k) => (
              <g key={`group-${i}-${j}-${k}`}>
                <motion.line
                  x1={startNode.x} y1={startNode.y}
                  x2={endNode.x} y2={endNode.y}
                  stroke={isConnectionsActive ? themeColors.activeConnection : themeColors.inactive}
                  strokeWidth={isConnectionsActive ? 1.5 : 0.5}
                  transition={{ duration: 0.3 }}
                />
                {isConnectionsActive && (
                  <motion.circle
                    r="3"
                    fill={themeColors.pulse}
                    initial={{ cx: startNode.x, cy: startNode.y, opacity: 0 }}
                    animate={{ cx: endNode.x, cy: endNode.y, opacity: [0, 1, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "linear",
                      delay: (j * 0.1) + (k * 0.05),
                    }}
                  />
                )}
              </g>
            ))
          );
        })}

        {/* Neurons */}
        {positions.map((layer, i) => {
          const isLayerActive = (progress === (i * 2));
          return layer.map((node, j) => (
            <motion.circle
              key={`node-${i}-${j}`}
              cx={node.x}
              cy={node.y}
              r={isLayerActive ? 8 : 6}
              fill={isLayerActive ? themeColors.activeNeuron : themeColors.inactive}
              stroke={isLayerActive ? themeColors.activeNeuron : 'none'}
              strokeWidth={2}
              // --- THIS IS THE FIX: Using a drop-shadow filter ---
              style={{
                filter: isLayerActive
                  ? `drop-shadow(0 0 4px ${themeColors.activeNeuron})`
                  : 'none',
              }}
              // --- END OF FIX ---
              animate={{ scale: isLayerActive ? [1, 1.3, 1] : 1 }}
              transition={{
                duration: 1,
                repeat: isLayerActive ? Infinity : 0,
              }}
            />
          ));
        })}
      </svg>
    </div>
  );
}