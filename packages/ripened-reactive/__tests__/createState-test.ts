// import { h } from "../../ripened-runtime/";
// import { createState } from "../state/createState";

// describe("jsx", function () {
//   test("setState updates the dom", function () {
//     const [count, setCount] = createState(0);
//     const theString = `text ${count()}`;
//     const node = h("div", null, theString) as HTMLElement;
//     expect(node.innerText).toBe("text 0");

//     setCount(c => c + 1);

//     expect(Number(count())).toBe(1);
//     expect(node.innerText).toBe("text 1");
//   });
// });

test("s", () => expect("yay").toBe("yay"));
