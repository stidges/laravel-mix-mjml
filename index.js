const path = require('path');
const glob = require('glob');
const mix = require('laravel-mix');
const MjmlPlugin = require('./plugin');
const File = require('laravel-mix/src/File')

class Mjml {
    constructor() {
        this.toCompile = [];
    }

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
     * @param {String} entry
     * @param {String} output
     * @param {Object} options
     */
    register(entry = 'resources/mail', output = 'resources/views/mail', options = {}) {
        options.sourceRoot = path.normalize(this.findSourceRoot(entry));

        if (entry.includes('*')) {
            entry = glob.sync(entry);
        } else if (! /\.mjml$/.test(entry)) {
            entry = glob.sync(path.join(entry, '**/*.mjml'));
        }

        options.extension = options.extension || '.blade.php';
        options.mjmlOptions = Object.assign({
            minify: false,
            beautify: true,
        }, options.mjmlOptions || {});

        output = new File(output);
        this.toCompile.push(
            ...[].concat(entry).map(file => this.buildToCompileEntry(new File(file), output, options))
        );
    }

    /**
     * Webpack plugins to be appended to the master config.
     */
    webpackPlugins() {
        return new MjmlPlugin(this.toCompile);
    }

    /**
     * Build a toCompile entry for the given entry/output files.
     *
     * @param {File} entry
     * @param {File} output
     * @param {Object} options
     */
    buildToCompileEntry(entry, output, options) {
        const result = {
            entry: entry.path(),
            mjmlOptions: Object.assign({
                filePath: entry.path()
            }, options.mjmlOptions),
        };

        if (! output.isDirectory()) {
            result.output = this.relativeToPublicPath(output.relativePath());
        } else {
            result.output = this.relativeToPublicPath(
                entry.relativePath()
                    .replace(options.sourceRoot, output.relativePath())
                    .replace(/\.mjml$/, options.extension)
            );
        }

        return result;
    }

    /**
     * Find the common source root for the entry path.
     *
     * @param {String} entry
     */
    findSourceRoot(entry) {
        if (! entry.includes('*')) {
            return /\.mjml$/.test(entry) ? path.dirname(entry) : entry;
        }

        const segments = entry.replace(/\\/g, '/').split('/');

        return segments.slice(0, segments.findIndex(segment => segment.includes('*'))).join('/');
    }

    /**
     * Make the given output path path relative to the public path.
     *
     * @param {String} outputPath
     */
    relativeToPublicPath(outputPath) {
        return path.join(
            path.relative(Mix.paths.root(Config.publicPath), Mix.paths.root()),
            outputPath.replace(/\\/g, '/')
        );
    }
}

mix.extend('mjml', new Mjml);
