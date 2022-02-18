const mix = require('laravel-mix');
const { TempSandbox } = require('temp-sandbox');
const webpack = require('webpack');
const webpackConfig = require('laravel-mix/setup/webpack.config');
const Mix = require('laravel-mix/src/Mix');
const path = require('path');
const fs = require('fs');
require('../index');

const sandbox = new TempSandbox({ randomDir: true });

jest.setTimeout(60000);

beforeEach(async () => await sandbox.clean());
afterAll(async () => await sandbox.destroySandbox());

test('it works', (done) => {
    mix.disableNotifications();
    Mix.primary.paths.setRootPath(path.resolve(__dirname, 'fixture'))
    mix.setPublicPath(sandbox.path.resolve('public'));
    mix.mjml(path.resolve(__dirname, 'fixture/src/test.mjml'), sandbox.path.resolve('dist'), {
        extension: '.html',
    });

    webpackConfig().then(config => {
        webpack(config, (err, stats) => {
            if (err) {
                return done(err);
            } else if (stats.hasErrors()) {
                return done(new Error(stats.toString()));
            }

            try {
                const html = fs.readFileSync(sandbox.path.resolve('dist/test.html'), 'utf8');
                expect(html).toMatch('__FOO__');
                expect(html).toMatch('__BAR__');
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});

test('it gracefully handles invalid mjml errors', (done) => {
    mix.disableNotifications();
    Mix.primary.paths.setRootPath(path.resolve(__dirname, 'fixture'))
    mix.setPublicPath(sandbox.path.resolve('public'));
    mix.mjml(path.resolve(__dirname, 'fixture/src/invalid.mjml'), sandbox.path.resolve('dist'), {
        extension: '.html',
    });

    webpackConfig().then(config => {
        webpack(config, (err, stats) => {
            try {
                expect(err).toBeNull();
                expect(stats.hasErrors()).toBe(true);
                const details = stats.toJson();
                expect(details.errors).toHaveLength(1);
                expect(details.errors[0].message).toEqual(
                    expect.stringContaining('MJML compilation failed')
                );
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});
