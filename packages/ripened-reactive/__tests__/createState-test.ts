import { createDomElement } from "../../ripened-runtime/index";
import { createState } from "../state/createState";

describe("jsx", function () {
  test("setState updates the dom", async function () {
    const [count, setCount] = createState(0);
    const theString = () => `text ${count()} and ${count()}`;
    document.body.appendChild(
      createDomElement(
        "div",
        null,
        () => createDomElement("h2", null, "hello world"),
        () => createDomElement("h1", { id: "hey" }, null),
        () => createDomElement("p", { id: "yo" }, theString)
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
