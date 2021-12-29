import type { FragmentFunction } from "./fragment";
import type { Component } from "../types/h";
import { getConfig } from "./config";

type HElement = string | Component | FragmentFunction;
type Props = Record<string, any> | null;

// TODO: There has to be a better way?
type Children = string[] | HTMLElement[] | string[][] | HTMLElement[][];
type ReturnedChildren = string | number | HTMLElement | HTMLElement[];
type ChildrenFn =
  | Array<() => ReturnedChildren>
  | Array<() => Array<() => ReturnedChildren>>
  | Array<() => () => ReturnedChildren>
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
  config.addObservable((id: number) => createDomNode(id));
  return createDomNode(undefined);

  function createDomNode(id: number | undefined) {
    // TODO: Move config to return the html element
    let alreadyCreated: HTMLElement | undefined;
    if (id)
      alreadyCreated = document.querySelector(
        `[data-__id="${id}"]`
      ) as HTMLElement;

    // we have to cache count here because getChildren might increment it
    const count = id ? id : config.count;

    const [children, isTextChildren, isMappedData]: [
      ReturnedChildren[],
      boolean,
      boolean
    ] = getChildren(childrenFn);

    const domNode: HTMLElement | undefined | HTMLElement[] = alreadyCreated
      ? alreadyCreated
      : getDomNode(
          element,
          [isTextChildren || isMappedData, count],
          props,
          children
        );

    if (!domNode) {
      const theChildren = children[0] ? children : props?.children;
      return theChildren as HTMLElement[];
    }

    if (alreadyCreated && domNode.hasChildNodes()) removeAllChildNodes(domNode);

    if (Array.isArray(domNode)) return domNode;

    if (props && typeof element === "string") {
      setProperties(props, domNode);
    }

    if (Array.isArray(children) && children.length === 0) return domNode;

    if (!Array.isArray(children)) {
      return domNode;
    }

    appendNode(children, domNode);

    return domNode;
  }
};

function getChildren(childrenFn: ChildrenFn | Children) {
  const children: ReturnedChildren[] = [];
  let isMappedData = false;
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
      let c = child();
      if (Array.isArray(c)) {
        for (const ce of c) {
          if (typeof ce !== "function") continue;
          isMappedData = true;
          children.push(ce());
        }
        continue;
      }
      if (typeof c === "function") {
        getConfig().delayIncrement();
        children.push(c());
        continue;
      }
      children.push(c);
      continue;
    }
    children.push(child);
  }
  return [children, children.some(hasHtmlElements), isMappedData] as [
    ReturnedChildren[],
    boolean,
    boolean
  ];
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
    let p = {};
    if (props && typeof props === "object") p = props;
    if (children) p["children"] = children;
    domNode = element(p)?.(p);
  }
  return domNode;
}

function appendNode(child: ReturnedChildren[], domNode: HTMLElement) {
  const textStrings: Array<string | number> = [];
  for (const c of child) {
    if (Array.isArray(c)) {
      for (const ce of c) {
        if (Array.isArray(ce)) {
          ce.forEach(c => domNode.appendChild(c));
          continue;
        }

        domNode.appendChild(ce);
      }
      continue;
    }
    if (c instanceof HTMLElement) {
      domNode.appendChild(c);
    } else textStrings.push(c);
  }

  if (textStrings.length > 0) domNode.innerText = textStrings.join("");
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

// --- Utils ---

function removeAllChildNodes(parent: HTMLElement) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function hasHtmlElements(child): boolean {
  if (Array.isArray(child)) {
    if (child.some(c => c instanceof HTMLElement)) return false;
  }
  if (child instanceof HTMLElement) return false;
  return true;
}
