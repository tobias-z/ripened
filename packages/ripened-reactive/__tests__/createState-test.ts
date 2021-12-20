import { h } from "../../ripened-runtime/index";
import { createState } from "../state/createState";

describe("jsx", function () {
  test("setState updates the dom", async function () {
    const [count, setCount] = createState(0);
    const theString = () => `text ${count()} and ${count()}`;
    document.body.appendChild(
      h(
        "div",
        null,
        () => h("h2", null, "hello world"),
        () => h("h1", { id: "hey" }, null),
        () => h("p", { id: "yo" }, theString)
      ) as HTMLElement
    );

    setCount(count() + 1);
    expect(document.getElementById("yo")?.innerText).toBe("text 1 and 1");

    // TODO: Implement batching
    setCount(count() + 1);
    setCount(count() + 1);

    expect(document.getElementById("yo")?.innerText).toBe("text 3 and 3");
  });
});
