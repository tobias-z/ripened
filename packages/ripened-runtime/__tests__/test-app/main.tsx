import { render } from "../../jsx/render";
import Component from "./something";
import { createState } from "../../../ripened-reactive";

function Something() {
  const [count, setCount] = createState(0);
  const hello = <div>something</div>;

  hello.innerHTML += (<p>something else</p>).outerHTML;

  return (
    <div>
      <p>count: {count()}</p>
      <button onclick={() => setCount((c) => c + 1)}>increment</button>
      <a href="/somewhere">somewhere</a>
      {hello}
      <Component something="hello" yo={3} />
      <h1>Yoyoyo</h1>
      <p>this is a test2</p>
      <p>Hello</p>
      <h3>gogo world </h3>
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
    </div>
  );
}

render(<Something />, document.getElementById("root"));
