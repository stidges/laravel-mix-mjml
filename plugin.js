const mjml2html = require('mjml');
const fs = require('fs');

class MjmlPlugin {
    /**
     * Create a new MJML plugin instance.
     *
     * @param {Array} toCompile
     */
    constructor(toCompile) {
        this.toCompile = toCompile;
    }

    /**
     * Apply the plugin.
     *
     * @param {Object} compiler
     */
    apply(compiler) {
        compiler.plugin('emit', (compilation, callback) => {
            this.toCompile.forEach(({ entry, output, mjmlOptions }) => {
                if (compilation.fileDependencies.add) {
                    compilation.fileDependencies.add(entry);
                } else {
                    compilation.fileDependencies.push(entry);
                }

                const response = mjml2html(fs.readFileSync(entry, 'utf8'), mjmlOptions);

                if (response.errors.length) {
                    const errors = response.errors.map(err => err.formattedMessage).join('\n- ');
                    compilation.errors.push(`MJML compilation failed for "${entry}"\n- ${errors}`);
                    return;
                }

                compilation.assets[output] = {
                    source: () => response.html,
                    size: () => response.html.length
                };
            });

            callback();
        });
    }
}

module.exports = MjmlPlugin;
