import type { FragmentFunction } from "./fragment";
import type { Component } from "../types/h";
import { getConfig } from "./config";

type HElement = string | Component | FragmentFunction;
type Props = Record<string, any> | null;

// TODO: There has to be a better way?
type Children = string[] | HTMLElement[] | string[][] | HTMLElement[][];
type ReturnedChildren = string | HTMLElement | string[] | HTMLElement[];
type ChildrenFn =
  | Array<() => ReturnedChildren>
  | Array<Array<() => ReturnedChildren>>;

export function h(
  element: HElement,
  props: Props,
  ...childrenFn: ChildrenFn | Children
): HTMLElement | HTMLElement[] | string[] {
  const config = getConfig();
  config.setNewId();
  config.assignCallback((id: number) => createDomNode(id, true));
  return createDomNode(config.count, false);

  function createDomNode(id: number, hasRendered: boolean) {
    const alreadyCreated = document.querySelector(
      `[data-__id="${id}"]`
    ) as HTMLElement;
    const children: ReturnedChildren[] = getChildren(childrenFn);
    const domNode = alreadyCreated
      ? alreadyCreated
      : getDomNode(element, id, props, children);
    if (!domNode) {
      const theChildren = children[0] ? children : props?.children;
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

    if (Array.isArray(children) && children.length === 0) return domNode;

    if (!Array.isArray(children)) {
      return domNode;
    }

    for (const child of children) {
      if (Array.isArray(child)) {
        for (const c of child) {
          if (Array.isArray(c))
            c.forEach((ce) => appendNode(ce, domNode, hasRendered));
          else appendNode(c, domNode, hasRendered);
        }
        continue;
      }
      appendNode(child, domNode, hasRendered);
    }

    return domNode;
  }
}

function getChildren(childrenFn: ChildrenFn | Children) {
  const children: ReturnedChildren[] = [];
  for (const child of childrenFn) {
    if (Array.isArray(child)) {
      for (const c of child) {
        if (typeof c === "function") {
          children.push(c());
        } else {
          children.push(c);
        }
      }
      continue;
    }
    if (typeof child === "function") {
      children.push(child());
      continue;
    }
    children.push(child);
  }
  return children;
}

function getDomNode(
  element: HElement,
  count: number,
  props?: Props,
  children?: ReturnedChildren[]
) {
  let domNode: HTMLElement | undefined;
  if (typeof element === "string") {
    domNode = document.createElement(element);
    domNode.dataset.__id = String(count);
  } else {
    const p = props ? props : {};
    if (children) p["children"] = children;
    domNode = element(p);
  }
  return domNode;
}

function appendNode(
  child: string | number | HTMLElement | HTMLElement[] | HTMLElement[][],
  domNode: HTMLElement,
  hasRendered: boolean
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

  setInnerText(domNode, child, hasRendered);
}

function setInnerText(
  domNode: HTMLElement,
  theText: string | number | object,
  hasRendered: boolean
) {
  const text = String(theText);
  if (hasRendered) {
    domNode.innerText = text;
    return;
  }
  domNode.innerText = domNode.innerText ? domNode.innerText + text : text;
}
