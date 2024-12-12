export const performanceTest = <T>(
  name: string,
  callback: (...args: any[]) => T
) => {
  const t0 = performance.now();
  const result = callback();
  const t1 = performance.now();
  console.log(`${name} took ${t1 - t0} milliseconds.`);
  return result;
};
