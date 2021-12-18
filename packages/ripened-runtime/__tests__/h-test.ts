import { h } from "../jsx/h";
import { Fragment } from "../jsx/fragment";
import { getDomNode, nodeWithChildren } from "./utils";

describe("default dom nodes", function () {
  test("h renders a dom node with text", function () {
    const text = "hello world";
    const dom = getDomNode("h1", text);
    expect(dom.innerText).toEqual(text);
  });

  test("h renders a dom node with child nodes", function () {
    const dom = nodeWithChildren("div", 3);
    expect(dom.childElementCount).toBe(3);
  });
});

describe("components", function () {
  test("h renders a component with a node in it", function () {
    const Component = () => getDomNode();
    const text = "hello world";
    const dom = getDomNode(Component, text);
    expect(dom.innerText).toBe(text);
  });

  test("h renders a component with a node with children", function () {
    const dom = nodeWithChildren("div", 3);
    expect(dom.childElementCount).toBe(3);
  });

  test("h puts fragment under domnode", function () {
    const Component = () => nodeWithChildren(Fragment, 3);
    const dom = getDomNode("div", getDomNode(Component));
    expect(dom.childElementCount).toBe(3);
  });

  test("component can render other components", function () {
    const A = (props: any) => getDomNode(Fragment, props.children);
    const B = () =>
      getDomNode("div", h(A, null, getDomNode("h1"), getDomNode("h1")));
    const dom = getDomNode("div", getDomNode(B));
    // <div><div>
    //    <h1></h1><h1></h1>
    // </div></div>
    expect(dom.firstChild.childNodes.length).toBe(2);
  });
});
