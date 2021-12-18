type EventFunction<T extends Node> = (
  this: T,
  event: Event & {
    currentTarget: T;
  }
) => void;

declare global {
  // https://stackoverflow.com/questions/43080547/how-to-override-type-properties-in-typescript
  type Overwrite<T, U> = Pick<T, Exclude<keyof T, keyof U>> & U;

  type DOMElement<T extends Node> = Partial<
    Overwrite<
      T,
      {
        class: string;
        children: HTMLElement[] | HTMLElement | string;
        style: Partial<CSSStyleDeclaration>;
        oninput: EventFunction<T>;
        onchange: EventFunction<T>;
        __something: string;
      }
    >
  >;
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    /* @ts-ignore */
    type Element = Node &
      HTMLElement & {
        [K in keyof string]: never;
      };

    interface IntrinsicElements {
      a: DOMElement<HTMLAnchorElement>;
      abbr: DOMElement<HTMLElement>;
      address: DOMElement<HTMLElement>;
      area: DOMElement<HTMLAreaElement>;
      article: DOMElement<HTMLElement>;
      aside: DOMElement<HTMLElement>;
      audio: DOMElement<HTMLAudioElement>;
      b: DOMElement<HTMLElement>;
      base: DOMElement<HTMLBaseElement>;
      bdo: DOMElement<HTMLElement>;
      blockquote: DOMElement<HTMLQuoteElement>;
      body: DOMElement<HTMLBodyElement>;
      br: DOMElement<HTMLBRElement>;
      button: DOMElement<HTMLButtonElement>;
      canvas: DOMElement<HTMLCanvasElement>;
      caption: DOMElement<HTMLTableCaptionElement>;
      cite: DOMElement<HTMLElement>;
      code: DOMElement<HTMLElement>;
      col: DOMElement<HTMLTableColElement>;
      colgroup: DOMElement<HTMLTableColElement>;
      datalist: DOMElement<HTMLDataListElement>;
      dd: DOMElement<HTMLElement>;
      del: DOMElement<HTMLModElement>;
      details: DOMElement<HTMLDetailsElement>;
      dfn: DOMElement<HTMLElement>;
      dialog: DOMElement<HTMLDialogElement>;
      div: DOMElement<HTMLDivElement>;
      dl: DOMElement<HTMLDListElement>;
      dt: DOMElement<HTMLElement>;
      em: DOMElement<HTMLElement>;
      embed: DOMElement<HTMLEmbedElement>;
      fieldset: DOMElement<HTMLFieldSetElement>;
      figcaption: DOMElement<HTMLElement>;
      figure: DOMElement<HTMLElement>;
      form: DOMElement<HTMLFormElement>;
      frame: DOMElement<HTMLFrameElement>;
      frameset: DOMElement<HTMLFrameSetElement>;
      h1: DOMElement<HTMLHeadingElement>;
      h2: DOMElement<HTMLHeadingElement>;
      h3: DOMElement<HTMLHeadingElement>;
      h4: DOMElement<HTMLHeadingElement>;
      h5: DOMElement<HTMLHeadingElement>;
      h6: DOMElement<HTMLHeadingElement>;
      head: DOMElement<HTMLHeadElement>;
      header: DOMElement<HTMLElement>;
      hgroup: DOMElement<HTMLElement>;
      hr: DOMElement<HTMLHRElement>;
      html: DOMElement<HTMLHtmlElement>;
      i: DOMElement<HTMLElement>;
      iframe: DOMElement<HTMLIFrameElement>;
      img: DOMElement<HTMLImageElement>;
      input: DOMElement<HTMLInputElement>;
      isn: DOMElement<HTMLModElement>;
      kbd: DOMElement<HTMLElement>;
      label: DOMElement<HTMLLabelElement>;
      legend: DOMElement<HTMLLegendElement>;
      li: DOMElement<HTMLLIElement>;
      link: DOMElement<HTMLLinkElement>;
      map: DOMElement<HTMLMapElement>;
      mark: DOMElement<HTMLElement>;
      menu: DOMElement<HTMLMenuElement>;
      meta: DOMElement<HTMLMetaElement>;
      meter: DOMElement<HTMLMeterElement>;
      nav: DOMElement<HTMLElement>;
      noscript: DOMElement<HTMLElement>;
      object: DOMElement<HTMLObjectElement>;
      ol: DOMElement<HTMLOListElement>;
      optgroup: DOMElement<HTMLOptGroupElement>;
      p: DOMElement<HTMLParagraphElement>;
      param: DOMElement<HTMLParamElement>;
      pre: DOMElement<HTMLPreElement>;
      progress: DOMElement<HTMLProgressElement>;
      q: DOMElement<HTMLQuoteElement>;
      rp: DOMElement<HTMLElement>;
      rt: DOMElement<HTMLElement>;
      ruby: DOMElement<HTMLElement>;
      s: DOMElement<HTMLElement>;
      samp: DOMElement<HTMLElement>;
      script: DOMElement<HTMLScriptElement>;
      section: DOMElement<HTMLElement>;
      select: DOMElement<HTMLSelectElement>;
      small: DOMElement<HTMLElement>;
      source: DOMElement<HTMLSourceElement>;
      span: DOMElement<HTMLSpanElement>;
      strong: DOMElement<HTMLElement>;
      style: DOMElement<HTMLStyleElement>;
      sub: DOMElement<HTMLElement>;
      sup: DOMElement<HTMLElement>;
      table: DOMElement<HTMLTableElement>;
      tbody: DOMElement<HTMLTableSectionElement>;
      td: DOMElement<HTMLTableCellElement>;
      textarea: DOMElement<HTMLTextAreaElement>;
      tfoot: DOMElement<HTMLTableSectionElement>;
      th: DOMElement<HTMLTableCellElement>;
      thead: DOMElement<HTMLTableSectionElement>;
      time: DOMElement<HTMLTimeElement>;
      title: DOMElement<HTMLTitleElement>;
      tr: DOMElement<HTMLTableRowElement>;
      track: DOMElement<HTMLTrackElement>;
      u: DOMElement<HTMLElement>;
      ul: DOMElement<HTMLUListElement>;
      var: DOMElement<HTMLElement>;
      video: DOMElement<HTMLVideoElement>;
      wbr: DOMElement<HTMLElement>;
    }
  }
}

export function createGlobals() {
  return;
}
