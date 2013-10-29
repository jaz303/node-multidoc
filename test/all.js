var test = require('tape');
var multidoc = require('../');
var fs = require('fs');

function parse() {
    return multidoc(fs.readFileSync(__dirname + '/test.mdoc', 'utf8'));
}

test('preamble', function(t) {

    var doc = parse();

    t.equal('My First Post', doc.title);
    t.ok(doc.publish_date instanceof Date);

    t.equal(2013, doc.publish_date.getFullYear());
    t.equal(   9, doc.publish_date.getMonth());
    t.equal(  29, doc.publish_date.getDate());
    t.equal(  21, doc.publish_date.getHours());
    t.equal(  30, doc.publish_date.getMinutes());
    t.equal(  00, doc.publish_date.getSeconds());

    t.end();

});

test('blocks', function(t) {

    var doc = parse();

    t.equal(4, doc.blocks.length);
    t.equal('markdown', doc.blocks[0].type);
    t.equal('image_gallery', doc.blocks[1].type);
    t.equal('code', doc.blocks[2].type);
    t.equal('markdown', doc.blocks[3].type);

    t.end();

});

test('block args', function(t) {

    var doc = parse();

    t.deepEqual({caption: 'holiday photos!', rows: '5', columns: '5', show_enlarge: true}, doc.blocks[1].args);
    t.deepEqual({language: 'javascript'}, doc.blocks[2].args);

    t.end();

});