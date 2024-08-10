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
    return false;
  }
}
