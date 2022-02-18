const { Compilation } = require('webpack');
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
        compiler.hooks.compilation.tap('MjmlPlugin', (compilation) => {
            compilation.hooks.processAssets.tap({
                name: 'MjmlPlugin',
                stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
            }, () => {
                this.toCompile.forEach(({ entry, output, mjmlOptions }) => {
                    compilation.fileDependencies.add(entry);

                    let response;

                    try {
                        response = mjml2html(fs.readFileSync(entry, 'utf8'), mjmlOptions);
                    } catch (e) {
                        response = { errors: [{ formattedMessage: e.toString() }] };
                    }

                    if (response.errors.length) {
                        const errors = response.errors.map(err => err.formattedMessage).join('\n- ');
                        compilation.errors.push(`MJML compilation failed for "${entry}"\n- ${errors}`);
                        return;
                    }

                    compilation.emitAsset(output, {
                        source: () => response.html,
                        size: () => response.html.length
                    });
                });
            });
       });
    }
}

module.exports = MjmlPlugin;
