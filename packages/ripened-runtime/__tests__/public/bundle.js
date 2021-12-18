(() => {
  // ../../build/@ripened/runtime/utils/invariant.js
  function invariant(value, message) {
    if (value === false || value === null || typeof value === "undefined") {
      console.error(message);
      throw new Error(message);
    }
  }

  // ../../build/@ripened/runtime/jsx/h.js
  function h(element, props, ...children) {
    const domNode = getDomNode(element, props, children);
    if (!domNode) {
      const theChildren = children[0]
        ? children
        : props == null
        ? void 0
        : props.children;
      invariant(theChildren, "A fragment was used without any children");
      if (Array.isArray(theChildren[0])) {
        return theChildren;
      }
      return theChildren;
    }
    if (Array.isArray(domNode)) return domNode;
    console.log(children);
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
    if (children.length === 0) return domNode;
    for (const child of children) {
      if (Array.isArray(child)) {
        child.forEach((c) => appendNode(c, domNode));
        continue;
      }
      appendNode(child, domNode);
    }
    return domNode;
  }
  function getDomNode(element, props, children) {
    let domNode;
    if (typeof element === "string") {
      domNode = document.createElement(element);
    } else {
      const p = props ? props : {};
      if (children) p["children"] = children;
      domNode = element(p);
    }
    return domNode;
  }
  function appendNode(child, domNode) {
    if (child instanceof Node) {
      domNode.appendChild(child);
      return;
    }
    if (Array.isArray(child)) {
      for (let c of child) {
        if (Array.isArray(c)) {
          c.forEach((ce) => domNode.appendChild(ce));
        } else {
          domNode.appendChild(c);
        }
      }
      return;
    }
    setInnerText(domNode, child);
  }
  function setInnerText(domNode, theText) {
    const STATE_ID_REGEX = /<#([{"id": \d, "value": \w}]+)#>/;
    if (typeof theText === "number") {
      theText = String(theText);
    }
    let stateIds = [];
    let finalString = "";
    let match = theText.match(STATE_ID_REGEX);
    while (match) {
      const stateObject = JSON.parse(match[1]);
      stateIds.push(stateObject.id);
      finalString += theText.substring(0, match.index) + stateObject.value;
      theText = theText.substring(match.index + match[1].length + 4);
      match = theText.match(STATE_ID_REGEX);
    }
    if (theText.length > 0) finalString += theText;
    if (stateIds.length > 0) domNode.dataset.ids = JSON.stringify(stateIds);
    domNode.innerText = domNode.innerText
      ? domNode.innerText + finalString
      : finalString;
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
    return /* @__PURE__ */ h(
      Fragment,
      null,
      /* @__PURE__ */ h(
        "p",
        null,
        "xxx xd ",
        something,
        " hello worldd ",
        12 + 2
      ),
      /* @__PURE__ */ h("h1", null, "Hello world yoyo test2dsadasdsa"),
      /* @__PURE__ */ h("p", null, "sup")
    );
  }

  // __tests__/test-app/main.tsx
  function Something() {
    const hello = /* @__PURE__ */ h("div", null, "something");
    hello.innerHTML += /* @__PURE__ */ h("p", null, "something else").outerHTML;
    return /* @__PURE__ */ h(
      "div",
      null,
      /* @__PURE__ */ h("p", null, "hello"),
      /* @__PURE__ */ h(
        "a",
        {
          href: "/somewhere",
        },
        "somewhere"
      ),
      hello,
      /* @__PURE__ */ h(Component, {
        something: "hello",
        yo: 3,
      }),
      /* @__PURE__ */ h("h1", null, "Yoyoyo"),
      /* @__PURE__ */ h("p", null, "this is a test2"),
      /* @__PURE__ */ h("p", null, "Hello"),
      /* @__PURE__ */ h("h3", null, "gogo world "),
      /* @__PURE__ */ h(
        "div",
        null,
        /* @__PURE__ */ h(
          Fragment,
          null,
          /* @__PURE__ */ h("h1", null, "hello world")
        )
      ),
      /* @__PURE__ */ h("input", {
        id: "input",
        name: "something",
        value: "",
        onchange: function (event) {
          console.log(this.value);
          console.log(event.currentTarget.value);
        },
      })
    );
  }
  render(/* @__PURE__ */ h(Something, null), document.getElementById("root"));
})();
