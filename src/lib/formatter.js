import {red, yellow, green, underline} from 'chalk';
import {relative} from 'path';
import table from 'text-table';

let logFrom = fromValue => {
    if (!fromValue.indexOf('<')) {
        return fromValue;
    }
    return relative(process.cwd(), fromValue);
};

export default function formatter (input) {
    const messages = input.messages.sort((a, b) => b.time.s - a.time.s);
    const ten = Math.floor(messages.length * 0.10);
    const twenty = Math.floor(messages.length * 0.20);
    
    const output = table(messages.map((message, index) => {
        if (index < ten) {
            return [message.plugin, red(message.formatted)];
        }
        if (index < twenty) {
            return [message.plugin, yellow(message.formatted)];
        }
        return [message.plugin, green(message.formatted)];
    }));
    
    return `${underline(logFrom(input.source))}\n${output}`;
};
