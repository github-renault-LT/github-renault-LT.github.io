const PARAMETERS = (function() {

  const _STORAGE_KEY = "hangman-data";
  const _DEFAULT_STORAGE_DATA = {
    total: 0,
    found: 0,
    language: "fr",
    dictionary: "default"
  }
  let _STORAGE_DATA = {};

  const _init = function() {
    try {
      const data = JSON.parse(window.localStorage.getItem(_STORAGE_KEY));
      if (data != null) {
        _STORAGE_DATA = { ..._DEFAULT_STORAGE_DATA, ...data };
      }
      else {
        _STORAGE_DATA = { ..._DEFAULT_STORAGE_DATA, ...{} };
      }
    }
    catch (ex) {
      _STORAGE_DATA = { ..._DEFAULT_STORAGE_DATA, ...{} };
    }
  }

  const _getData = function() {
    try {
      const data = JSON.parse(window.localStorage.getItem(_STORAGE_KEY));
      if (data != null) {
        return data;
      }
      else {
        return _STORAGE_DATA;
      }
    }
    catch (ex) {
      return _STORAGE_DATA;
    }
  }

  const _saveData = function() {
    const data = JSON.stringify(_STORAGE_DATA);
    window.localStorage.setItem(_STORAGE_KEY, data);
  }

  const _storeScore = function(wordsFound, wordsTotal, saveNow = false) {
    _STORAGE_DATA.found = wordsFound;
    _STORAGE_DATA.total = wordsTotal;
    if (saveNow === true) {
      _saveData();
    }
  }

  const _getScore = function() {
    const data = _getData();
    return {
      found: data.found,
      total: data.total
    }
  }

  const _clearScore = function(saveNow = false) {
    _storeScore(0, 0);
    if (saveNow === true) {
      _saveData();
    }
  }

  const _storeLanguage = function(langCode, saveNow = false) {
    _STORAGE_DATA.language = langCode;
    if (saveNow === true) {
      _saveData();
    }
  }

  const _getLanguage = function() {
    const data = _getData();
    let lang = data.language;
    if (lang == null) {
      lang = "fr";
    }
    return lang;
  }

  const _storeDictionary = function(dictionary_name, saveNow = false) {
    _STORAGE_DATA.dictionary = dictionary_name;
    if (saveNow === true) {
      _saveData();
    }
  }

  const _getDictionary = function() {
    const data = _getData();
    let dictionary = data.dictionary;
    // console.log("storage _getDictionary():", dictionary)
    if (dictionary == null) {
      dictionary = "default";
    }
    return dictionary;
  }

  return {
    getScore       : _getScore,
    storeScore     : _storeScore,
    getLanguage    : _getLanguage,
    storeLanguage  : _storeLanguage,
    getDictionary  : _getDictionary,
    storeDictionary: _storeDictionary,
    save           : _saveData,
    init           : _init
  }

})();