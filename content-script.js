(function(){
  const s = {
    init: function() {
      s.lastTargetedElement = null;

      s.insertPreviewMenu();
      s.trackUserHover();
      //s.trackUserClicks();
      s.listenForMessages();
      s.disableIframes();
    },

    previewMenu: function() {
      const menu = document.createElement('div');
      menu.id = 'ad-preview-screenshot-generator';
      menu.innerHTML = `
      <style>
        #ad-preview-screenshot-generator {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 2147483647;
          background-color: #ffffff;
        }
        #ad-preview-screenshot-generator .padding-area {
          padding: 15px;
        }
        #ad-preview-screenshot-generator .spacer {
          height: 10px;
        }
      </style>
      <div id="ad-preview-screenshot-generator-controls">
        <div class="padding-area">
          <label for="text-input">Text Input</label>
          <div class="spacer"></div>
          <input type="text" id="text-input" placeholder="Enter some text" />
          <div class="spacer"></div>
          <label for="file-input">File Input</label>
          <div class="spacer"></div>
          <input type="file" id="file-input" accept=".png, .jpg, .jpeg, .svg" />
          <div class="spacer"></div>
          <button id="send-to-content">Send</button>
          <div class="spacer"></div>
          <button id="insert-ad-contents-on-hover">Insert Ads</button>
        </div>
      </div>`;

      return menu;
    },

    insertPreviewMenu: function() {
      const menu = s.previewMenu();
      document.body.append(menu);
      s.runMenuScripts();
    },

    runMenuScripts: function() {
      s.handleAdUpload();
      s.handleInputUpdates();
      s.toggleAdInsertion();
    },

    handleAdUpload: function() {
      document.getElementById('file-input').addEventListener('change', (event) => {
        const file = event.target.files[0];
        
        if (file) {
          const imageUrl = URL.createObjectURL(file);
      
          let imgElement = document.getElementById('uploaded-image');
          if (!imgElement) {
            imgElement = document.createElement('img');
            imgElement.id = 'uploaded-image';
            imgElement.style.maxWidth = '100px';
            imgElement.style.marginTop = '20px';
            document.body.appendChild(imgElement);
          }

          imgElement.src = file ? imageUrl : '';

          console.log(imgElement.src);
        }
      });
    },

    handleInputUpdates: function() {
      document.getElementById('send-to-content').addEventListener('click', () => {
        const inputValue = document.getElementById('text-input').value || document.getElementById('uploaded-image').src;
        console.log('MSG: ' + inputValue);
        const request = {};
        request.value = inputValue;
        s.updateAdSource(request);
      });
    },

    toggleAdInsertion: function() {
      document.getElementById('insert-ad-contents-on-hover').addEventListener('click', () => {
        console.log(this);
      });
    },

    disableIframes: function() {
      document.querySelectorAll('iframe').forEach((frame) => {
        frame.style.pointerEvents = 'none';
      });
    }, 

    trackUserClicks: function() {
      document.addEventListener('click', (event) => {
        if (event.target.closest('#ad-preview-screenshot-generator-controls')) return;

        event.preventDefault();

        if (s.lastTargetedElement) s.lastTargetedElement.style.border = '';
        s.lastTargetedElement = event.target;
        s.lastTargetedElement.style.border = '2px solid red';
        console.log(s.currentAdSource);
      });
    },

    trackUserHover: function() {
      const frames = document.querySelectorAll('iframe');
      console.log('Frames: ' + frames.length);

      frames.forEach((frame) => {
        const parent = frame.parentElement;
        parent.addEventListener('mouseenter', (event) => {
          console.log('Hovered iframe!');
          
          if (event.target.closest('#ad-preview-screenshot-generator-controls')) return;
  
          if (s.lastTargetedElement) s.lastTargetedElement.style.border = '';
  
          s.lastTargetedElement = event.target;
          s.lastTargetedElement.style.border = '2px solid red';
        });
      });
    },

    listenForMessages: function() {
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action == 'updateAdSource') s.updateAdSource(request);
      });      
    }, 

    updateAdSource: function(request) {
      console.log('Received input from popup:', request.value);
      s.currentAdSource = request.value;
    }
  }

  s.init();

})();
