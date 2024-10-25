let debugIsActive = false;
let debugAllowed  = false;

document.addEventListener(
  "DOMContentLoaded",
  () => {
    // TODO - make more layout for various screen sizes

    const allHiddenImages = document.querySelectorAll('img.hidden');
    for (let img of allHiddenImages) {
      img.classList.remove('hidden');
    }
    PARAMETERS.init();

    const params = new URLSearchParams(document.location.search);
    GAME.initialize(params);

    if (params.has('debug')) {
      debugAllowed = true;
      // set debug toggle on click event on the score element
      const debugElt = document.getElementById('score');
      debugElt.addEventListener('click', toggleDebug, false);
      // change the background color, to get visual information that debug is active
      // debugElt.parentElement.style.backgroundColor = '#444';
      // debugElt.title = 'Click to toggle debug information';

      const definitionElt = document.getElementById('definition');
      definitionElt.innerHTML = 'Debug is active<br><br>Click on the score to toggle debug ON or OFF';

      // console.log('debug mode activated - click on score element')
    }
    // console.log(DICTIONARY)

  }
);

window.addEventListener(
  'resize',
  (ev) => {
    HMI.setLayout();
  }
)

function toggleDebug() {
  if (!debugAllowed) return;

  const definitionElt = document.getElementById('definition');

  debugIsActive = !debugIsActive;
  if (debugIsActive) {
    document.getElementById("keyboard").setAttribute("border", "1");
    // we may do other things here, such as displaying debug
    // information in the word definition area
    const screenInfo = `
width : inner    = ${window.innerWidth}
        client   = ${document.documentElement.clientWidth}
        viewport = ${window.visualViewport.width}
height: inner    = ${window.innerHeight}
        client   = ${document.documentElement.clientHeight}
        viewport = ${window.visualViewport.height}
    `;
    definitionElt.innerHTML = `<pre>${screenInfo}</pre>`;

  }
  else {
    document.getElementById("keyboard").setAttribute("border", "0");
    definitionElt.innerHTML = "";
  }
}
