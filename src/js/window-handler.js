let zIndex = 0
const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
  
#app {
    background-color: #f1f1f1;
    text-align: center;
  }

#appheader {
    padding: 5px;
    cursor: grab;
    background-color: #2196F3;
    color: black;
    display: flex;
    align-self: flex-end;
  }
  
#name {
    flex-grow: 1;
  }

#imgClose {
  cursor: pointer;
}

.aside {
    flex-basis: 15px;
    flex-shrink: 0;
  }
#memoryContainer img {
    width: 100px;
}
.removed {
    visibility: hidden;
}

</style>
<div id="app">
<div id="appheader">
<div id="icon" class="aside">I</div>
<div id="name">App</div>
<div id="close" class="aside"><img src="/image/cancel.svg" id="imgClose" alt="cancel"></div>
</div>
</div>
`

export default class WindowHandler extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  static get zIndex () {
    return zIndex
  }

  static set zIndex (value) {
    zIndex += value
  }

  set component (component) {
    this.shadowRoot.querySelector('#app').appendChild(component)
  }

  static get observedAttributes () {
    return ['text']
  }

  attributeChangedCallback (name, oldValue, newValue) {

  }

  connectedCallback () {
    this._pos1 = 0; this._pos2 = 0; this._pos3 = 0; this._pos4 = 0
    this.addEventListener('mousedown', this._handelMouseEvents)
    this._updateZindex()
  }

  _updateRendering () {

  }

  _handelMouseEvents (event) {
    event.preventDefault()
    const close = this.shadowRoot.querySelector('#imgClose')
    if (event.path[0] !== this && event.path[0] !== close) {
      this._updateZindex()
      this.shadowRoot.querySelector('#appheader').style.cursor = 'grabbing'
      // get the mouse cursor position at startup
      this._pos3 = event.clientX
      this._pos4 = event.clientY
      event.target.onmouseup = this._closeDragElement
      // call a function whenever the cursor moves
      event.target.onmousemove = this._elementDrag
    } else if (event.path[0] === close) {
      this._remove()
    }
  }

  _elementDrag (event) {
    event.preventDefault()
    this._focusWindow()
    // calculate the new cursor position
    this._pos1 = this._pos3 - event.clientX
    this._pos2 = this._pos4 - event.clientY
    this._pos3 = event.clientX
    this._pos4 = event.clientY
    // set the element's new position
    event.target.style.top = `${(event.target.offsetTop - this._pos2)}px`
    event.target.style.left = `${(event.target.offsetLeft - this._pos1)}px`
  }

  _closeDragElement (event) {
    // stop moving when mouse button is released
    this._unfocusWindow()
    this.shadowRoot.querySelector('#appheader').style.cursor = 'grab'
    event.target.onmouseup = null
    event.target.onmousemove = null
  }

  _remove () {
    this.removeEventListener('mousedown', this._handelMouseEvents)
    this.remove()
  }

  _updateZindex () {
    this.style.zIndex = zIndex
    zIndex++
  }

  _focusWindow () {
    this.style.border = 'solid rgb(126, 126, 126)'
  }

  _unfocusWindow () {
    this.style.border = ''
  }
}

window.customElements.define('window-handler', WindowHandler)
