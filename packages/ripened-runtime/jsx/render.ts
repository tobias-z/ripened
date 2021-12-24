export function render(app: () => any, rootElement: HTMLElement) {
  rootElement.appendChild(app()());
}
