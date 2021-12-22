(() => {
  // ../../build/@ripened/runtime/jsx/config.js
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

  // ../../build/@ripened/runtime/jsx/h.js
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
    return /* @__PURE__ */ h(Fragment, null,() =>  /* @__PURE__ */ h("p", null,() =>  "xxx xd ", something, " hello worldd ", 12 + 2),() =>  /* @__PURE__ */ h("h1", null,() =>  "Hello world yoyo test2dsadasdsa"),() =>  /* @__PURE__ */ h("p", null,() =>  "sup"));
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
        for (const id of elementIds) {
          (_a = config.getCallback(id)) == null ? void 0 : _a(id);
        }
      }
    ];
  }

  // __tests__/test-app/main.tsx
  function Something() {
    const [count, setCount] = createState(0);
    const hello = /* @__PURE__ */ h("div", null,() =>  "something");
    hello.innerHTML += (/* @__PURE__ */ h("p", null,() =>  "something else")).outerHTML;
    return /* @__PURE__ */ h("div", null,() =>  /* @__PURE__ */ h("p", null,() =>  "count: ", count()),() =>  /* @__PURE__ */ h("button", {
      onclick: () => setCount((c) => c + 1)
    },() =>  "increment"),() =>  /* @__PURE__ */ h("a", {
      href: "/somewhere"
    },() =>  "somewhere"), hello,() =>  /* @__PURE__ */ h(Component, {
      something: "hello",
      yo: 3
    }),() =>  /* @__PURE__ */ h("h1", null,() =>  "Yoyoyo"),() =>  /* @__PURE__ */ h("p", null,() =>  "this is a test2"),() =>  /* @__PURE__ */ h("p", null,() =>  "Hello"),() =>  /* @__PURE__ */ h("h3", null,() =>  "gogo world "),() =>  /* @__PURE__ */ h("div", null,() =>  /* @__PURE__ */ h(Fragment, null,() =>  /* @__PURE__ */ h("h1", null,() =>  "hello world"))),() =>  /* @__PURE__ */ h("input", {
      id: "input",
      name: "something",
      value: "",
      onchange: function(event) {
        console.log(this.value);
        console.log(event.currentTarget.value);
      }
    }));
  }
  render(/* @__PURE__ */ h(Something, null), document.getElementById("root"));
})();
