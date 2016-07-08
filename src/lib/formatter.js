import {relative} from 'path';
import {red, yellow, green, underline} from 'chalk';
import table from 'text-table';

let logFrom = fromValue => {
    if (!fromValue.indexOf('<')) {
        return fromValue;
    }
    return relative(process.cwd(), fromValue);
};

function createResultsTable (messages) {
    const sorted = messages.sort((a, b) => b.time.s - a.time.s);
    const ten = Math.floor(sorted.length * 0.10);
    const twenty = Math.floor(sorted.length * 0.20);
    const output = table(sorted.map((message, index) => {
        if (index < ten) {
            return [message.plugin, red(message.formatted)];
        }
        if (index < twenty) {
            return [message.plugin, yellow(message.formatted)];
        }
        return [message.plugin, green(message.formatted)];
    }));

    return output;
}

export default function formatter (input) {
    const output = createResultsTable(input.messages);
    return `${underline(logFrom(input.source))}\n${output}`;
};

export function formatSummaryResults (resultsMap) {
    const results = Object.keys(resultsMap).map(k => ({plugin: k, ...resultsMap[k]}));
    const output = createResultsTable(results);
    return `${underline(`Summary`)}\n${output}`;
};
