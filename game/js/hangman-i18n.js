const i18n = (function() {
  const _DATA =
  [
    {
      langCode: "fr",
      startGame: "Jouer",
      stopGame: "Arrêter",
      yes: "Oui",
      no: "Non",
      ok: "OK",
      cancel: "Annuler",
      dictionary: "Dictionnaire :",
      gameResultMessageBox: {
        TitleSuccess:"BRAVO !",
        TitleFail   :"DESOLÉ !",
        Content     : [
          "Vous êtes trop fort !",
          "Vous êtes très, très fort !",
          "Vous êtes très fort !",
          "Très bien.",
          "Bien.",
          "Assez bien.",
          "Peux mieux faire ;-)",
          "Il était moins une...",
          "Arrrrgh !<br>Pas de chance !"
        ]
      },
      clearScoreMessageBox: {
        Title: "Confirmation",
        Content: "Effacer les scores ?"
      },
      stopGameMessageBox: {
        Title: "Confirmation",
        Content: "Interrompre le jeu ?"
      }
    },
    {
      langCode: "en",
      startGame: "Play",
      stopGame: "Stop",
      yes: "Yes",
      no: "Non",
      ok: "OK",
      cancel: "Cancel",
      dictionary: "Dictionary:",
      gameResultMessageBox: {
        TitleSuccess:"CONGRATULATIONS !",
        TitleFail   :"SORRY !",
        Content     : [
          "You are so smart !",
          "You are very, very smart !",
          "You are very smart !",
          "Well done.",
          "Good.",
          "Good.",
          "You should do better ;-)",
          "One more step and you will be hanged...",
          "Ooooops !<br>No luck !"
        ]
      },
      clearScoreMessageBox: {
        Title: "Confirmation",
        Content: "Clear the score ?"
      },
      stopGameMessageBox: {
        Title: "Confirmation",
        Content: "Stop the game now ?"
      }
    }

  ];

  let _i18n_data = _DATA[0];


  const _initializeHmiMessages = function(langCode) {
    let index = 0;

    for (let i = 0; i < _DATA.length; i++) {
      if (_DATA[i].langCode == langCode) {
        index = i;
        break;
      }
    }

    _i18n_data = _DATA[index];
    // static texts for play and stop game keyboard keys
    document.getElementById("keyPlay").innerHTML = _i18n_data.startGame;
    document.getElementById("keyStop").innerHTML = _i18n_data.stopGame;
    document.querySelector("span.dictionaries-selector > span").innerHTML = _i18n_data.dictionary;
    PARAMETERS.storeLanguage(_i18n_data.langCode);
    return _i18n_data.langCode;
  }

  return {
    initializeHmiMessages: _initializeHmiMessages,
    getData: function(){return _i18n_data}
  }
})();