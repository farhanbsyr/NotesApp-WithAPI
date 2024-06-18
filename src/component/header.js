class AppBar extends HTMLElement {
  _shadowRoot = null;
  _style = null;

  constructor() {
    super();

    this._shadowRoot = this.attachShadow({ mode: "open" });
    this._style = document.createElement("style");
  }

  _updateStyle() {
    this._style.textContent = `
        :host {

            display: block;
            color: white;
            box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
            width:100%
        }

        div{
            padding: 1rem 5rem;
        }
   
        .title-app {
            font-size: larger;
            font-weight: 600;
            color: #8da6ff;
            font-size: 2rem;
          }
          @media only screen and (max-width: 600px) {
            div{
              padding: 1rem 1.5rem;
            }
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

    this._shadowRoot.append(this._style);
    this._shadowRoot.innerHTML += `      
        <div >
            <div class="title-app">Notes App</div>
        </div>
      `;
  }
}

customElements.define("app-bar", AppBar);
