let _zIndex = 0
const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
  
#app {
    background-color: white;
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

#icon img {
  width: 100%;
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
<div id="icon" class="aside"></div>
<div id="name"></div>
<div id="close" class="aside"><img src="/image/cancel.svg" id="imgClose" alt="cancel"></div>
</div>
</div>
`
// A window handler component that creates a window that is draggable
// and able to take other component inside it
export default class WindowHandler extends window.HTMLElement {
  constructor () {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
  }

  // Static value to get z-index on windows
  static get zIndex () {
    return _zIndex
  }

  // Static value to set z-index on windows
  static set zIndex (value) {
    _zIndex += value
  }

  // Sets the component inside the window
  set component (component) {
    this.shadowRoot.querySelector('#app').appendChild(component)
  }

  // Sets the path to the icon in the upper left
  set icon (path) {
    const img = document.createElement('IMG')
    img.src = path
    this.shadowRoot.querySelector('#icon').appendChild(img)
  }

  // Sets the name on the app in the upper mid
  set name (name) {
    this.shadowRoot.querySelector('#name').textContent = name
  }

  connectedCallback () {
    this._pos1 = 0; this._pos2 = 0; this._pos3 = 0; this._pos4 = 0
    this.addEventListener('mousedown', this._handelMouseEvents)
    this._updateZindex()
  }

  // When the mouse if clicked down this functions handles what to do
  _handelMouseEvents (event) {
    event.preventDefault()
    const close = this.shadowRoot.querySelector('#imgClose')
    const appHeader = this.shadowRoot.querySelector('#appheader')
    const icon = this.shadowRoot.querySelector('#icon')
    const name = this.shadowRoot.querySelector('#name')
    if (event.path[0] === appHeader || event.path[0] === icon || event.path[0] === name) {
      this._focusWindow()
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

  // Handlers the dragging event
  _elementDrag (event) {
    event.preventDefault()
    // calculate the new cursor position
    this._pos1 = this._pos3 - event.clientX
    this._pos2 = this._pos4 - event.clientY
    this._pos3 = event.clientX
    this._pos4 = event.clientY
    // set the element's new position
    event.target.style.top = `${(event.target.offsetTop - this._pos2)}px`
    event.target.style.left = `${(event.target.offsetLeft - this._pos1)}px`
  }

  // Handels the ending of the dragging event
  _closeDragElement (event) {
    // stop moving when mouse button is released
    this._unfocusWindow()
    this.shadowRoot.querySelector('#appheader').style.cursor = 'grab'
    event.target.onmouseup = null
    event.target.onmousemove = null
  }

  // Handels the closing of the window
  _remove () {
    this.removeEventListener('mousedown', this._handelMouseEvents)
    this.remove()
  }

  // Updates the z-index value of the window
  _updateZindex () {
    this.style.zIndex = _zIndex
    _zIndex++
  }

  // Makes the window get in focus
  _focusWindow () {
    this.style.border = 'solid rgb(126, 126, 126)'
  }

  // Removes the focus
  _unfocusWindow () {
    this.style.border = ''
  }
}

window.customElements.define('window-handler', WindowHandler)
