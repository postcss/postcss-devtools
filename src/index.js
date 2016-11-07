import postcss from 'postcss';
import pretty from 'pretty-hrtime';
import reporter from 'postcss-reporter';
import convert from 'convert-hrtime';
import isPromise from 'is-promise';
import {hrtimeAdd} from 'jsprim';
import formatter, {formatSummaryResults} from './lib/formatter';

const updateSummary = (summary, {plugin, rawTime}, {precise}) => {
    const summaryForPlugin = summary[plugin] || {rawTime: [0, 0]};
    const newRawTime = hrtimeAdd(summaryForPlugin.rawTime, rawTime);
    const formatted = pretty(newRawTime, {precise});
    const text = 'Completed in ' + pretty(newRawTime, {precise});
    const time = convert(newRawTime);
    return {
        ...summary,
        [plugin]: {rawTime: newRawTime, formatted, text, time},
    };
};

function getMessage (plugin, completed, precise) {
    const formatted = pretty(completed, {precise});
    return {
        plugin,
        formatted,
        text: `Completed in ${formatted}`,
        time: convert(completed),
        rawTime: completed,
    };
}

export default postcss.plugin('postcss-devtools', (opts) => {
    const {precise, silent} = {
        precise: false,
        silent: false,
        ...opts,
    };

    let summaryResults = {};

    const devtools = (css, result) => {
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
                            const message = getMessage(proc.postcssPlugin, completed, precise);
                            res.messages.push(message);
                            summaryResults = updateSummary(summaryResults, message, {precise, silent});
                            resolve();
                        });
                    } else {
                        completed = process.hrtime(timer);
                        const message = getMessage(proc.postcssPlugin, completed, precise);
                        res.messages.push(message);
                        summaryResults = updateSummary(summaryResults, message, {precise, silent});
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

    devtools.printSummary = () => {
        console.log(formatSummaryResults(summaryResults));
    };

    return devtools;
});
