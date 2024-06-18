class CloseApp extends HTMLElement {
  _shadowRoot = null;
  _style = null;
  constructor() {
    super();

    this._style = document.createElement("style");
    this._shadowRoot = this.attachShadow({ mode: "open" });
  }

  _updateStyle() {
    this._style.textContent = `
        :host{
            display : block;
            background-color: #8da6ff;
            box-shadow:0px -1px 3px rgba(108,140,255,0.9);
            width : 100%;
        }
        div{
            padding: 2rem 0;
            display:flex;
            justify-content: center;
            align-item: center;
        }

        .footer-text{
            font-size:1rem;
            color:white;
        }
        `;
  }

  _emptyContent() {
    this._shadowRoot.innerHTML = "";
  }
  connectedCallback() {
    this.render();
  }

  render() {
    this._emptyContent();
    this._updateStyle();

    this._shadowRoot.appendChild(this._style);
    this._shadowRoot.innerHTML += `
    <div>
    <div class="footer-text">© Farhan. All rights reserved.</div>
  </div>
    `;
  }
}

customElements.define("close-app", CloseApp);
