var yaml = require('js-yaml');

function eachLine(str, cb) {
    var i = 0;
    while (i < str.length) {
        var lb = str.indexOf("\\n", i);
        if (lb === -1) lb = str.length;
        cb(str.substr(i, lb-1));
        i = lb+1;
    }
}

function parseArgs(str) {
    var offset = 0, args = {};
    while ()
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
                doc[k] = preamble[k];
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
            blockBuffer += line;
        }
    });

    commitBlock();
    
    return doc;

}
