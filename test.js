var fs = require('fs-extra');
var exec = require('child_process').exec;
var Promise = require('es6-promise').Promise;

var expect = require('chai').expect;

var FAILING_FILE = __dirname + '/tests/dummy/app/unused.js';

describe('ember-cli-jshint', function() {
  this.timeout(60000);

  afterEach(function() {
    fs.removeSync(FAILING_FILE);
  });

  it('passes if JSHint tests pass', function() {
    return emberTest().then(function(result) {
      expect(result.error).to.not.exist;
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 1 PhantomJS 2.1 - JSHint | app.js: should pass jshint')
        .to.contain('ok 2 PhantomJS 2.1 - JSHint | helpers/destroy-app.js: should pass jshint')
        .to.contain('ok 3 PhantomJS 2.1 - JSHint | helpers/module-for-acceptance.js: should pass jshint')
        .to.contain('ok 4 PhantomJS 2.1 - JSHint | helpers/resolver.js: should pass jshint')
        .to.contain('ok 5 PhantomJS 2.1 - JSHint | helpers/start-app.js: should pass jshint')
        .to.contain('ok 6 PhantomJS 2.1 - JSHint | resolver.js: should pass jshint')
        .to.contain('ok 7 PhantomJS 2.1 - JSHint | router.js: should pass jshint')
        .to.contain('ok 8 PhantomJS 2.1 - JSHint | test-helper.js: should pass jshint')
        .to.not.contain('not ok 9 PhantomJS 2.1 - JSHint | unused.js: should pass jshint');
    })
  });

  it('fails if a JSHint tests fails', function() {
    fs.outputFileSync(FAILING_FILE, 'let unused = 6;\n');

    return emberTest().then(function(result) {
      expect(result.error).to.exist;
      expect(result.stdout.match(/[^\r\n]+/g))
        .to.contain('ok 1 PhantomJS 2.1 - JSHint | app.js: should pass jshint')
        .to.contain('ok 2 PhantomJS 2.1 - JSHint | helpers/destroy-app.js: should pass jshint')
        .to.contain('ok 3 PhantomJS 2.1 - JSHint | helpers/module-for-acceptance.js: should pass jshint')
        .to.contain('ok 4 PhantomJS 2.1 - JSHint | helpers/resolver.js: should pass jshint')
        .to.contain('ok 5 PhantomJS 2.1 - JSHint | helpers/start-app.js: should pass jshint')
        .to.contain('ok 6 PhantomJS 2.1 - JSHint | resolver.js: should pass jshint')
        .to.contain('ok 7 PhantomJS 2.1 - JSHint | router.js: should pass jshint')
        .to.contain('ok 8 PhantomJS 2.1 - JSHint | test-helper.js: should pass jshint')
        .to.contain('not ok 9 PhantomJS 2.1 - JSHint | unused.js: should pass jshint');
    })
  });
});

function emberTest() {
  return new Promise(function(resolve) {
    exec('node_modules/.bin/ember test', { cwd: __dirname }, function (error, stdout, stderr) {
      resolve({
        error: error,
        stdout: stdout,
        stderr: stderr,
      });
    });
  });
}
