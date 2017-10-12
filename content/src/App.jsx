import React, {Component} from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mediaUrl: null,
      mediaRect: null
    }
  }

  componentDidMount() {
    document.addEventListener('click', ({clientX: x, clientY: y}) => {
      const elements = this.allElementsAtPoint(x, y);
      const mediaElement = elements.find(({tagName: tag}) => ['IMG', 'VIDEO'].includes(tag));

      if (mediaElement) {
        this.setState({
          mediaUrl: this.assetUrl(mediaElement),
          mediaRect: mediaElement.getClientRects()[0]
        });

        this.copyToClipboard();
      }
    });
  }

  copyToClipboard() {
    this.textInput.value = this.state.mediaUrl;
    this.textInput.select();
    document.execCommand('Copy');

    console.log(`Copied ${this.state.mediaUrl}`);
  }

  terminateElementLoop(element, elements) {
    return (
      ['HTML', 'BODY', 'IMG', 'VIDEO'].includes(element.tagName) ||
      elements.length > 20
    );
  }

  allElementsAtPoint(x, y) {
    let stack = [], element;

    do {
      element = document.elementFromPoint(x, y);
      stack.push(element);
      element.style.pointerEvents = 'none';
    } while (!this.terminateElementLoop(element, stack));

    stack.map((stackItem) => stackItem.style.pointerEvents = 'auto');

    return stack;
  }

  pickSourceFromSrcset(srcset, filterByConstraint) {
    return srcset.map((sourceAndConstraint) => {
      const [source, constraint] = sourceAndConstraint.split(' ');
      if (constraint === filterByConstraint) return source;
    }).join('').trim();
  }

  assetUrl(asset) {
    if (asset.srcset) {
      return this.pickSourceFromSrcset(asset.srcset.split(','), '1080w');
    } else {
      return asset.src;
    }
  }

  render() {
    return (
      <div>
        <input
          style={{
            position: 'absolute',
            opacity: '0',
            pointerEvents: 'none'
          }}
          ref={(input) => { this.textInput = input; }}
          type="text"
        />

        {this.state.mediaUrl &&
          <div
            style={{
              userSelect: 'none',
              cursor: 'default',
              color: '#fff',
              background: '#000',
              padding: '.2em .5em',
              position: 'absolute',
              borderRadius: '3px',
              zIndex: '99',
              opacity: '.7',
              top: `${this.state.mediaRect.top + (this.state.mediaRect.height / 2) + window.scrollY}px`,
              left: `${this.state.mediaRect.left + (this.state.mediaRect.width / 2)}px`,
              transform: 'translate3d(-50%, -50%, 0)'
            }}
          >Copied</div>
        }
      </div>
    );
  }
}

export default App;