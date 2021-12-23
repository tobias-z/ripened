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

type HFunction = (
  element: HElement,
  props: Props,
  ...children: ChildrenFn | Children
) => HTMLElement | HTMLElement[] | string[];

export const createDomElement: HFunction = function (
  element,
  props,
  ...childrenFn
) {
  const config = getConfig();
  config.setNewId();
  config.assignCallback((id: number) => createDomNode(id, true));
  return createDomNode(undefined, false);

  function createDomNode(id: number | undefined, hasRendered: boolean) {
    let alreadyCreated: HTMLElement | undefined;
    if (id)
      alreadyCreated = document.querySelector(
        `[data-__id="${id}"]`
      ) as HTMLElement;
    const [children, isTextChildren]: [ReturnedChildren[], boolean] =
      getChildren(childrenFn);

    const domNode: HTMLElement | undefined | HTMLElement[] = alreadyCreated
      ? alreadyCreated
      : getDomNode(element, [isTextChildren, config.count], props, children);

    if (!domNode) {
      const theChildren = children[0] ? children : props?.children;
      return theChildren as HTMLElement[];
    }

    if (Array.isArray(domNode)) return domNode;

    if (props && typeof element === "string") {
      setProperties(props, domNode);
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
};

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
  return [children, children.some(hasHtmlElements)] as [
    ReturnedChildren[],
    boolean
  ];
}

function hasHtmlElements(child): boolean {
  if (Array.isArray(child)) {
    if (child.some((c) => c instanceof HTMLElement)) return false;
  }
  if (child instanceof HTMLElement) return false;
  return true;
}

function getDomNode(
  element: HElement,
  idStuff: [boolean, number | undefined],
  props?: Props,
  children?: ReturnedChildren[]
) {
  const [shouldGiveId, id] = idStuff;
  let domNode: HTMLElement | undefined;
  if (typeof element === "string") {
    domNode = document.createElement(element);
    if (shouldGiveId) domNode.dataset.__id = String(id);
  } else {
    const p = props ? props : {};
    if (children) p["children"] = children;
    domNode = element(p);
  }
  return domNode;
}

function appendNode(
  child:
    | string
    | string[]
    | number
    | number[]
    | HTMLElement
    | HTMLElement[]
    | HTMLElement[][],
  domNode: HTMLElement,
  hasRendered: boolean
) {
  if (child instanceof Node) {
    domNode.appendChild(child);
    return;
  }

  const textStrings: Array<string | number> = [];
  if (Array.isArray(child)) {
    for (const c of child) {
      if (Array.isArray(c)) {
        c.forEach((ce) => domNode.appendChild(ce));
      } else {
        if (c instanceof HTMLElement) domNode.appendChild(c);
        else textStrings.push(c);
      }
    }
  }

  if (typeof child === "string" || typeof child === "number") {
    const text = String(child);
    if (hasRendered) {
      domNode.innerText = text;
      return;
    }
    domNode.innerText = domNode.innerText ? domNode.innerText + text : text;
    return;
  }

  let textToUse = hasRendered ? domNode.innerText : "";
  for (const text in textStrings) {
    textToUse += text;
  }

  domNode.innerText = textToUse;
}

function setProperties(props: Record<string, any>, domNode: HTMLElement) {
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
