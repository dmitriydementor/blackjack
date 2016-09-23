"use strict";

var Test = function() {
    var results;
    this.assert = function assert(expression, description) {
        var li = document.createElement('li');
        li.className = expression ? 'pass' : 'fail';
        li.appendChild(document.createTextNode(description));
        results.appendChild(li);
        if (!expression) {
            li.parentNode.parentNode.className = 'fail';
        }
        return li;
    };
    this.test = function test(name, func) {
        results = document.getElementById('test_results');
        results = this.assert(true, name).appendChild(
            document.createElement('ul')
        );
        func();
    };
};

var test = new Test();

window.onload = function() {
    test.test('A test.', function() {
        test.assert(true, 'First assertion completed');
        test.assert(true, 'second assertion completed');
        test.assert(false, 'third assertion completed');
    });
};
