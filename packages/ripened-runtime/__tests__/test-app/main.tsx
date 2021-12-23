import "../../globals";
import { render } from "../../jsx/render";
import Component from "./something";
import { createState } from "../../../ripened-reactive";

function Something() {
  const [count, setCount] = createState(0);
  const hello = (
    <div>
      something yoyo {count()} <p>Yo </p>
    </div>
  );

  hello.innerHTML += (<p>Hello world</p>).outerHTML;

  return (
    <div>
      <h3>
        count: {count()} something {""} else
      </h3>
      <h3>{count()}</h3>
      <button onclick={() => setCount((c) => c + 1)}>increment</button>
      <a href="/somewhere">somewhere</a>
      {hello}
      <Component something="hello" yo={3} />
      <h1>Yoyoyo</h1>
      <p>this is a test2</p>
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
