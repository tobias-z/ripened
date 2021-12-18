import { type FragmentFunction } from "../jsx/fragment";
import { h } from "../jsx/h";
import { type Component } from "../types/h";

export function getDomNode(
  element: string | Component | FragmentFunction = "h1",
  ...children
) {
  return h(element, null, children) as HTMLElement;
}

export function nodeWithChildren(
  node: string | Component,
  childCount: number,
  ...extraChildren: HTMLElement[] | string[]
) {
  const children = [];
  for (let i = 0; i < childCount; i++) children.push(getDomNode());
  return h(node, null, ...[children, extraChildren]) as HTMLElement;
}
