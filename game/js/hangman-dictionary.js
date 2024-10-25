const DICTIONARY = (function() {
  let _options = {};

  let _currentPointer  = 0;

  let _dictionaryData = [];

  let _dictionaryIndex;

  function _createIndex() {
    let i;
    _dictionaryIndex = new Array(_dictionaryData.length);
    for (i = 0; i < _dictionaryIndex.length; i++) {
      _dictionaryIndex[i] = i;
    }
    _shuffleArray(_dictionaryIndex);
  }

  function _shuffleArray(a) {
      var j, x, i;
      for (i = a.length; i; i--) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
      }
  }

  function _getNextData() {
    let data;
    if ((_currentPointer < 0) || (_currentPointer >= _dictionaryData.length)) {
      _currentPointer = 0;
    }
    data = _dictionaryData[_dictionaryIndex[_currentPointer]];

    _currentPointer++;
    if (_currentPointer >= _dictionaryIndex.length) {
      _shuffleArray(_dictionaryIndex);
      _currentPointer = 0;
    }
    return data;
  }

  function _fetchDictionary(url = null) {
    let dictionary_url;
    if (url == null) {
      dictionary_url = _getSelectedDictionaryUrl();
    }
    else {
      dictionary_url = url;
    }
    fetch(dictionary_url, {
      method: "GET"
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      // console.log(data)
      if (data.length) {
        _dictionaryData = data;
        _createIndex();
        _currentPointer = 0;
        PARAMETERS.storeDictionary(_getSelectedDictionary(), true);
        // console.log("_fetchDictionary selected = ", _getSelectedDictionaryUrl())
      }
    })
    .catch( (err) => {
      console.log("FETCH ERROR :", err)
    }); 
  }
  
  function _getDictionaryUrl(filename) {
    return `${_options.base_dir}/${filename}`;
  }

  function _getSelectedDictionary() {
    return document.querySelector("#dictionaries-selector").value;
  }

  function _getSelectedDictionaryUrl() {
    const list = document.querySelector("#dictionaries-selector");
    console.log(list)
    console.log(list.options)
    return _getDictionaryUrl(list.options[list.selectedIndex].dataset.file);
  }
  
  function _buildDictionariesSelector(target_selector) {
    const list_url = _getDictionaryUrl(_options.list);
    
    fetch(list_url, {
      method: "GET"
    })
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      // console.log(data)
      if (data.length) {
        const target = document.querySelector(target_selector);
        target.parentNode.classList.remove('v-hidden');
        target.addEventListener(
          'change',
          (ev) => {
            // console.log(ev.target);
            _fetchDictionary(_getDictionaryUrl(ev.target.options[ev.target.selectedIndex].dataset.file));
          }
        );
        const default_dictionary = PARAMETERS.getDictionary();
        
        data.forEach(
          (item) => {
            // console.log(item)
            const opt = document.createElement("option");
            opt.dataset.file = item.f;
            opt.value = item.n;
            opt.innerHTML = item.d;

            // console.log(item, default_dictionary)

            if (item.n == default_dictionary) {
              opt.setAttribute("selected", "");
              // load the selected dictionary
              _fetchDictionary(_getDictionaryUrl(item.f));
            }
            if (item.hasOwnProperty("v")) {
              if (item.v != false) {
                target.appendChild(opt);
              }
            }
            else {
              target.appendChild(opt);
            }
          }
        )
        
      }
    })
    .catch( (err) => {
      console.log("FETCH ERROR :", err)
    });
  }

  function _initialize(options = {}) {
    _options = {
      ...{base_dir: "dictionaries", list: "_index.json"}, 
      ...options
    }
  }

  return {
    initialize: _initialize,
    createIndex    : _createIndex,
    fetchDictionary: _fetchDictionary,
    getNextData    : _getNextData,
    currentPointer : _currentPointer,
    buildDictionariesSelector: _buildDictionariesSelector,
    getSelectedDictionary: _getSelectedDictionary
  }

})();