const dotenv = require('dotenv').config();
var fs = require('fs')

// Environment files can be accessed via process.env.<var_name>; here you can
// replace static text with your Heroku environment variables. Since this runs
// at build time, the variables will be replaced with your configured values.
fs.readFile('dist/app.bundle.min.js', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/ENV_VARS/g,
    `<ENV_VARS>`);

  fs.writeFile('dist/app.bundle.min.js', result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});
