# node-multidoc

This is a port of a PHP library I wrote years ago for parsing what I call 'multidocs', a simple plain text document format designed for writing blog posts. A `multidoc` consists of a YAML preamble plus a sequence of typed content blocks, each of which may have an argument list in the form of key/value pairs. It looks like this:

    title: My First Post
    publish_date: 2013-10-29T21:30

    --- markdown

    # First Post

    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    --- image_gallery caption:"holiday photos!" rows:5 columns:5

    1.jpg
    2.jpg
    3.jpg
    4.jpg

    --- code language:javascript

    for (var k in foo) {
        console.log(k + " = " + foo[k]);
    }

    --- markdown

    ## Here's some more text content

    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
    quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
    proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

This library will parse the above document into the following Javascript structure:

    { blocks: 
       [ { type: 'markdown',
           args: {},
           content: '\n# First Post\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\nquis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\nconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\ncillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\nproident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\n' },
         { type: 'image_gallery',
           args: { caption: 'holiday photos!', rows: '5', columns: '5' },
           content: '\n1.jpg\n2.jpg\n3.jpg\n4.jpg\n\n' },
         { type: 'code',
           args: { language: 'javascript' },
           content: '\nfor (var k in foo) {\n    console.log(k + " = " + foo[k]);\n}\n\n' },
         { type: 'markdown',
           args: {},
           content: '\n## Here\'s some more text content\n\nLorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod\ntempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,\nquis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo\nconsequat. Duis aute irure dolor in reprehenderit in voluptate velit esse\ncillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non\nproident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n' } ],
      title: 'My First Post',
      publish_date: Tue Oct 29 2013 21:30:00 GMT+0000 (GMT) }

## Notes

  * "bool-ish" values (`true`, `false`, `yes`, `no`, `on`, `off`) in block argument lists will be converted to boolean values
  * any values (in YAML or argument lists) looking roughly like ISO-8601 dates will be converted into `Date` instances

## Usage

Get it:

    npm install multidoc

Use it:

    var fs = require('fs');
    var multidoc = require('multidoc');

    var parsed = multidoc(fs.readFileSync('./test/test.mdoc'));