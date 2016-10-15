var path = require('path');
var request = require('request');
var SOURCE = require('./lib/source');
var print = require('./lib/print');
var spawn = require('child_process').spawn;
var Entities = require('html-entities').AllHtmlEntities;
entities = new Entities();
var parseString = require('xml2js').parseString;
var which = require('shelljs').which;
var hasSay = !!which('say');
var Conf = require('conf');
var home = require('user-home');
var strip = require('strip-color');

var store = new Conf({
  cwd: path.join(home, '.fanyi'),
  configName: 'store',
  defaults: {
    words: []
  }
})

module.exports = function(word) {

  // say it
  if (hasSay) {
    spawn('say', [word]);
  }

  word = encodeURIComponent(word);

  // iciba
  request.get(SOURCE.iciba + word, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      parseString(body, function (err, result) {
        var output = print.iciba(result.dict);
        console.log(output);

        const storedWords = store.get('words');
        if (storedWords.indexOf(word) === -1) {
          store.set('words', [{word: word, content: strip(output).trim()}].concat(storedWords));
        }
      });
    }
  });

  // youdao
  // request.get(SOURCE.youdao + word, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     var data = JSON.parse(entities.decode(body));
  //     print.youdao(data);
  //   }
  // });

};
