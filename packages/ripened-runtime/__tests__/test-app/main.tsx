import "../../globals";
import { render } from "../../jsx/render";
import Component from "./something";
import { createState } from "../../../ripened-reactive";

function Something() {
  const [count, setCount] = createState(0);
  const [items, setItems] = createState([15]);

  return (
    <div>
      <h1>Yoyoyo</h1>
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
      <h3>count : {count()}</h3>
      <button onclick={() => setCount(c => c + 1)}>increment</button>
      <p style={{ padding: "1px", color: "black" }}>Hello</p>
      <div>
        <>
          <h1>hello world</h1>
        </>
      </div>
      <input
        id="input"
        name="something"
        value=""
        onchange={function (event) {
          console.log(this.value);
          console.log(event.currentTarget.value);
        }}
      />
      <h3>
        <p>Hello world</p>
        <p>Hello world</p>
        <p>Hello world</p>
        <p>Hello world</p>
        <p>Hello world</p>
        <p>Hello world</p>
      </h3>
    </div>
  );
}

render(<Something />, document.getElementById("root"));
