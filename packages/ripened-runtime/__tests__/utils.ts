import { type FragmentFunction } from "../jsx/fragment";
import { createDomElement } from "../jsx/createDomElement";
import { type Component } from "../types/h";

export function getDomNode(
  element: string | Component | FragmentFunction = "h1",
  props: any = {},
  ...children: any
) {
  return createDomElement(element, props, children) as HTMLElement;
}

export function nodeWithChildren(node: string | Component, childCount: number) {
  const children = [];
  for (let i = 0; i < childCount; i++) children.push(getDomNode());
  return createDomElement(node, null, ...children) as HTMLElement;
}
