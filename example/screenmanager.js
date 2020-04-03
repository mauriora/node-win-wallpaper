const {
  ipcRenderer, remote
} = require('electron');

const crypto = require('crypto');

/**
 * Creates an element with tag name, optional attaches it to parent, sets className, sets textContent, sets innerHTML
 * @param {keyof HTMLElementTagNameMap} name of tag
 * @param {{parent?: Node, className?: string, text?: string, html?: string}} [options]
 * @returns {HTMLElement}
 */
const createAndAppend = (name, options) => {
  const element = document.createElement(name);

  if (options) {
    if (options.className) {
      element.classList.add(options.className);
    }
    if (options.parent) {
      options.parent.appendChild(element);
    }
    if (options.text) {
      element.textContent = options.text;
    }
    if (options.html) {
      element.innerHTML = options.html;
    }
  }
  return element;
};


/** */
class DisplayView {

  /** @type {Electron.Display} */
  display;

  ipc = ipcRenderer;

  /** @type {HTMLDivElement} */
  container;

  /** @type {HTMLElement} */
  fileDisplay;

  /** @type {string} */
  fileStorageKey;

  /** @type {string} */
  file;


  /**
   *
   * @param {Electron.Display} display to view information about and user settings editor
   * @param {Element} parent element to attach view to
   */
  constructor(display, parent) {
    console.log(`${this.constructor.name}(${display.id})`);

    this.display = display;
    this.fileStorageKey = `${this.display.id}-file`;
    this.file = window.localStorage.getItem(this.fileStorageKey);

    /** @type {HTMLDivElement} */
    this.container = createAndAppend('div', {
      parent: parent,
      className: 'display'
    });

    createAndAppend('h2', {
      parent: this.container,
      className: 'title',
      text: this.display.id
    });

    createAndAppend('span', {
      parent: this.container,
      className: 'size',
      text: `${this.display.workAreaSize.width} * ${this.display.workAreaSize.height}`
    });

    createAndAppend('button', {
      parent: this.container,
      className: 'button',
      text: 'Choose file'
    }).onclick = () => {
      this.openFile();
    };

    this.fileDisplay = createAndAppend('span', {
      parent: this.container,
      className: 'displayfile',
      text: this.file
    });

    if (this.file) {
      this.configStorageKey = `${this.display.id}-${crypto.createHash('md5').update(this.file).digest('hex')}-config`;
      this.ipc.send(this.fileStorageKey, this.file);
    }
  }

  /**
   * Calls setFile if showDialog wasn't canceled
   */
  openFile() {
    this.showDialog()
      .then((result) => {
        console.log(`${this.constructor.name}(${this.display.id}) Dialog: canceled=${result.canceled}`);
        if (result.canceled) {
          console.log(`${this.constructor.name}(${this.display.id}) Dialog: canceled=${result.canceled}`);
        } else {
          console.log(`${this.constructor.name}(${this.display.id}) Dialog: file=${result.filePaths[0]}`);
          this.setFile(result.filePaths[0]);
        }
      }).catch((err) => {
        console.error(`Error showing Open File Dialog: ${err}`, err);
      });
  }

  /**
   * to open a file, e.g. web pages, images, movies or any file. Defaults to this.file or "My Documents"
   * @returns {Promise<Electron.OpenDialogReturnValue>}
   */
  showDialog() {
    return remote.dialog.showOpenDialog({
      properties: [ 'openFile' ],
      defaultPath: this.file ? this.file : remote.app.getPath('documents'),
      filters: [
        {
          name: 'Web pages',
          extensions: [ 'html', 'htm' ]
        },
        {
          name: 'Images',
          extensions: [ 'jpg', 'png', 'gif' ]
        },
        {
          name: 'Movies',
          extensions: [ 'mkv', 'avi', 'mp4' ]
        },
        {
          name: 'All Files',
          extensions: [ '*' ]
        }
      ]
    });
  }

  /**
   * sets fileDisplay, stores the file URL and does IPC to the main thread to load the file
   * @param {string} file URL
   */
  setFile(file) {
    this.file = file;
    this.fileDisplay.textContent = this.file;
    window.localStorage.setItem(this.fileStorageKey, this.file);
    this.ipc.send(this.fileStorageKey, this.file);
  }
}

/**
 * Creates a DisplayView for each display in screen.getAllDisplays
 */
class ScreenManager {

  /**
   * @type {Electron.Display[]}
   */
  displays = [];

  /**
   * @type {DisplayView[]}
   */
  views = [];

  /**
   * @type {Element}
   */
  screensWrapper = document.querySelector('[id = displayswrapper]');

  /** */
  constructor() {
    console.log(`${this.constructor.name}`);
    this.displays = remote.screen.getAllDisplays();

    this.displays.forEach(
      (display) => {
        this.views.push(new DisplayView(display, this.screensWrapper));
      }
    );
  }
}

window.screenManager = new ScreenManager();
