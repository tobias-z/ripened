(() => {
  // ../../build/@ripened/runtime/jsx/config.js
  var Config = class {
    constructor() {
      this._count = 0;
      this._callbacks = /* @__PURE__ */ new Map();
    }
    static getInstance() {
      if (!Config._instance) {
        Config._instance = new Config();
      }
      return Config._instance;
    }
    setNewId() {
      this._count++;
    }
    assignCallback(cb) {
      this._callbacks.set(this._count, cb);
    }
    getCallback(id) {
      return this._callbacks.get(id);
    }
    getActiveCallback() {
      return this._callbacks.get(this._count);
    }
    get count() {
      return this._count;
    }
    get callbacks() {
      return this._callbacks;
    }
    getUniqueIdForNoneState() {
      return Math.random();
    }
  };
  var getConfig = () => Config.getInstance();

  // ../../build/@ripened/runtime/jsx/createDomElement.js
  var createDomElement = function(element, props, ...childrenFn) {
    const config = getConfig();
    config.setNewId();
    config.assignCallback((id) => createDomNode(id, true));
    return createDomNode(void 0, false);
    function createDomNode(id, hasRendered) {
      let alreadyCreated;
      if (id)
        alreadyCreated = document.querySelector(`[data-__id="${id}"]`);
      const [children, isTextChildren] = getChildren(childrenFn);
      const domNode = alreadyCreated ? alreadyCreated : getDomNode(element, [isTextChildren, config.count], props, children);
      if (!domNode) {
        const theChildren = children[0] ? children : props == null ? void 0 : props.children;
        return theChildren;
      }
      if (Array.isArray(domNode))
        return domNode;
      if (props && typeof element === "string") {
        setProperties(props, domNode);
      }
      if (Array.isArray(children) && children.length === 0)
        return domNode;
      if (!Array.isArray(children)) {
        return domNode;
      }
      for (const child of children) {
        if (Array.isArray(child)) {
          for (const c of child) {
            if (Array.isArray(c))
              c.forEach((ce) => appendNode(ce, domNode, hasRendered));
            else
              appendNode(c, domNode, hasRendered);
          }
          continue;
        }
        appendNode(child, domNode, hasRendered);
      }
      return domNode;
    }
  };
  function getChildren(childrenFn) {
    const children = [];
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
    return [children, children.some(hasHtmlElements)];
  }
  function hasHtmlElements(child) {
    if (Array.isArray(child)) {
      if (child.some((c) => c instanceof HTMLElement))
        return false;
    }
    if (child instanceof HTMLElement)
      return false;
    return true;
  }
  function getDomNode(element, idStuff, props, children) {
    const [shouldGiveId, id] = idStuff;
    let domNode;
    if (typeof element === "string") {
      domNode = document.createElement(element);
      console.log(shouldGiveId, id, element, children);
      if (shouldGiveId)
        domNode.dataset.__id = String(id);
    } else {
      const p = props ? props : {};
      if (children)
        p["children"] = children;
      domNode = element(p);
    }
    return domNode;
  }
  function appendNode(child, domNode, hasRendered) {
    if (child instanceof Node) {
      domNode.appendChild(child);
      return;
    }
    const textStrings = [];
    if (Array.isArray(child)) {
      for (const c of child) {
        if (Array.isArray(c)) {
          c.forEach((ce) => domNode.appendChild(ce));
        } else {
          if (c instanceof HTMLElement)
            domNode.appendChild(c);
          else
            textStrings.push(c);
        }
      }
    }
    if (typeof child === "string" || typeof child === "number") {
      const text = String(child);
      if (hasRendered) {
        domNode.innerText = text;
        console.log(domNode.innerText, domNode.parentElement);
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
  function setProperties(props, domNode) {
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

  // ../../build/@ripened/runtime/jsx/fragment.js
  function Fragment() {
    return void 0;
  }

  // jsx/render.ts
  function render(app, rootElement) {
    rootElement.appendChild(app);
  }

  // __tests__/test-app/something.tsx
  function Component({ something }) {
    return /* @__PURE__ */ () => createDomElement(Fragment, null, /* @__PURE__ */ () => createDomElement("p", null,() =>  "xxx xd ",() =>  something,() =>  " hello worldd ",() =>  12 + 2), /* @__PURE__ */ () => createDomElement("h1", null,() =>  "Hello world yoyo test2dsadasdsa"), /* @__PURE__ */ () => createDomElement("p", null, "sup"));
  }

  // ../ripened-reactive/state/createState.ts
  function createState(initialState) {
    let state = initialState;
    const elementIds = /* @__PURE__ */ new Set();
    return [
      function() {
        const config = getConfig();
        elementIds.add(config.count);
        return state;
      },
      function(value) {
        var _a;
        if (typeof value === "function") {
          state = value(state);
        }
        if (typeof value !== "function") {
          state = value;
        }
        const config = getConfig();
        console.log(elementIds);
        for (const id of elementIds) {
          (_a = config.getCallback(id)) == null ? void 0 : _a(id);
        }
      }
    ];
  }

  // __tests__/test-app/main.tsx
  function Something() {
    const [count, setCount] = createState(0);
    const hello = /* @__PURE__ */ () => createDomElement("div", null,() =>  "something yoyo ",() =>  count(), " ", /* @__PURE__ */ () => createDomElement("p", null, "Yo "));
    hello.innerHTML += (/* @__PURE__ */ () => createDomElement("p", null,() =>  "Hello world")).outerHTML;
    return /* @__PURE__ */ () => createDomElement("div", null, /* @__PURE__ */ () => createDomElement("h3", null,() =>  "count: ",() =>  count(),() =>  " something ",() =>  "",() =>  " else"), /* @__PURE__ */ () => createDomElement("h3", null,() =>  count()), /* @__PURE__ */ () => createDomElement("button", {
      onclick: () => setCount((c) => c + 1)
    },() =>  "increment"), /* @__PURE__ */ () => createDomElement("a", {
      href: "/somewhere"
    },() =>  "somewhere"), hello, /* @__PURE__ */ () => createDomElement(Component, {
      something: "hello",
      yo: 3
    }), /* @__PURE__ */ () => createDomElement("h1", null,() =>  "Yoyoyo"), /* @__PURE__ */ () => createDomElement("p", null,() =>  "this is a test2"), /* @__PURE__ */ () => createDomElement("p", {
      style: { padding: "1px", color: "black" }
    },() =>  "Hello"), /* @__PURE__ */ () => createDomElement("div", null, /* @__PURE__ */ () => createDomElement(Fragment, null, /* @__PURE__ */ () => createDomElement("h1", null,() =>  "hello world"))), /* @__PURE__ */ () => createDomElement("input", {
      id: "input",
      name: "something",
      value: "",
      onchange: function(event) {
        console.log(this.value);
        console.log(event.currentTarget.value);
      }
    }), /* @__PURE__ */ () => createDomElement("h3", null, /* @__PURE__ */ () => createDomElement("p", null,() =>  "Hello world"), /* @__PURE__ */ () => createDomElement("p", null,() =>  "Hello world"), /* @__PURE__ */ () => createDomElement("p", null,() =>  "Hello world"), /* @__PURE__ */ () => createDomElement("p", null,() =>  "Hello world"), /* @__PURE__ */ () => createDomElement("p", null,() =>  "Hello world"), /* @__PURE__ */ () => createDomElement("p", null, "Hello world")));
  }
  render(/* @__PURE__ */ () => createDomElement(Something, null), document.getElementById("root"));
})();
