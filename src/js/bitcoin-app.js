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
#bitcoin {
  height: 400px;
  top: 0;
  background-color: white;
  text-align: left;
  overflow: auto;
}
#buttom {
  padding-top: 10px;
  background-color: #2196F3;
  height: 100%;
}
#total {
    padding-top: 10px;
}
</style>
<div id="bitcoin">
<ul id="messages">
</ul>
</div>
<div id="buttom">
<div id="price">Bitcoin price: </div>
<div id="total">Total transfered: </div>
</div>
`
// A bitcoin app that shows the user realtime bitcoin transactions
// and sums them up.
export default class BitcoinApp extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._bitcoin = this.shadowRoot.querySelector('#bitcoin')
    this._bitcoinMessages = this.shadowRoot.querySelector('#messages')
    this._total = this.shadowRoot.querySelector('#total')
    this._totalBitcoins = 0
    this._socket = new window.WebSocket('wss://ws.blockchain.info/inv')
  }

  connectedCallback () {
    this._setBitcoinPrice()
    this._socket.addEventListener('open', (event) => {
      this._connected()
    })
    this._socket.addEventListener('message', (event) => {
      this._receive(event)
    })
  }

  // When app is closed disconnect from websocket
  disconnectedCallback () {
    this._socket.close()
  }

  // When websocker connects subscribe to all bitcoin events
  _connected (event) {
    this._socket.send(JSON.stringify({ op: 'unconfirmed_sub' }))
  }

  // When receiving data from the websocket, formating it and present it to the user
  // also makes sure there is no more then 50 transactions displayd
  _receive (event) {
    const data = JSON.parse(event.data)
    data.x.out.forEach(element => {
      const value = Number(element.value + 'e-8')
      if (value > 0) {
        if (this._bitcoinMessages.childNodes.length === 50) {
          this._bitcoinMessages.removeChild(this._bitcoinMessages.childNodes[1])
        }
        this._totalBitcoins = this._totalBitcoins + value
        this._total.textContent = `Total transfered: ${this._totalBitcoins.toFixed(2)} BTC`
        const li = document.createElement('li')
        li.appendChild(document.createTextNode(`${value} ---> ${element.addr.substring(0, 25)}...`))
        this._bitcoinMessages.appendChild(li)
        this._bitcoin.scrollTop = this._bitcoin.scrollHeight
      }
    })
  }

  // Get the latest price of 1 bitcoin in SEK and present it to the user
  async _setBitcoinPrice () {
    const url = 'https://api.coindesk.com/v1/bpi/currentprice/SEK.json'
    const req = await window.fetch(url)
    const json = await req.json()
    this.shadowRoot.querySelector('#price').textContent = `Bitcoin price: ${json.bpi.SEK.rate} SEK`
  }
}
window.customElements.define('bitcoin-app', BitcoinApp)
