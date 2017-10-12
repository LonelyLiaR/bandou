require('./check-versions')()

var config = require('../config')
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
}

var opn = require('opn')
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var request = require('request')
var rp = require('request-promise')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// automatically open browser, if not set will be false
var autoOpenBrowser = !!config.dev.autoOpenBrowser
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var interface = express()
var compiler = webpack(webpackConfig)

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: false,
  heartbeat: 2000
})
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({
      action: 'reload'
    })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = {
      target: options
    }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, express.static('./static'))

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
  _resolve = resolve
})

console.log('> Starting dev server...')
devMiddleware.waitUntilValid(() => {
  console.log('> Listening at ' + uri + '\n')
  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
  _resolve()
})

// Movie
interface.get('/movie_annual2016', function (req, res) {
  request(`https://movie.douban.com/ithil_j/activity/movie_annual2016`, function (err, response, body) {
    res.end(body);
  })
})
interface.get('/movie_annual2016/widget', function (req, res) {
  var nth = req.query.nth || 0;
  request(`https://movie.douban.com/ithil_j/activity/movie_annual2016/widget/${nth}`, function (err, response, body) {
    res.end(body);
  })
})
// Game
interface.get('/game_annual2016', function (req, res) {
  request({
    url: `https://www.douban.com/ithil_j/activity/game_annual2016`,
    headers: {
      'User-Agent': 'request'
    }
  }, function (err, response, body) {
    res.end(body);
  })
})
interface.get('/game_annual2016/widget', function (req, res) {
  var nth = req.query.nth || 0;
  request({
    url: `https://www.douban.com/ithil_j/activity/game_annual2016/widget/${nth}`,
    headers: {
      'User-Agent': 'request'
    }
  }, function (err, response, body) {
    res.end(body);
  })
})
// Book
interface.get('/book_annual2016', function (req, res) {
  request(`https://book.douban.com/ithil_j/activity/book_annual2016`, function (err, response, body) {
    res.end(body);
  })
})
interface.get('/book_annual2016/widget', function (req, res) {
  var nth = req.query.nth || 0;
  request(`https://book.douban.com/ithil_j/activity/book_annual2016/widget/${nth}`, function (err, response, body) {
    res.end(body);
  })
})
// Drama
interface.get('/drama_annual2016', function (req, res) {
  request({
    url: `https://www.douban.com/ithil_j/activity/drama_annual2016`,
    headers: {
      'User-Agent': 'request'
    }
  }, function (err, response, body) {
    res.end(body);
  })
})
interface.get('/drama_annual2016/widget', function (req, res) {
  var nth = req.query.nth || 0;
  request({
    url: `https://www.douban.com/ithil_j/activity/drama_annual2016/widget/${nth}`,
    headers: {
      'User-Agent': 'request'
    }
  }, function (err, response, body) {
    res.end(body);
  })
})
// Music
interface.get('/music_annual2016', function (req, res) {
  request(`https://music.douban.com/ithil_j/activity/music_annual2016`, function (err, response, body) {
    res.end(body);
  })
})
interface.get('/music_annual2016/widget', function (req, res) {
  var nth = req.query.nth || 0;
  request(`https://music.douban.com/ithil_j/activity/music_annual2016/widget/${nth}`, function (err, response, body) {
    res.end(body);
  })
})
interface.get('/resources', function (req, res) {
  var resources = req.query.request || null;
  var resType = req.query.type || null;
  if (resources.substr(0, 4) != 'http') resources = `http:${resources}`
  var options = {
    url: resources,
    encoding: null
  };
  if (resType == 'video') {
    res.setHeader('Content-Type', 'video/mp4');
  } else if (resType == 'image') {
    res.setHeader('Content-Type', 'image/jpeg');
  }
  rp(options).then(function (repos) {
    res.send(repos);
  });
})

var server = app.listen(port)
var IFserver = interface.listen(parseInt(port) + 1)

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
    IFserver.close()
  }
}
