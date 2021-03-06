import {Datasource} from "../module";
import Q from "q";

describe('GenericDatasource', function() {
	console.log("GenericDatasource");
    var ctx = {};

    beforeEach(function() {
    	console.log(ctx);
        ctx.$q = Q;
        ctx.backendSrv = {};
        ctx.templateSrv = {};
        ctx.ds = new Datasource({}, ctx.$q, ctx.backendSrv, ctx.templateSrv);
        console.log(ctx.ds);
    });

    it('should return an empty array when no targets are set', function(done) {
    	console.log("no targets are set");
        ctx.ds.query({targets: []}).then(function(result) {
            expect(result.data).to.have.length(0);
            done();
        });
    });

    it('should return the server results when a target is set', function(done) {
    	console.log("a target is set");
        ctx.backendSrv.datasourceRequest = function(request) {
            return ctx.$q.when({
                _request: request,
                data: [
                    {
                        target: 'X',
                        datapoints: [1, 2, 3]
                    }
                ]
            });
        };

        ctx.templateSrv.replace = function(data) {
          return data;
        }

        ctx.ds.query({targets: ['hits']}).then(function(result) {
            expect(result._request.data.targets).to.have.length(1);

            var series = result.data[0];
            expect(series.target).to.equal('X');
            expect(series.datapoints).to.have.length(3);
            done();
        });
    });

    it ('should return the metric results when a target is null', function(done) {
    	console.log("a target is null");
        ctx.backendSrv.datasourceRequest = function(request) {
            return ctx.$q.when({
                _request: request,
                data: [
                    "metric_0",
                    "metric_1",
                    "metric_2",
                ]
            });
        };

        ctx.templateSrv.replace = function(data) {
            return data;
        }

        ctx.ds.metricFindQuery({target: null}).then(function(result) {
            expect(result).to.have.length(3);
            expect(result[0].text).to.equal('metric_0');
            expect(result[0].value).to.equal('metric_0');
            expect(result[1].text).to.equal('metric_1');
            expect(result[1].value).to.equal('metric_1');
            expect(result[2].text).to.equal('metric_2');
            expect(result[2].value).to.equal('metric_2');
            done();
        });
    });

    it ('should return the metric target results when a target is set', function(done) {
    	console.log("a target is set");
        ctx.backendSrv.datasourceRequest = function(request) {
            var target = request.data.target;
            var result = [target + "_0", target + "_1", target + "_2"];

            return ctx.$q.when({
                _request: request,
                data: result
            });
        };

        ctx.templateSrv.replace = function(data) {
            return data;
        }

        ctx.ds.metricFindQuery('search').then(function(result) {
            expect(result).to.have.length(3);
            expect(result[0].text).to.equal('search_0');
            expect(result[0].value).to.equal('search_0');
            expect(result[1].text).to.equal('search_1');
            expect(result[1].value).to.equal('search_1');
            expect(result[2].text).to.equal('search_2');
            expect(result[2].value).to.equal('search_2');
            done();
        });
    });

    it ('should return the metric results when the target is an empty string', function(done) {
    	console.log("a target is an empty string");
        ctx.backendSrv.datasourceRequest = function(request) {
            return ctx.$q.when({
                _request: request,
                data: [
                    "metric_0",
                    "metric_1",
                    "metric_2",
                ]
            });
        };

        ctx.templateSrv.replace = function(data) {
            return data;
        }

        ctx.ds.metricFindQuery('').then(function(result) {
            expect(result).to.have.length(3);
            expect(result[0].text).to.equal('metric_0');
            expect(result[0].value).to.equal('metric_0');
            expect(result[1].text).to.equal('metric_1');
            expect(result[1].value).to.equal('metric_1');
            expect(result[2].text).to.equal('metric_2');
            expect(result[2].value).to.equal('metric_2');
            done();
        });
    });

    it ('should return the metric results when the args are an empty object', function(done) {
    	console.log("args are an empty object");
        ctx.backendSrv.datasourceRequest = function(request) {
            return ctx.$q.when({
                _request: request,
                data: [
                    "metric_0",
                    "metric_1",
                    "metric_2",
                ]
            });
        };

        ctx.templateSrv.replace = function(data) {
            return data;
        }

        ctx.ds.metricFindQuery().then(function(result) {
            expect(result).to.have.length(3);
            expect(result[0].text).to.equal('metric_0');
            expect(result[0].value).to.equal('metric_0');
            expect(result[1].text).to.equal('metric_1');
            expect(result[1].value).to.equal('metric_1');
            expect(result[2].text).to.equal('metric_2');
            expect(result[2].value).to.equal('metric_2');
            done();
        });
    });

    it ('should return the metric target results when the args are a string', function(done) {
    	console.log("args are a sting");
        ctx.backendSrv.datasourceRequest = function(request) {
            var target = request.data.target;
            var result = [target + "_0", target + "_1", target + "_2"];

            return ctx.$q.when({
                _request: request,
                data: result
            });
        };

        ctx.templateSrv.replace = function(data) {
            return data;
        }

        ctx.ds.metricFindQuery('search').then(function(result) {
            expect(result).to.have.length(3);
            expect(result[0].text).to.equal('search_0');
            expect(result[0].value).to.equal('search_0');
            expect(result[1].text).to.equal('search_1');
            expect(result[1].value).to.equal('search_1');
            expect(result[2].text).to.equal('search_2');
            expect(result[2].value).to.equal('search_2');
            done();
        });
    });

    it ('should return data as text and as value', function(done) {
    	console.log("data as text and as value");
        var result = ctx.ds.mapToTextValue({data: ["zero", "one", "two"]});

        expect(result).to.have.length(3);
        expect(result[0].text).to.equal('zero');
        expect(result[0].value).to.equal('zero');
        expect(result[1].text).to.equal('one');
        expect(result[1].value).to.equal('one');
        expect(result[2].text).to.equal('two');
        expect(result[2].value).to.equal('two');
        done();
    });

    it ('should return text as text and value as value', function(done) {
    	console.log("text as text and value as value");
        var data = [
            {text: "zero", value: "value_0"},
            {text: "one", value: "value_1"},
            {text: "two", value: "value_2"},
        ];

        var result = ctx.ds.mapToTextValue({data: data});

        expect(result).to.have.length(3);
        expect(result[0].text).to.equal('zero');
        expect(result[0].value).to.equal('value_0');
        expect(result[1].text).to.equal('one');
        expect(result[1].value).to.equal('value_1');
        expect(result[2].text).to.equal('two');
        expect(result[2].value).to.equal('value_2');
        done();
    });

    it ('should return data as text and index as value', function(done) {
    	console.log("data as text and index as value");
        var data = [
            {a: "zero", b: "value_0"},
            {a: "one", b: "value_1"},
            {a: "two", b: "value_2"},
        ];

        var result = ctx.ds.mapToTextValue({data: data});

        expect(result).to.have.length(3);
        expect(result[0].text).to.equal(data[0]);
        expect(result[0].value).to.equal(0);
        expect(result[1].text).to.equal(data[1]);
        expect(result[1].value).to.equal(1);
        expect(result[2].text).to.equal(data[2]);
        expect(result[2].value).to.equal(2);
        done();
    });
});
