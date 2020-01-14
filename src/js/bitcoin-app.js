const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
</style>
<div id="bitcoin">
<ul id="messages">
</ul>
</div>
`

export default class BitcoinApp extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._bitcoinMessages = this.shadowRoot.querySelector('#messages')
    this._socket = new window.WebSocket('wss://ws.blockchain.info/inv')
  }

  static get observedAttributes () {
    return ['text']
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }

  connectedCallback () {
    this._socket.addEventListener('open', this._connected)
    this._socket.addEventListener('message', (event) => {
      this._receive(event)
    })
  }

  disconnectedCallback () {
    this._socket.close()
  }

  _updateRendering () {

  }

  _connected (event) {
    console.log('connected')
  }

  _receive (event) {
    const data = JSON.parse(event.data)
    if (this._bitcoinMessages.childNodes.length === 50) {
      this._bitcoinMessages.removeChild(this._bitcoinMessages.childNodes[1])
    }
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(`${data}`))
    this._chatMessages.appendChild(li)
    this._chat.scrollTop = this._chat.scrollHeight
  }
}
window.customElements.define('bitcoin-app', BitcoinApp)
