import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_API_URL;

export const socket = io(URL, { autoConnect: false });

export function checkSolution(solution: string | null, code: string): boolean {
  if (!solution) {
    return false;
  }
  try {
    const codeEval = eval(code);
    const solutionEval = eval(solution);
    const isSolved = JSON.stringify(solutionEval) === JSON.stringify(codeEval);
    return isSolved;
  } catch (err) {
    console.log(err);
    return false;
  }
}
