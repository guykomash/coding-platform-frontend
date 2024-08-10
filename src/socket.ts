import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_SERVER_API_URL;

export const socket = io(URL, { autoConnect: false });

export function checkSolution(solution: string | null, code: string): boolean {
  if (!solution) {
    console.log('no solution');
    return false;
  }
  try {
    console.log(solution);
    // console.log('-------------');
    // evaluate and see if match.
    const codeEval = eval(code);
    console.log('codeEval', codeEval);
    const solutionEval = eval(solution);
    console.log('solEval', solutionEval);
    const isSolved = JSON.stringify(solutionEval) === JSON.stringify(codeEval);
    console.log(isSolved);
    return isSolved;
  } catch (err) {
    console.log(err);
    return false;
  }
}
