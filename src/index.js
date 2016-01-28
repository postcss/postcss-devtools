import {plugin} from 'postcss';
import pretty from 'pretty-hrtime';
import reporter from 'postcss-reporter';
import convert from 'convert-hrtime';
import formatter from './lib/formatter';
import isPromise from 'is-promise';

export default plugin('postcss-devtools', (opts) => {
    const {precise, silent} = {
        precise: false,
        silent: false,
        ...opts
    };
    return (css, result) => {
        result.processor.plugins = result.processor.plugins.map(proc => {
            if (proc.postcssPlugin === 'postcss-devtools') {
                return proc;
            }
            let wrappedPlugin = (styles, res) => {
                let completed;
                return new Promise(resolve => {
                    const timer = process.hrtime();
                    const p = proc(styles, res);
                    if (isPromise(p)) {
                        p.then(() => {
                            completed = process.hrtime(timer);
                            res.messages.push({
                                plugin: proc.postcssPlugin,
                                formatted: pretty(completed, {precise: precise}),
                                text: 'Completed in ' + pretty(completed, {precise: precise}),
                                time: convert(completed),
                                rawTime: completed
                            });
                            resolve();
                        });
                    } else {
                        completed = process.hrtime(timer);
                        res.messages.push({
                            plugin: proc.postcssPlugin,
                            formatted: pretty(completed, {precise: precise}),
                            text: 'Completed in ' + pretty(completed, {precise: precise}),
                            time: convert(completed),
                            rawTime: completed
                        });
                        resolve();
                    }
                });
            };
            
            wrappedPlugin.postcssPlugin = proc.postcssPlugin;
            wrappedPlugin.postcssVersion = proc.postcssVersion;
            
            return wrappedPlugin;
        });
        
        if (!silent) {
            result.processor.use(reporter({formatter: formatter}));
        }
    };
});
