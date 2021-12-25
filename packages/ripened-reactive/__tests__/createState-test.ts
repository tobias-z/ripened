import { createDomElement } from "../../ripened-runtime/index";
import { getDomNode } from "../../ripened-runtime/__tests__/utils";
import { createState } from "../state/createState";

describe("jsx", function () {
  test("setState updates the dom", async function () {
    const [count, setCount] = createState(0);
    const theString = () => `text ${count()} and ${count()}`;
    document.body.appendChild(
      createDomElement(
        "div",
        null,
        () => getDomNode("h2", null, "hello world"),
        () => getDomNode("h1", { id: "hey" }, null),
        () => getDomNode("p", { id: "yo" }, theString)
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
