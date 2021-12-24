export type Component = (
  props?: Record<string, any>
) => (props?: any) => HTMLElement;
