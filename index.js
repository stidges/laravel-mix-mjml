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
        this.outputPath = this.makeOutputPath(outputPath);
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

    /**
     * Make the given output path relative to the mix root.
     *
     * @param {String} outputPath
     */
    makeOutputPath(outputPath) {
        if (outputPath.substr(0, 1) === '.') {
            // User has explicitly defined a path.
            return outputPath;
        }

        const rootPath = Mix.paths.root();
        const publicPath = mix.config.publicPath;
        const relative = path.relative(publicPath, rootPath);

        if (relative.length) {
            outputPath = `${relative}/${outputPath}`.replace(/\/{2,}/g, '/');
        }

        return outputPath;
    }
}

mix.extend('mjml', new Mjml);
