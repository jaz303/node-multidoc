var yaml = require('js-yaml');

function eachLine(str, cb) {
    str.split("\n").forEach(function(line) {
        cb(line);
    });
}

function maybeDate(val) {
    // ISO8601 but allow a missing seconds field
    // TODO: should support RFC 2822 too
    var m;
    if ((typeof val === 'string') && (m = val.match(/^\s*(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(:(\d{2}))?\s*$/))) {
        val = val.trim();
        if (!m[6]) val += ':00';
        return new Date(Date.parse(val));
    } else {
        return val;    
    }
}

function parseArgs(str) {
    var args = {}, matches;
    
    while (matches = str.match(/^\s*(\w+):\s*/)) {
        var key = matches[1], val;
        str = str.substring(matches[0].length);
        if (str.match(/^['"]/)) {
            var o = 0, q = str.charAt(o++);
            val = '';
            while (o < str.length) {
                var c = str.charAt(o++);
                if (c === '\\') {
                    o++;
                } else if (c === q) {
                    args[key] = val;
                    break;
                }
                val += c;
            }
            str = str.substring(o);
        } else if (matches = str.match(/^([^\s]+)/)) {
            val = matches[0];
            str = str.substring(matches[0].length);
        } else {
            throw new Error("invalid argument string");
        }
        if (val === 'true' || val === 'yes' || val === 'on') {
            val = true;
        } else if (val === 'false' || val === 'no' || val === 'off') {
            val = false;
        } else {
            val = maybeDate(val);
        }
        args[key] = val;
    }

    if (!str.match(/^\s*$/)) {
        throw new Error("invalid argument string");
    }

    return args;
}

function parse(str) {

    var doc = { blocks: [] };

    var blockType   = null,
        blockArgs   = [],
        blockBuffer = '';

    function commitBlock() {
        if (blockType === null) {
            var preamble = yaml.load(blockBuffer);
            for (var k in preamble) {
                doc[k] = maybeDate(preamble[k]);
            }
        } else {
            doc.blocks.push({
                type    : blockType,
                args    : blockArgs,
                content : blockBuffer
            });
        }
    }

    eachLine(str, function(line) {
        var matches = line.match(/^--- (\w+)(.*?)$/);
        if (matches) {
            commitBlock();
            blockType = matches[1];
            blockArgs = parseArgs(matches[2]);
            blockBuffer = '';
        } else {
            blockBuffer += line + "\n";
        }
    });

    commitBlock();
    
    return doc;

}
