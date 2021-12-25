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
    assignCallback(cb, id = this._count) {
      const callbacks = this._callbacks.has(id) ? this._callbacks.get(id) : [];
      callbacks.push(cb);
      this._callbacks.set(id, callbacks);
    }
    removeCallback(id) {
      this._callbacks.delete(id);
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
  var createDomElement = (element, props, ...childrenFn) => {
    const config = getConfig();
    config.setNewId();
    config.assignCallback((id) => createDomNode(id));
    return createDomNode(void 0);
    function createDomNode(id) {
      let alreadyCreated;
      if (id)
        alreadyCreated = document.querySelector(`[data-__id="${id}"]`);
      const count = config.count;
      const [children, isTextChildren, isMappedData] = getChildren(childrenFn);
      const domNode = alreadyCreated ? alreadyCreated : getDomNode(element, [isTextChildren || isMappedData, count], props, children);
      if (!domNode) {
        const theChildren = children[0] ? children : props == null ? void 0 : props.children;
        return theChildren;
      }
      if (alreadyCreated && domNode.hasChildNodes())
        removeAllChildNodes(domNode);
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
      appendNode(children, domNode);
      return domNode;
    }
  };
  function getChildren(childrenFn) {
    console.log(childrenFn);
    const children = [];
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
            if (typeof ce !== "function")
              continue;
            isMappedData = true;
            children.push(ce());
          }
          continue;
        }
        children.push(c);
        continue;
      }
      children.push(child);
    }
    return [children, children.some(hasHtmlElements), isMappedData];
  }
  function getDomNode(element, idStuff, props, children) {
    var _a;
    const [shouldGiveId, id] = idStuff;
    let domNode;
    if (typeof element === "string") {
      domNode = document.createElement(element);
      if (shouldGiveId)
        domNode.dataset.__id = String(id);
    } else {
      let p = {};
      if (props && typeof props === "object")
        p = props;
      if (children)
        p["children"] = children;
      domNode = (_a = element(p)) == null ? void 0 : _a(p);
    }
    return domNode;
  }
  function appendNode(child, domNode) {
    const textStrings = [];
    for (const c of child) {
      if (Array.isArray(c)) {
        for (const ce of c) {
          if (Array.isArray(ce)) {
            ce.forEach((c2) => domNode.appendChild(c2));
            continue;
          }
          domNode.appendChild(ce);
        }
        continue;
      }
      if (c instanceof HTMLElement) {
        domNode.appendChild(c);
      } else
        textStrings.push(c);
    }
    if (textStrings.length > 0)
      domNode.innerText = textStrings.join("");
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
  function removeAllChildNodes(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
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

  // ../../build/@ripened/runtime/jsx/fragment.js
  function Fragment() {
    return void 0;
  }

  // jsx/render.ts
  function render(app, rootElement) {
    rootElement.appendChild(app());
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
          (_a = config.getCallback(id)) == null ? void 0 : _a.forEach((cb) => cb(id));
        }
      }
    ];
  }

  // __tests__/test-app/main.tsx
  function Something() {
    const [count, setCount] = createState(0);
    const [items, setItems] = createState([15]);
    return /* @__PURE__ */ () => createDomElement("div", null, /* @__PURE__ */ () => createDomElement("h1", null,() =>  "Yoyoyo"), /* @__PURE__ */ () => createDomElement(Component, {
      something: "hello",
      yo: 3
    }), /* @__PURE__ */ () => createDomElement("p", null,() =>  "this is a test2"), /* @__PURE__ */ () => createDomElement("a", {
      href: "/somewhere"
    },() =>  "somewhere"), /* @__PURE__ */ () => createDomElement("ul", null, /* @__PURE__ */ () => createDomElement("li", null,() =>  "Hello world"),() =>  items().map((item) => /* @__PURE__ */ () => createDomElement("li", null,() =>  item)), /* @__PURE__ */ () => createDomElement("li", null,() =>  "Hello world")), /* @__PURE__ */ () => createDomElement("button", {
      onclick: () => setItems([...items(), items().length + 1])
    },() =>  "add item"), /* @__PURE__ */ () => createDomElement("h3", null,() =>  "count: ",() =>  count(),() =>  " something else"), /* @__PURE__ */ () => createDomElement("h3", null,() =>  "count : ",() =>  count()), /* @__PURE__ */ () => createDomElement("button", {
      onclick: () => setCount((c) => c + 1)
    },() =>  "increment"), /* @__PURE__ */ () => createDomElement("p", {
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
