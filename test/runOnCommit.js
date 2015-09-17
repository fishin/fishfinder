var Code = require('code');
var Lab = require('lab');
var Hapi = require('hapi');

var FishFinder = require('..');

var internals = {
    defaults: {
        dirPath: __dirname + '/tmp/runs',
        workspace: 'workspace',
        configFile: 'config.json'
    }
};

var lab = exports.lab = Lab.script();
var expect = Code.expect;
var describe = lab.describe;
var it = lab.it;

describe('runOnCommit', function () {

    it('createRun', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        var commands = ['uptime'];
        var scm = {
            type: 'git',
            url: 'https://github.com/fishin/pail',
            runOnCommit: true,
            branch: 'master'
        };
        var run = fishFinder.createRun(scm, commands);
        expect(run.id).to.exist();
        done();
    });

    it('getRuns', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        var runs = fishFinder.getRuns();
        expect(runs.length).to.equal(1);
        done();
    });

    it('startRun', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        var runId = fishFinder.getRuns()[0].id;
        fishFinder.startRun(runId, function () {

            var runs = fishFinder.getRuns();
            expect(runs[0].status).to.equal('started');
            done();
        });
    });

    it('getRun', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        var runId = fishFinder.getRuns()[0].id;
        var run = fishFinder.getRun(runId);
        var interval = setInterval(function () {

            run = fishFinder.getRun(runId);
            if (run.finishTime) {
                //console.log(run);
                expect(run.checkout).to.exist();
                expect(run.checkout.status).to.equal('succeeded');
                expect(run.commit).to.exist();
                clearInterval(interval);
                done();
            }
        }, 1000);
    });

    it('createRun 2', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        var commands = ['uptime'];
        var scm = {
            type: 'git',
            url: 'https://github.com/fishin/pail',
            runOnCommit: true,
            branch: 'master'
        };
        var run = fishFinder.createRun(scm, commands);
        expect(run.id).to.exist();
        done();
    });

    it('startRun 2', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        var runId = fishFinder.getRuns()[1].id;
        fishFinder.startRun(runId, function () {

            var runs = fishFinder.getRuns();
            expect(runs.length).to.equal(1);
            done();
        });
    });

    it('deleteRuns', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        fishFinder.deleteRuns();
        var runs = fishFinder.getRuns();
        expect(runs.length).to.equal(0);
        done();
    });

    it('deleteWorkspace', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        fishFinder.deleteWorkspace();
        done();
    });
});
