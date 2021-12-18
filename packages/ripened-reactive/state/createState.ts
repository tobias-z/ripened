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
  const id = Math.random();
  state = getNewState(state);

  function getNewState(state: T) {
    state = Object.assign(state, {
      getId() {
        return id;
      },
    });
    return state;
  }

  return [
    function () {
      return state;
    } as Getter<T>,
    function (value) {
      if (typeof value === "function") {
        state = getNewState(value(state));
      }
      if (typeof value !== "function") {
        state = getNewState(value);
        return;
      }
    },
  ] as [Getter<T>, Setter<T>];
}
