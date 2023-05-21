// prettier-ignore
const rename = <O extends object, M extends Record<keyof any, keyof O>>(obj: O, map: M): Omit<O, M[keyof M]> & { [P in keyof M]: O[M[P]] } => {
  for (const [dest, src] of Object.entries(map)) {
    // @ts-ignore: restructing object
    obj[dest] = obj[src];
    delete obj[src];
  }

  // @ts-ignore: been consisted operation and type
  return obj;
};

export default {
  rename,
};
