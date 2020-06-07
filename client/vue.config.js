const fs = require('fs');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  devServer: {
    port: 8081,
    disableHostCheck: true,
    https: {
      key: fs.readFileSync('serverKey.key', 'utf8'),
      cert: fs.readFileSync('serverCert.crt', 'utf8')
    },
  }
}
