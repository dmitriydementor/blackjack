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
    test.test('Hand testing.', function() {
        test.assert(
            (new PlayerHand([new Card('Ace', 'test', 1, 11), new Card('Jack', 'test', 10, 10)], 0)).GetScore() === 21,
            'PlayerHand.GetScore() testing on blackjack combination');
        test.assert(
            (new PlayerHand([new Card('Ace', 'test', 1, 11), new Card('Jack', 'test', 10, 10), new Card('10', 'test', 10, 10)], 0)).GetScore() === 21,
            'PlayerHand.GetScore() testing on 21 non-blackjack combination');
        test.assert((new PlayerHand([new Card('Ace', 'test', 1, 11), new Card('Jack', 'test', 10, 10)], 0)).IsBlackjack() === true,
            'PlayerHand.IsBlackjack() testing on blackjack combination');
        test.assert(
            (new PlayerHand([new Card('Ace', 'test', 1, 11), new Card('Jack', 'test', 10, 10), new Card('10', 'test', 10, 10)], 0)).IsBlackjack() === false,
            'PlayerHand.GetScore() testing on 21 non-blackjack combination');
        test.assert(
            new PlayerHand([new Card('8', 'test', 8, 8), new Card('9', 'test', 9, 9), new Card('6', 'test', 6, 6)], 0, 'test').CompareTo(
                new PlayerHand([new Card('10', 'test', 10, 10), new Card('9', 'test', 9, 9), new Card('6', 'test', 6, 6)], 0, 'test')
            ) === 0,
            'Comparing hands testing'
        );
        test.assert(
            new PlayerHand([new Card('Ace', 'test', 1, 1), new Card('10', 'test', 10, 10), new Card('10', 'test', 10, 10)], 0, 'test').CompareTo(
                new PlayerHand([new Card('10', 'test', 10, 10), new Card('9', 'test', 9, 9), new Card('6', 'test', 6, 6)], 0, 'test')
            ) > 0,
            'Comparing hands testing'
        );

    });
};
