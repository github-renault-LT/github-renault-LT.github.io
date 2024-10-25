const HMI = (function() {

  const _ELEMENT_WORD_ID       = "word";
  const _ELEMENT_DEFINITION_ID = "definition";
  const _ELEMENT_SCORE_ID      = "score";

  const _ELEMENT_FADER_ID      = "fader";

  const _ELEMENT_MESSAGE_BOX_ID              = "messageBox";
  const _ELEMENT_MESSAGE_BOX_TITLE_ID        = _ELEMENT_MESSAGE_BOX_ID + "Title";
  const _ELEMENT_MESSAGE_BOX_CONTENT_ID      = _ELEMENT_MESSAGE_BOX_ID + "Content";
  const _ELEMENT_MESSAGE_BOX_BUTTON_CLOSE_ID = _ELEMENT_MESSAGE_BOX_ID + "ButtonClose";

  const _ELEMENT_CONFIRM_BOX_ID              = "confirmBox";
  const _ELEMENT_CONFIRM_BOX_TITLE_ID        = _ELEMENT_CONFIRM_BOX_ID + "Title";
  const _ELEMENT_CONFIRM_BOX_CONTENT_ID      = _ELEMENT_CONFIRM_BOX_ID + "Content";
  const _ELEMENT_CONFIRM_BOX_YES_BUTTON_ID   = _ELEMENT_CONFIRM_BOX_ID + "ButtonYes";
  const _ELEMENT_CONFIRM_BOX_NO_BUTTON_ID    = _ELEMENT_CONFIRM_BOX_ID + "ButtonNo";

  let USE_FADER = false;

  const _ids = {
    ELEMENT_WORD_ID: _ELEMENT_WORD_ID,
    ELEMENT_DEFINITION_ID: _ELEMENT_DEFINITION_ID,
    ELEMENT_SCORE_ID: _ELEMENT_SCORE_ID,

    ELEMENT_FADER_ID: _ELEMENT_FADER_ID,

    ELEMENT_MESSAGE_BOX_ID              : _ELEMENT_MESSAGE_BOX_ID,
    ELEMENT_MESSAGE_BOX_TITLE_ID        : _ELEMENT_MESSAGE_BOX_TITLE_ID,
    ELEMENT_MESSAGE_BOX_CONTENT_ID      : _ELEMENT_MESSAGE_BOX_CONTENT_ID,
    ELEMENT_MESSAGE_BOX_BUTTON_CLOSE_ID : _ELEMENT_MESSAGE_BOX_BUTTON_CLOSE_ID,

    ELEMENT_CONFIRM_BOX_ID              : _ELEMENT_CONFIRM_BOX_ID,
    ELEMENT_CONFIRM_BOX_TITLE_ID        : _ELEMENT_CONFIRM_BOX_TITLE_ID,
    ELEMENT_CONFIRM_BOX_CONTENT_ID      : _ELEMENT_CONFIRM_BOX_CONTENT_ID,
    ELEMENT_CONFIRM_BOX_YES_BUTTON_ID   : _ELEMENT_CONFIRM_BOX_YES_BUTTON_ID,
    ELEMENT_CONFIRM_BOX_NO_BUTTON_ID    : _ELEMENT_CONFIRM_BOX_NO_BUTTON_ID,
  }

  const _initializeFader = function() {
    USE_FADER = true;
  }

  const _crossFade2Images = function(selector) {
    let o = document.querySelector(selector);
    o.classList.toggle('transparent');
  }

  const _crossFadeMultipleImages = function(id, howManyTries) {
    // iterate through children
    let oChildren = document.getElementById(id).children;
    let imageToView = null;
    for (let i = 0; i < oChildren.length; i++) {
      // is it an img tag ?
      if (oChildren[i].tagName == "IMG") {
        // change opacity to 0 (transparent)
        oChildren[i].style.opacity = 0;
        if (i == howManyTries) {
          imageToView = oChildren[i];
        }
      }
    }
    // set the current image to view opaque
    if (imageToView != null) {
      imageToView.style.opacity = 1;
    }
  }

  const _showFader = function() {
    if (!USE_FADER) return;
    let o = document.getElementById(_ids.ELEMENT_FADER_ID);
    o.style.display = "inline";
    o.className     = "fadein";
  }
  const _hideFader = function() {
    if (!USE_FADER) return;
    document.getElementById(_ids.ELEMENT_FADER_ID).className = "fadeout";
  }

  const _showMessageBoxEx = function() {
    //"use strict";
    let o = document.getElementById(_ids.ELEMENT_MESSAGE_BOX_ID);
    o.style.display = "inline";
    if (USE_FADER) {
      o.className = "fadein";
    }
  }
  const _hideMessageBox = function() {
    if (USE_FADER) {
      document.getElementById(_ids.ELEMENT_MESSAGE_BOX_ID).className = "fadeout";
    }
    else {
      document.getElementById(_ids.ELEMENT_MESSAGE_BOX_ID).style.display = "none";
    }
  }
  const _showConfirmBoxEx= function() {
    let o = document.getElementById(_ids.ELEMENT_CONFIRM_BOX_ID);
    o.style.display = "inline";
    if (USE_FADER) {
      o.className = "fadein";
    }
  }
  const _hideConfirmBox = function() {
    if (USE_FADER) {
      document.getElementById(_ids.ELEMENT_CONFIRM_BOX_ID).className = "fadeout";
    }
    else {
      document.getElementById(_ids.ELEMENT_CONFIRM_BOX_ID).style.display = "none";
    }
  }

  const _onFaderAnimationEnd = function(e) {
    //console.log("onFaderAnimationEnd called");
    if (e.animationName == "halfFadeout") {
      document.getElementById(_ids.ELEMENT_FADER_ID).style.display = "none";
    }
  }
  const _onMessageBoxAnimationEnd = function(e) {
    //console.log("onMessageBoxAnimationEnd called");
    if (e.animationName == "fadeout") {
      document.getElementById(_ids.ELEMENT_MESSAGE_BOX_ID).style.display = "none";
    }
    if (e.animationName == "fadein") {
      document.getElementById(_ids.ELEMENT_MESSAGE_BOX_ID).style.display = "inline";
    }
  }
  const _onConfirmBoxAnimationEnd = function(e) {
    //console.log("onConfirmBoxAnimationEnd called");
    if (e.animationName == "fadeout") {
      document.getElementById(_ids.ELEMENT_CONFIRM_BOX_ID).style.display = "none";
    }
    if (e.animationName == "fadein") {
      document.getElementById(_ids.ELEMENT_CONFIRM_BOX_ID).style.display = "inline";
    }
  }

  const _showMessageBox = function(success, howManyTries) {
    const hmiMessages = i18n.getData();
    let msgBox = document.getElementById(_ids.ELEMENT_MESSAGE_BOX_ID);
    let msgBoxTitle = document.getElementById(_ids.ELEMENT_MESSAGE_BOX_TITLE_ID);
    if (success == true) {
      msgBoxTitle.innerHTML = hmiMessages.gameResultMessageBox.TitleSuccess;
    }
    else {
      msgBoxTitle.innerHTML = hmiMessages.gameResultMessageBox.TitleFail;
    }

    let msgBoxContent = document.getElementById(_ids.ELEMENT_MESSAGE_BOX_CONTENT_ID);
    msgBoxContent.innerHTML = hmiMessages.gameResultMessageBox.Content[howManyTries];

    let msgBoxButton = document.getElementById(_ids.ELEMENT_MESSAGE_BOX_BUTTON_CLOSE_ID);
    msgBoxButton.innerHTML = hmiMessages.ok;

    _showFader();
    _showMessageBoxEx();
  }

  const _closeMessageBox = function() {
    _hideFader();
    _hideMessageBox();
    GAME.disableKeyboard();
  }

  const _showConfirmBox = function(title, text, yesText, noText, yesCallback, noCallbak) {
    document.getElementById(_ids.ELEMENT_CONFIRM_BOX_TITLE_ID).innerHTML = title;
    document.getElementById(_ids.ELEMENT_CONFIRM_BOX_CONTENT_ID).innerHTML = text;

    var yesButton = document.getElementById(_ids.ELEMENT_CONFIRM_BOX_YES_BUTTON_ID);
    yesButton.innerHTML = yesText;
    yesButton.onclick   = yesCallback;

    var noButton = document.getElementById(_ids.ELEMENT_CONFIRM_BOX_NO_BUTTON_ID);
    noButton.innerHTML  = noText;
    noButton.onclick    = noCallbak;

    _showFader();
    _showConfirmBoxEx();
  }

  const _closeConfirmBox = function() {
    _hideFader();
    _hideConfirmBox();
  }

  const _setLayout = function(params) {
    const KNOWN_LAYOUTS = ['small', 'large', 'd1024x768'];
    const DEFAULT_LAYOUT = 'large';
    const document_body =  document.querySelector('body');

    // remove all layout classes
    KNOWN_LAYOUTS.forEach(
      (item) => {
        document_body.classList.remove(item);
      }
    )

    let selected_layout = DEFAULT_LAYOUT;

    // layout size parameter in url ?
    if (params && params.has('layout')) {
      let layout = params.get('layout');

      // now set the new layout
      if (layout && KNOWN_LAYOUTS.includes(layout)) {
        selected_layout = layout;
      }
    }
    else {
      // try to set the "best" layout
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0, window.visualViewport.width || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0, window.visualViewport.height || 0);
      if (vh < 768 || vw < 1024) {
        selected_layout = 'small';
      }
      // console.log('vw = ', vw, 'vh = ', vh);
    }
    document_body.classList.add(selected_layout);
  }

  return {
    ids: _ids,
    onFaderAnimationEnd: _onFaderAnimationEnd,
    onMessageBoxAnimationEnd: _onMessageBoxAnimationEnd,
    onConfirmBoxAnimationEnd: _onConfirmBoxAnimationEnd,

    initializeFader: _initializeFader,
    showConfirmBox: _showConfirmBox,
    closeConfirmBox: _closeConfirmBox,

    showMessageBox: _showMessageBox,
    closeMessageBox: _closeMessageBox,

    crossFadeMultipleImages: _crossFadeMultipleImages,

    setLayout: _setLayout
  }

})();