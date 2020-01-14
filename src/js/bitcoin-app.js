const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
ul{
  width: 100%;
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 0;
}
li {
  list-style-type: none;
}
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
    this._socket.addEventListener('open', (event) => {
      this._connected()
    })
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
    this._socket.send(JSON.stringify({ op: 'unconfirmed_sub' }))
  }

  _receive (event) {
    const data = JSON.parse(event.data)
    if (this._bitcoinMessages.childNodes.length === 50) {
      this._bitcoinMessages.removeChild(this._bitcoinMessages.childNodes[1])
    }
    const li = document.createElement('li')
    li.appendChild(document.createTextNode(`${data}`))
    this._bitcoinMessages.appendChild(li)
    this._chat.scrollTop = this._chat.scrollHeight
  }
}
window.customElements.define('bitcoin-app', BitcoinApp)
