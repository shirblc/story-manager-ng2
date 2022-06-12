const dotenv = require('dotenv').config();
const fs = require('fs');
const { dist } = require('./gulpfile');

// Run build
dist();

// Environment files can be accessed via process.env.<var_name>; here you can
// replace static text with your Heroku environment variables. Since this runs
// at build time, the variables will be replaced with your configured values.
const watcher = fs.watch('dist', {}, (eventType, filename) => {
  console.log(`${eventType} happened on file ${filename}`);

  // JS bunldle compilation takes the longest, so it's safest to wait on that.
  if(filename == 'app.bundle.min.js') {
    // Update env vars
    fs.readFile('dist/app.bundle.min.js', 'utf8', function (err,data) {
      if (err) {
        console.log(err);
        return;
      }

      var result = data.replace(/ENV_VARS/g,
        `<ENV_VARS>`);
      console.log("Updated environment variables. Proceeding to write the file");

      fs.writeFile('dist/app.bundle.min.js', result, 'utf8', function (err) {
        if (err) {
           console.log(err);
           return;
         }
      });

      fs.unwatchFile('dist');
      watcher.close();
    });
  }
})
