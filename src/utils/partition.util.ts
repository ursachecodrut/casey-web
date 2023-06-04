/**
 * Partition an array into two arrays based on a predicate.
 * @example
 * partition([1, 2, 3, 4, 5], (item) => item % 2 === 0);
 * // [[2, 4], [1, 3, 5]]
 *
 * partition([1, 2, 3, 4, 5], (item) => item % 2 === 1);
 * // [[1, 3, 5], [2, 4]]
 *
 * @param array
 * @param predicate
 * @returns [array, array]
 */
export const partition = <T>(
  array: T[],
  predicate: (item: T) => boolean
): [T[], T[]] => {
  return array.reduce<[T[], T[]]>(
    ([pass, fail], item) => {
      return predicate(item)
        ? [[...pass, item], fail]
        : [pass, [...fail, item]];
    },
    [[], []]
  );
};
