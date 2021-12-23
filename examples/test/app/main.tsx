import { render } from "@ripened/runtime";
import { createState } from "@ripened/reactive";

function App() {
  const [count, setCount] = createState(1);

  const increment = () => setCount(c => c + 1);

  return (
    <div>
      <div>
        <h1 onclick={increment}>count: {count()}</h1>
      </div>
      <div>Hello world</div>
    </div>
  );
}

render(<App />, document.getElementById("root"));
