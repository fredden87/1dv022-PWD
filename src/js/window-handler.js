const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
#app {
    position: absolute;
    z-index: 9;
    background-color: #f1f1f1;
    border: 1px solid #d3d3d3;
    text-align: center;
  }
  
#appheader {
    padding: 10px;
    cursor: move;
    z-index: 10;
    background-color: #2196F3;
    color: #fff;
  }
</style>
<div id="app">
<div id="appheader">Click here to move</div>
<p>Move</p>
<p>this</p>
<p>DIV</p>
</div>
`

export default class WindowHandler extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  static get observedAttributes () {
    return ['text']
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }

  connectedCallback () {

  }

  _updateRendering () {

  }
}

window.customElements.define('window-handler', WindowHandler)
