const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
</style>
<div id="bitcoin">
</div>
`

export default class BitcoinApp extends window.HTMLElement {
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
window.customElements.define('bitcoin-app', BitcoinApp)
