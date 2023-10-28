const MagicString = require("magic-string");
const fs = require("fs");

/**
 * Rollup plugin that replaces the Angular templateUrl in test files with
 * the inlined template. Originally written as a Browserify transform:
 * https://github.com/shirblc/angular-gulp/pull/1
 *
 * Inspited by @rollup/plugin-replce
 * https://github.com/rollup/plugins/blob/master/packages/replace/src/index.js
 */
exports.inlineComponentTemplate = function() {
  return {
    name: 'plugin-inline-template',
    transform(code) {
      const magicString  = new MagicString(code);

      magicString.replace(/(templateUrl:'.)(.*)(.component.html')/, (match) => {
        const componentName = match.substring(15, match.length-16);
        if(componentName == 'my') return match;

        const componentTemplateURL = componentName == 'app'
          ? __dirname + `/src/app/${componentName}.component.html`
          : __dirname + `/src/app/components/${componentName}/${componentName}.component.html`;

        componentTemplate = fs.readFileSync(componentTemplateURL);

        return `template: \`${componentTemplate}\``;
      })

      return {
        code: magicString.toString(),
        map: magicString.generateMap()
      }
    }
  }
}


/**
 * Sets the angular environment to production.
 * Originally written as a Browserify transform:
 * https://github.com/sendahug/send-hug-frontend/blob/c783442236d07d4aa9d7439b3bc74e450bf4b5ec/gulpfile.js#L232
 */
exports.setProductionEnv = function() {
  return {
    name: 'production-setter',
    transform(code) {
      const magicString = new MagicString(code);
      let tempString = magicString.toString();

      const environment = tempString.match(/environments\/environment/);

      if(environment) {
        const start = environment.index;
        const end = start + environment[0].length;
        const newString = `environments/environment.prod`;

        magicString.overwrite(start, end, newString);
      }

      return {
        code: magicString.toString(),
        map: magicString.generateMap()
      }
    }
  }
}


/**
 * Updates each component's template URL to the production
 * structure.
 */
exports.updateComponentTemplateUrl = function () {
  return {
    name: "plugin-template-updater",
    transform(code) {
      const magicString = new MagicString(code);

      magicString.replace(/(templateUrl: '.)(.*)(.component.html)/g, (match) => {
        const componentName = match.substring(15, match.length-15);
        return `templateUrl: './app/${componentName}.component.html`;
      });

      return {
        code: magicString.toString(),
        map: magicString.generateMap(),
      };
    },
  };
};
