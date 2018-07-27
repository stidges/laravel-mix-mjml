const mjml2html = require('mjml');
const glob = require('glob');
const fs = require('fs');

class MjmlPlugin {
    /**
     * Create a new MJML plugin instance.
     *
     * @param {String} inputPath
     * @param {String} outputPath
     * @param {String} extension
     * @param {Object} mjmlOptions
     */
    constructor (inputPath, outputPath, extension, mjmlOptions = {}) {
        this.outputPath = outputPath;
        this.inputPath = inputPath;
        this.extension = extension;
        this.mjmlOptions = mjmlOptions
    }

    /**
     * Apply the plugin.
     *
     * @param {Object} compiler
     */
    apply (compiler) {
        compiler.plugin('emit', (compilation, callback) => {
            const paths = glob.sync(`${this.inputPath}/**/*.mjml`);

            if (! paths.length) {
                callback();
            }

            paths.forEach(path => {
                const filePath = path.replace(this.inputPath, this.outputPath).replace('.mjml', this.extension);
                const response = mjml2html(fs.readFileSync(path, 'utf8'), this.mjmlOptions);

                if (response.errors.length) {
                    const errors = response.errors.map(err => err.formattedMessage).join('\n- ');
                    compilation.errors.push(`MJML compilation failed for "${path}"\n- ${errors}`);
                    return;
                }

                compilation.assets[filePath] = {
                    source: () => response.html,
                    size: () => response.html.length
                };
            });

            callback();
        });
    }
}

module.exports = MjmlPlugin;
