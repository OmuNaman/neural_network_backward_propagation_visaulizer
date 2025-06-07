// FILE: src/utils/matrixCalculations.ts

// --- Neural Network Parameters ---
// Architecture: 2 -> 4 -> 4 -> 2

// Sample Input (1x2 matrix)
export const NN_INPUT = [[0.5, -0.2]];

// The "Correct Answer" for this input
export const Y_TRUE = [[0, 1]]; // Class 2 is the correct one

// Layer 1: 2x4
export const NN_W1 = [
  [0.1, 0.4, -0.2, 0.7],
  [0.3, -0.5, 0.6, -0.1]
];
export const NN_B1 = [[0.1, 0.2, 0.1, -0.3]];

// Layer 2: 4x4
export const NN_W2 = [
  [0.4, -0.2, 0.1, 0.5],
  [-0.1, 0.3, -0.5, 0.2],
  [0.7, -0.3, 0.2, -0.1],
  [0.2, 0.6, -0.4, 0.3]
];
export const NN_B2 = [[-0.2, 0.1, 0.3, -0.1]];

// Layer 3 (Output): 4x2
export const NN_W3 = [
  [0.2, -0.1],
  [-0.3, 0.5],
  [0.6, -0.2],
  [-0.1, 0.4]
];
export const NN_B3 = [[0.1, -0.2]];


// --- Math Helpers ---

export function matrixMultiply(a: number[][], b: number[][]): number[][] {
  const resultRows = a.length;
  const resultCols = b[0].length;
  const innerDim = b.length;

  if (a[0].length !== b.length) {
    console.error("Matrix dimensions incompatible for multiplication:", a[0].length, "vs", b.length);
    return Array(resultRows).fill(null).map(() => Array(resultCols).fill(NaN));
  }

  const result = Array(resultRows).fill(null).map(() => Array(resultCols).fill(0));
  
  for (let i = 0; i < resultRows; i++) {
    for (let j = 0; j < resultCols; j++) {
      for (let k = 0; k < innerDim; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  
  return result;
}

export function matrixAdd(a: number[][], b: number[][]): number[][] {
  if (a.length !== b.length || a[0].length !== b[0].length) { return a; }
  return a.map((row, i) => row.map((val, j) => val + b[i][j]));
}

export function matrixSubtract(a: number[][], b: number[][]): number[][] {
  if (a.length !== b.length || a[0].length !== b[0].length) { return a; }
  return a.map((row, i) => row.map((val, j) => val - b[i][j]));
}

export function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

export function elementWiseMultiply(a: number[][], b: number[][]): number[][] {
  if (a.length !== b.length || a[0].length !== b[0].length) { return a; }
  return a.map((row, i) => row.map((val, j) => val * b[i][j]));
}


// Activation Functions & Derivatives
export function relu(matrix: number[][]): number[][] {
  return matrix.map(row => row.map(val => Math.max(0, val)));
}

export function relu_derivative(matrix: number[][]): number[][] {
  return matrix.map(row => row.map(val => (val > 0 ? 1 : 0)));
}

export function softmax(matrix: number[][]): number[][] {
  return matrix.map(row => {
    const maxVal = Math.max(...row);
    const expRow = row.map(x => Math.exp(x - maxVal));
    const sum = expRow.reduce((acc, val) => acc + val, 0);
    if (sum === 0) return row.map(() => 1 / row.length);
    return expRow.map(x => x / sum);
  });
}

// Loss Function
export function crossEntropyLoss(y_pred: number[][], y_true: number[][]): number[][] {
  let loss = 0;
  for (let i = 0; i < y_pred[0].length; i++) {
    const epsilon = 1e-12;
    loss += y_true[0][i] * Math.log(y_pred[0][i] + epsilon);
  }
  return [[-loss]];
}