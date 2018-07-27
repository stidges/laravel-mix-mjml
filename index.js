const mix = require('laravel-mix');
const MjmlPlugin = require('./plugin');

class Mjml {
    /**
     * The API name for the component.
     */
    name() {
        return 'mjml';
    }

    /**
     * Required dependencies for the component.
     */
    dependencies() {
        return ['mjml'];
    }

    /**
     * Register the component.
     *
     * @param {String} inputPath
     * @param {String} outputPath
     * @param {Object} options
     */
    register(inputPath = 'resources/mail', outputPath = 'resources/views/mail', options = {}) {
        this.inputPath = inputPath;
        this.outputPath = outputPath;
        this.extension = options.extension || '.blade.php';
        delete options.extension;
        this.mjmlOptions = options;
    }

    /**
     * Webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        return new MjmlPlugin(this.inputPath, this.outputPath, this.extension, this.mjmlOptions);
    }
}

mix.extend('mjml', new Mjml);
