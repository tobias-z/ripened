import { getConfig } from "@ripened/runtime";

type Getter<T> = () => T & {
  getId: () => number;
};

type Setter<T> = (value: T | ((value: T) => T)) => void;

// TODO: Fix this
// eslint-disable-next-line @typescript-eslint/ban-types
export function createState<T extends Object>(
  initialState: T
): [Getter<T>, Setter<T>] {
  let state: T = initialState;
  const elementIds = new Set<number>();

  return [
    function () {
      const config = getConfig();
      elementIds.add(config.count);
      return state;
    } as Getter<T>,
    function (value) {
      if (typeof value === "function") {
        state = value(state);
      }
      if (typeof value !== "function") {
        state = value;
      }
      const config = getConfig();
      for (const id of elementIds) {
        config.getCallback(id)?.(id);
      }
    },
  ] as [Getter<T>, Setter<T>];
}
