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

describe('none', function () {

    it('createRun', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        var commands = ['uptime'];
        var scm = {
            type: 'none'
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
                expect(run.checkout).to.not.exist();
                expect(run.commit).to.not.exist();
                expect(run.status).to.equal('succeeded');
                clearInterval(interval);
                done();
            }
        }, 1000);
    });

    it('deleteRuns', function (done) {

        var fishFinder = new FishFinder(internals.defaults);
        fishFinder.deleteRuns();
        var runs = fishFinder.getRuns();
        expect(runs.length).to.equal(0);
        done();
    });
});
