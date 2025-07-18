function injectSidebar() {
    const iframe = document.createElement("iframe");
    iframe.src = chrome.runtime.getURL("sidebar.html");
    iframe.style.cssText = `
      position: fixed;
      top: 0;
      right: 0;
      width: 300px;
      height: 100vh;
      border: none;
      z-index: 9999;
      box-shadow: -2px 0 10px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(iframe);
  }
  
  injectSidebar();
  