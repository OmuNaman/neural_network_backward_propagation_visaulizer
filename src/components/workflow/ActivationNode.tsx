// FILE: src/components/workflow/ActivationNode.tsx
import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MatrixInput } from '@/components/MatrixInput';
import { useTheme } from '@/components/ThemeProvider';
import { Zap, CheckCircle, Lightbulb, CheckCircle2, RotateCcw } from 'lucide-react'; // Added RotateCcw
import { motion } from 'framer-motion';

interface ActivationNodeProps {
  data: {
    label: string;
    formula: string;
    description: string;
    expectedMatrix: number[][];
    onComplete?: (nodeId: string) => void;
    disabled?: boolean;
  };
  id: string;
}

export function ActivationNode({ data, id }: ActivationNodeProps) {
  const { isDark } = useTheme();
  const initialMatrix = () => Array(data.expectedMatrix.length).fill(null).map(() => 
    Array(data.expectedMatrix[0].length).fill(0)
  );

  const [userMatrix, setUserMatrix] = useState<number[][]>(initialMatrix());
  const [isCompleted, setIsCompleted] = useState(false);
  const [errors, setErrors] = useState<boolean[][]>([]);

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctAudioRef.current = new Audio('/correct.mp3');
    wrongAudioRef.current = new Audio('/wrong.mp3');
    correctAudioRef.current.load();
    wrongAudioRef.current.load();
  }, []);

  const playSound = (isCorrect: boolean) => {
    const audioElement = isCorrect ? correctAudioRef.current : wrongAudioRef.current;
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play().catch(e => console.error("Error playing sound:", e));
    }
  };

  useEffect(() => {
    if (data.disabled) return;
    setUserMatrix(initialMatrix());
    setIsCompleted(false);
    setErrors([]);
  }, [data.disabled, data.expectedMatrix]);
  
  const validateMatrix = (matrixToValidate: number[][]) => {
    if (data.disabled || isCompleted) return true;

    const newErrors = matrixToValidate.map((row, rIdx) => 
      row.map((cell, cIdx) => {
         const userValue = cell ?? 0;
         const expectedValue = data.expectedMatrix[rIdx]?.[cIdx] ?? NaN;
         const tolerance = 0.0001;
         return Math.abs(userValue - expectedValue) > tolerance;
      })
    );
    
    const allValid = newErrors.every(row => row.every(cellError => !cellError));
    setErrors(newErrors);
    
    playSound(allValid); 
    
    if (allValid) {
      setIsCompleted(true);
      data.onComplete?.(id);
    }
    
    return allValid;
  };

  // --- ADDED RESET FUNCTION ---
  const resetMatrix = () => {
    if (data.disabled || isCompleted) return;
    setUserMatrix(initialMatrix());
    setErrors([]);
  };

  return (
    <Card 
      className={`min-w-[320px] max-w-[400px] transition-all duration-300 relative shadow-xl rounded-lg overflow-hidden border-2 ${
        isCompleted ? 'border-green-500' : (isDark ? 'border-amber-500/50' : 'border-amber-400')
      } ${
        isDark ? 'bg-slate-800/80' : 'bg-white/90'
      }`}
      style={{
        opacity: data.disabled ? 0.7 : 1
      }}
    >
      <div className={`p-4 ${data.disabled ? 'pointer-events-none' : ''}`}>
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className={`w-5 h-5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} />
            <h3 className={`font-semibold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              {data.label}
            </h3>
            {isCompleted && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} >
                <CheckCircle className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
              </motion.div>
            )}
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {data.description}
          </p>
        </div>

        <div className={`mb-4 p-3 border rounded-md text-center transition-colors duration-300 ${
          isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-2xl font-handwritten ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>
            {data.formula}
          </div>
        </div>
        
        {/* --- ADDED RESET BUTTON HERE --- */}
        <div className="flex justify-between items-center mb-4 gap-2">
            <Button
              onClick={resetMatrix}
              variant="outline"
              size="sm"
              disabled={data.disabled || isCompleted}
              className={`flex items-center gap-1 transition-colors duration-150 ${
                isDark ? 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100 disabled:opacity-50' 
                       : 'text-slate-600 border-slate-300 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-50'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </Button>
            <Button
              onClick={() => {
                validateMatrix(userMatrix);
              }}
              variant="outline"
              size="sm"
              disabled={data.disabled || isCompleted}
              className={`flex items-center gap-1 transition-colors duration-150 ${
                isDark 
                  ? 'text-emerald-300 border-emerald-600 hover:bg-emerald-700 hover:text-emerald-100 disabled:opacity-50' 
                  : 'text-emerald-600 border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800 disabled:opacity-50'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              Verify
            </Button>
        </div>

        <div className="flex justify-center">
          <MatrixInput
            matrix={userMatrix}
            onChange={setUserMatrix}
            errors={errors}
            readonly={data.disabled}
            isCompleted={isCompleted}
          />
        </div>
      </div>
      
      <Handle type="target" position={Position.Left} className="!bg-amber-500" />
      <Handle type="source" position={Position.Right} className="!bg-amber-500" />
    </Card>
  );
}