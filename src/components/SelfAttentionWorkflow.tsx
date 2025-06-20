import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  ReactFlow,
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { RotateCcw, ArrowRight, ArrowLeft, CheckCircle, TrendingUp, Cpu } from 'lucide-react';
import { MatrixNode } from '@/components/workflow/MatrixNode';
import { CalculationNode } from '@/components/workflow/CalculationNode';
import { ActivationNode } from '@/components/workflow/ActivationNode';
import { LayerBackgroundNode } from '@/components/workflow/LayerBackgroundNode';
import { ChatBot } from '@/components/ChatBot';
import { initialNodes as rawInitialNodes, initialEdges } from '@/utils/workflowData';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { NeuralNetworkDiagram } from './workflow/NeuralNetworkDiagram';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const nodeTypes = {
  matrix: MatrixNode,
  calculation: CalculationNode,
  activation: ActivationNode,
  layerBackground: LayerBackgroundNode,
};

const nodeSequence = [
  'input', 'calc-z1', 'activate-a1', 'calc-z2', 'activate-a2', 'calc-z3', 'activate-a3', 'calc-loss',
  'calc-dz3', 'calc-dw3', 'calc-db3', 'calc-dz2', 'calc-dw2', 'calc-db2', 'calc-dz1', 'calc-dw1', 'calc-db1'
];

function NeuralNetworkWorkflowContent({ isDark, onToggleTheme }: { isDark: boolean; onToggleTheme: (isDark: boolean) => void }) {
  const [completedNodeIds, setCompletedNodeIds] = useState<Set<string>>(new Set(['input']));
  const [showIntroModal, setShowIntroModal] = useState(true); // State to control the modal
  
  const handleNodeComplete = useCallback((nodeId: string) => {
    setCompletedNodeIds(prev => {
      const newSet = new Set(prev);
      newSet.add(nodeId);
      if (nodeId === 'calc-dz3') { newSet.add('calc-db3'); }
      if (nodeId === 'calc-dz2') { newSet.add('calc-db2'); }
      if (nodeId === 'calc-dz1') { newSet.add('calc-db1'); }
      return newSet;
    });
  }, []);

  const processedNodes = useMemo(() => {
    return rawInitialNodes.map(node => {
      let disabled = true;
      if (node.type === 'calculation' || node.type === 'activation') {
        switch (node.id) {
          case 'calc-z1': disabled = false; break;
          case 'activate-a1': disabled = !completedNodeIds.has('calc-z1'); break;
          case 'calc-z2': disabled = !completedNodeIds.has('activate-a1'); break;
          case 'activate-a2': disabled = !completedNodeIds.has('calc-z2'); break;
          case 'calc-z3': disabled = !completedNodeIds.has('activate-a2'); break;
          case 'activate-a3': disabled = !completedNodeIds.has('calc-z3'); break;
          case 'calc-loss': disabled = !completedNodeIds.has('activate-a3'); break;
          case 'calc-dz3': disabled = !completedNodeIds.has('calc-loss'); break;
          case 'calc-dw3': disabled = !completedNodeIds.has('calc-dz3'); break;
          case 'calc-db3': disabled = !completedNodeIds.has('calc-dz3'); break;
          case 'calc-dz2': disabled = !completedNodeIds.has('calc-dw3'); break;
          case 'calc-dw2': disabled = !completedNodeIds.has('calc-dz2'); break;
          case 'calc-db2': disabled = !completedNodeIds.has('calc-dz2'); break;
          case 'calc-dz1': disabled = !completedNodeIds.has('calc-dw2'); break;
          case 'calc-dw1': disabled = !completedNodeIds.has('calc-dz1'); break;
          case 'calc-db1': disabled = !completedNodeIds.has('calc-dz1'); break;
          default: disabled = true;
        }
        return { ...node, data: { ...node.data, onComplete: handleNodeComplete, disabled: disabled } };
      }
      return node;
    });
  }, [completedNodeIds, handleNodeComplete]);

  const [nodes, setNodes, onNodesChange] = useNodesState(processedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const resetWorkflow = () => { 
    setCompletedNodeIds(new Set(['input']));
    setShowIntroModal(true); // Show intro again on reset
  };
  
  useEffect(() => { setNodes(processedNodes); }, [completedNodeIds]);

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const activeNodeId = useMemo(() => {
    for (let i = nodeSequence.length - 1; i >= 0; i--) {
      if (completedNodeIds.has(nodeSequence[i])) return nodeSequence[i];
    }
    return 'input';
  }, [completedNodeIds]);

  return (
    <div className={`h-screen w-full flex flex-col transition-colors duration-300 relative overflow-hidden ${
       isDark ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'
    }`}>

      {/* --- INTRO MODAL --- */}
      <Dialog open={showIntroModal} onOpenChange={setShowIntroModal}>
        <DialogContent className="sm:max-w-[550px] bg-background/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <Cpu className="text-blue-500" />
              Welcome to the Neural Network Epoch!
            </DialogTitle>
            <DialogDescription className="pt-2 text-base">
              You're about to perform one full training epoch by hand. This will solidify your understanding of how a neural network actually learns.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-full"><ArrowRight className="w-5 h-5 text-blue-500" /></div>
              <div>
                <h3 className="font-semibold text-lg">Part 1: Forward Propagation</h3>
                <p className="text-sm text-muted-foreground">Calculate the network's prediction by passing the input through each layer, from left to right.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-green-500/10 rounded-full"><CheckCircle className="w-5 h-5 text-green-500" /></div>
              <div>
                <h3 className="font-semibold text-lg">Part 2: Loss Calculation</h3>
                <p className="text-sm text-muted-foreground">Compare the network's prediction to the correct answer to see how wrong it was.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-500/10 rounded-full"><ArrowLeft className="w-5 h-5 text-red-500" /></div>
              <div>
                <h3 className="font-semibold text-lg">Part 3: Backward Propagation</h3>
                <p className="text-sm text-muted-foreground">Work backwards from the loss to calculate the gradients, the signals that tell each weight and bias how to change to get better.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowIntroModal(false)} className="w-full">
              Let's Go
              <TrendingUp className="ml-2 w-4 h-4"/>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Header */}
      <div className={`shrink-0 sticky top-4 mx-4 z-50 flex items-center justify-between backdrop-blur-md shadow-lg rounded-lg p-4 transition-colors duration-300 ${
        isDark ? 'bg-slate-800/70 border-slate-700/50' : 'bg-white/80 border-slate-300/60'
      }`}>
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Neural Network: 1 Epoch
        </h1>
        <div className="flex items-center gap-4">
          <Button onClick={resetWorkflow} variant="outline" size="sm" className="flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Reset</Button>
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>
      </div>

      <ResizablePanelGroup direction="vertical" className="flex-grow rounded-lg border-none m-4 mt-2">
        <ResizablePanel defaultSize={65}>
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView className="workflow-canvas">
              <Background gap={24} size={1.5} color={isDark ? '#334155' : '#cbd5e1'} />
              <Controls />
            </ReactFlow>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={35}>
          <NeuralNetworkDiagram architecture={[2, 4, 4, 2]} activeNodeId={activeNodeId} />
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* <ChatBot isOpen={isChatOpen} /> */}
    </div>
  );
}

export function SelfAttentionWorkflow() {
  const [isDark, setIsDark] = useState(true);
  const handleThemeToggle = (newIsDark: boolean) => setIsDark(newIsDark);
  return (
    <ThemeProvider isDark={isDark}>
      <NeuralNetworkWorkflowContent isDark={isDark} onToggleTheme={handleThemeToggle} />
    </ThemeProvider>
  );
}
