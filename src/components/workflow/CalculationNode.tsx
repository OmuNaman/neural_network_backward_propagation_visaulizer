// FILE: src/components/workflow/CalculationNode.tsx

import { useState, useEffect, useRef } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MatrixInput } from '@/components/MatrixInput';
import { useTheme } from '@/components/ThemeProvider';
import { CheckCircle, Calculator, Lightbulb, Unlock, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface CalculationNodeProps {
  data: {
    label: string;
    formula: string;
    description: string;
    expectedMatrix: number[][];
    hint: string;
    onComplete?: (nodeId: string) => void;
    disabled?: boolean;
    headNumber?: number;
    headColor?: {
      primary: string;
      secondary: string;
      border: string;
    };
  };
  id: string;
}

export function CalculationNode({ data, id }: CalculationNodeProps) {
  const { isDark } = useTheme();
  const initialMatrix = () => Array(data.expectedMatrix.length).fill(null).map(() => 
    Array(data.expectedMatrix[0].length).fill(0)
  );
  
  const [userMatrix, setUserMatrix] = useState<number[][]>(initialMatrix());
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [errors, setErrors] = useState<boolean[][]>([]);

  useEffect(() => {
    if (!data.disabled) {
        setUserMatrix(initialMatrix());
        setIsCompleted(false);
        setErrors([]);
        setShowHint(false);
    }
  }, [data.disabled, data.expectedMatrix]);

  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctAudioRef.current = new Audio('/correct.mp3');
    wrongAudioRef.current = new Audio('/wrong.mp3');
    
    if (correctAudioRef.current) {
      correctAudioRef.current.load();
    }
    if (wrongAudioRef.current) {
      wrongAudioRef.current.load();
    }

    return () => {
      if (correctAudioRef.current) {
        correctAudioRef.current.pause();
        correctAudioRef.current.src = '';
      }
      if (wrongAudioRef.current) {
        wrongAudioRef.current.pause();
        wrongAudioRef.current.src = '';
      }
    };
  }, []);

  const playSound = (isCorrect: boolean) => {
    const audioElement = isCorrect ? correctAudioRef.current : wrongAudioRef.current;
    if (audioElement) {
      audioElement.currentTime = 0;
      const playPromise = audioElement.play();
      if (playPromise) {
        playPromise.catch((error) => {
          console.error('Error playing sound:', error);
        });
      }
    }
  };

  const validateMatrix = (matrixToValidate: number[][]) => {
    if (data.disabled || isCompleted) return true;

    const newErrors = Array(matrixToValidate.length).fill(null).map((_, rIdx) => 
      Array(matrixToValidate[0]?.length || 0).fill(false).map((__, cIdx) => {
         const userValue = matrixToValidate[rIdx]?.[cIdx] ?? 0;
         const expectedValue = data.expectedMatrix[rIdx]?.[cIdx] ?? NaN;
         const tolerance = 0.0001;
         return Math.abs(userValue - expectedValue) > tolerance;
      })
    );
    
    const allValid = newErrors.every(row => row.every(cellError => !cellError));
    setErrors(newErrors);
    
    if (allValid) {
      setIsCompleted(true);
      data.onComplete?.(id);
    }
    
    return allValid;
  };

  const handleMatrixChange = (newMatrix: number[][]) => {
    if (data.disabled || isCompleted) return;
    setUserMatrix(newMatrix);
  };

  const resetMatrix = () => {
    if (data.disabled || isCompleted) return;
    setUserMatrix(initialMatrix());
    setErrors([]);
  };

  const nodeIsEffectivelyReadonly = data.disabled;

  // Apply head-specific styling
  const getHeadStyles = () => {
    if (!data.headNumber || !data.headColor) {
      return {
        borderColor: isCompleted ? (isDark ? '#10b981' : '#059669') : (isDark ? '#475569' : '#e2e8f0'),
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        shadowColor: isCompleted ? 'rgba(16, 185, 129, 0.3)' : 'rgba(0, 0, 0, 0.1)'
      };
    }

    return {
      borderColor: isCompleted ? '#10b981' : data.headColor.border,
      backgroundColor: isDark ? `${data.headColor.primary}10` : data.headColor.secondary,
      shadowColor: isCompleted ? 'rgba(16, 185, 129, 0.3)' : `${data.headColor.primary}40`
    };
  };

  const headStyles = getHeadStyles();

  return (
    <Card 
      className="min-w-[320px] max-w-[400px] transition-all duration-300 relative shadow-xl rounded-lg overflow-hidden"
      style={{
        borderColor: headStyles.borderColor,
        backgroundColor: headStyles.backgroundColor,
        borderWidth: data.headNumber ? '3px' : isCompleted ? '2px' : '1px',
        borderStyle: 'solid',
        boxShadow: `0 10px 25px ${headStyles.shadowColor}, 0 4px 10px ${headStyles.shadowColor}`,
        opacity: data.disabled ? 0.7 : 1
      }}
    >
      {/* Head indicator stripe */}
      {data.headNumber && (
        <div 
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: isCompleted ? '#10b981' : data.headColor?.primary }}
        />
      )}

      <div className={`p-4 ${data.disabled ? 'pointer-events-none' : ''}`}>
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            {data.headNumber && (
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: isCompleted ? '#10b981' : data.headColor?.primary }}
              >
                {data.headNumber}
              </div>
            )}
            {isCompleted ? <Unlock className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} /> 
                         : <Calculator className={`w-5 h-5`} style={{ color: data.headColor?.primary || (isDark ? '#a855f7' : '#7c3aed') }} />}
            <h3 
              className={`font-semibold text-lg ${isDark ? 'text-slate-100' : 'text-slate-800'}`}
              style={data.headNumber && !isCompleted ? { color: data.headColor?.primary } : {}}
            >
              {data.label}
            </h3>
            {isCompleted && !data.disabled && (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} >
                <CheckCircle className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-500'}`} />
              </motion.div>
            )}
          </div>
          <p className={`text-sm ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {data.description}
          </p>
        </div>

        {/* --- THIS IS THE CHANGED PART --- */}
        <div className={`mb-4 p-3 border rounded-md text-center transition-colors duration-300 ${
          isDark ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-2xl font-handwritten ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
            {data.formula}
          </div>
        </div>
        {/* --- END OF CHANGED PART --- */}


        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setShowHint(!showHint)}
              variant="outline"
              size="sm"
              disabled={nodeIsEffectivelyReadonly}
              className={`flex items-center gap-1 transition-colors duration-150 ${
                isDark ? 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100 focus-visible:ring-slate-500 disabled:opacity-50' 
                       : 'text-slate-600 border-slate-300 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-slate-400 disabled:opacity-50'
              }`}
            >
              <Lightbulb className="w-3 h-3" />
              Hint
            </Button>
            <Button
              onClick={resetMatrix}
              variant="outline"
              size="sm"
              disabled={nodeIsEffectivelyReadonly}
              className={`flex items-center gap-1 transition-colors duration-150 ${
                isDark ? 'text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100 focus-visible:ring-slate-500 disabled:opacity-50' 
                       : 'text-slate-600 border-slate-300 hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-slate-400 disabled:opacity-50'
              }`}
            >
              Reset
            </Button>
          </div>

          <Button
            onClick={() => {
              const validationResult = validateMatrix(userMatrix);
              playSound(validationResult);
            }}
            variant="outline"
            size="sm"
            disabled={nodeIsEffectivelyReadonly || isCompleted}
            className={`flex items-center gap-1 transition-colors duration-150 ${
              isDark 
                ? 'text-emerald-300 border-emerald-600 hover:bg-emerald-700 hover:text-emerald-100 focus-visible:ring-emerald-500 disabled:opacity-50' 
                : 'text-emerald-600 border-emerald-300 hover:bg-emerald-100 hover:text-emerald-800 focus-visible:ring-emerald-400 disabled:opacity-50'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            Verify
          </Button>
        </div>

        {showHint && !data.disabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mb-4 p-3 border rounded-md transition-colors duration-300 ${
              isDark 
              ? 'bg-yellow-900/20 border-yellow-600/30' 
              : 'bg-yellow-50 border-yellow-300'
            }`}
          >
            <p className={`text-sm ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>{data.hint}</p>
          </motion.div>
        )}

        <div className="flex justify-center">
          <MatrixInput
            matrix={userMatrix}
            onChange={handleMatrixChange}
            errors={errors}
            readonly={data.disabled}
            isCompleted={isCompleted}
          />
        </div>

        {errors.some(row => row.some(cell => cell)) && !isCompleted && !data.disabled && (
          <div className={`mt-3 p-2 border rounded-md text-center transition-colors duration-300 ${
            isDark 
            ? 'bg-red-900/20 border-red-600/30'
            : 'bg-red-50 border-red-300'
          }`}>
            <p className={`text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>Some values are incorrect.</p>
          </div>
        )}
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 !border-2 rounded-full transition-colors duration-300"
        style={{
          backgroundColor: data.headColor?.primary || (isDark ? '#3b82f6' : '#3b82f6'),
          borderColor: isDark ? '#1e293b' : '#ffffff'
        }}
      />
      
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