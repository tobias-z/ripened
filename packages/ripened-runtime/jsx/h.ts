import type { FragmentFunction } from "./fragment";
import type { Component } from "../types/h";
import invariant from "../utils/invariant";

type HElement = string | Component | FragmentFunction;
type Props = Record<string, any> | null;
type Children =
  | HTMLElement[]
  | HTMLElement[][]
  | HTMLElement[][][]
  | string[]
  | number[];

export function h(
  element: HElement,
  props: Props,
  ...children: Children
): HTMLElement | HTMLElement[] | string[] {
  const domNode = getDomNode(element, props, children);
  if (!domNode) {
    const theChildren = children[0] ? children : props?.children;
    invariant(theChildren, "A fragment was used without any children");
    if (Array.isArray(theChildren[0])) {
      return theChildren;
    }
    return theChildren as HTMLElement[];
  }
  if (Array.isArray(domNode)) return domNode;

  if (props && typeof element === "string") {
    for (const [key, value] of Object.entries(props)) {
      if (key === "style") {
        for (const [style, styleValue] of Object.entries(props.style)) {
          domNode.style[style] = styleValue;
        }
        continue;
      }
      if (key === "class") {
        domNode.className = value;
        continue;
      }
      domNode[key] = value;
    }
  }

  if (children.length === 0) return domNode;

  for (const child of children) {
    if (Array.isArray(child)) {
      for (const c of child) {
        if (Array.isArray(c)) c.forEach((ce) => appendNode(ce, domNode));
        else appendNode(c, domNode);
      }
      continue;
    }
    appendNode(child, domNode);
  }

  return domNode;
}

function getDomNode(element: HElement, props?: Props, children?: Children) {
  let domNode: HTMLElement | undefined;
  if (typeof element === "string") {
    domNode = document.createElement(element);
  } else {
    const p = props ? props : {};
    if (children) p["children"] = children;
    domNode = element(p);
  }
  return domNode;
}

function appendNode(
  child: string | number | HTMLElement | HTMLElement[] | HTMLElement[][],
  domNode: HTMLElement
) {
  if (child instanceof Node) {
    domNode.appendChild(child);
    return;
  }

  if (Array.isArray(child)) {
    for (const c of child) {
      if (Array.isArray(c)) {
        c.forEach((ce) => domNode.appendChild(ce));
      } else {
        domNode.appendChild(c);
      }
    }
    return;
  }

  setInnerText(domNode, child);
}

function setInnerText(domNode: HTMLElement, theText: string | number) {
  const STATE_ID_REGEX = /<#([{"id": \d, "value": \w}]+)#>/;

  if (typeof theText === "number") theText = String(theText);

  const stateIds: number[] = [];
  let finalString = "";
  let match = theText.match(STATE_ID_REGEX);
  while (match) {
    const stateObject: { id: number; value: string | number } = JSON.parse(
      match[1]
    );
    console.log(stateObject);
    stateIds.push(stateObject.id);
    finalString += theText.substring(0, match.index) + stateObject.value;
    theText = theText.substring(match.index! + match[1].length + 4);
    match = theText.match(STATE_ID_REGEX);
  }
  if (theText.length > 0) finalString += theText;
  if (stateIds.length > 0) domNode.dataset.ids = JSON.stringify(stateIds);

  domNode.innerText = domNode.innerText
    ? domNode.innerText + finalString
    : finalString;
}
