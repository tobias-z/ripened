import "../../globals";
import { render } from "../../jsx/render";
import Component from "./something";
import { createState } from "../../../ripened-reactive";

const [count, setCount] = createState(0);
const [items, setItems] = createState([15]);
const [isLoading, setIsLoading] = createState(true);

function Something() {
  setTimeout(() => setIsLoading(false), 2000);

  return (
    <div>
      <h1>Yoyoyo</h1>
      {isLoading() ? <p>Loading</p> : <p>Finished loading</p>}
      <Component something="hello" yo={3} />
      <p>this is a test2</p>
      <a href="/somewhere">somewhere</a>
      <ul>
        <li>Hello world</li>
        {items().map(item => (
          <li>{item}</li>
        ))}
        <li>Hello world</li>
      </ul>
      <button onclick={() => setItems([...items(), items().length + 1])}>
        add item
      </button>
      <h3>count: {count()} something else</h3>
      <button onclick={() => setCount(c => c + 1)}>increment</button>
      <p style={{ padding: "1px", color: "black" }}>Hello</p>
      <input
        id="input"
        name="something"
        value=""
        oninput={function (event) {
          console.log(this.value);
          console.log(event.currentTarget.value);
        }}
      />
      <p>Hello world</p>
      <p>Hello world</p>
      <p>Hello world</p>
      <p>Hello world</p>
      <p>Hello world</p>
      <p>Hello world</p>
    </div>
  );
}

render(<Something />, document.getElementById("root"));
