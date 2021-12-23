(() => {
  // node_modules/@ripened/runtime/jsx/config.js
  var Config = class {
    constructor() {
      this._count = 0;
      this._callbacks = /* @__PURE__ */ new Map();
    }
    static getInstance() {
      if (!Config.instance) {
        Config.instance = new Config();
      }
      return Config.instance;
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
  };
  var getConfig = () => Config.getInstance();

  // node_modules/@ripened/runtime/jsx/h.js
  function h(element, props, ...childrenFn) {
    const config = getConfig();
    config.setNewId();
    config.assignCallback((id) => createDomNode(id, true));
    return createDomNode(config.count, false);
    function createDomNode(id, hasRendered) {
      const alreadyCreated = document.querySelector(`[data-__id="${id}"]`);
      const children = getChildren(childrenFn);
      const domNode = alreadyCreated ? alreadyCreated : getDomNode(element, id, props, children);
      if (!domNode) {
        const theChildren = children[0] ? children : props == null ? void 0 : props.children;
        return theChildren;
      }
      if (Array.isArray(domNode))
        return domNode;
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
  }
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
    return children;
  }
  function getDomNode(element, count, props, children) {
    let domNode;
    if (typeof element === "string") {
      domNode = document.createElement(element);
      domNode.dataset.__id = String(count);
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
  function setInnerText(domNode, theText, hasRendered) {
    const text = String(theText);
    if (hasRendered) {
      domNode.innerText = text;
      return;
    }
    domNode.innerText = domNode.innerText ? domNode.innerText + text : text;
  }

  // node_modules/@ripened/runtime/jsx/render.js
  function render(app, rootElement) {
    rootElement.appendChild(app);
  }

  // node_modules/@ripened/reactive/state/createState.js
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
        for (const id of elementIds) {
          (_a = config.getCallback(id)) == null ? void 0 : _a(id);
        }
      }
    ];
  }

  // app/main.tsx
  function App() {
    const [count, setCount] = createState(1);
    const increment = () => setCount((c) => c + 1);
    return /* @__PURE__ */ h("div", null,() =>  /* @__PURE__ */ h("div", null,() =>  /* @__PURE__ */ h("h1", {
      onclick: increment
    },() =>  "count: ", count())),() =>  /* @__PURE__ */ h("div", null,() =>  "Hello world"));
  }
  render(/* @__PURE__ */ h(App, null), document.getElementById("root"));
})();
