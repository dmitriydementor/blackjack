"use strict";

var cardSuites = ['spades', // pika
    'hearts', // chirva
    'diamonds', // buba
    'clubs' // hresta
];

var Card = function(name, suit, value, alternativeValue) {
    this.name = name;
    this.suit = suit;
    this.value = value;
    if (alternativeValue === undefined) {
        this.alternativeValue = value;
    } else {
        this.alternativeValue = alternativeValue;
    }

};

var Player = function(userName, cash) {
    this.userName = userName;
    this.cash = cash;
};

var PlayerHand = function(cards, score, moneyBet) {
    this.cards = cards;
    this.score = score;
    this.moneyBet = moneyBet;
    this.GetScore = function() {
        var score1 = 0;
        var score2 = 0;
        for (var i = 0; i < cards.length; i++) {
            score1 += cards[i].value;
        }
        if (!this.HasAce()) {
            return score1;
        } else {
            for (var i = 0; i < cards.length; i++) {
                score2 += cards[i].alternativeValue;
            }
            if (score1 <= 21 && score2 <= 21) {
                return Math.max(score1, score2);
            } else if (score1 > 21 && score2 > 21) {
                return Math.min(score1, score2);
            } else if ((score1 <= 21 && score2 > 21) ||
                (score1 > 21 && score2 <= 21)) {
                this.SelectRightScore();
            }

        }
    };
    this.SelectRightScore = function(score1, score2) {
        if (score1 <= 21 && score2 > 21) {
            return score1;
        } else {
            return score2;
        }
    };
    this.HasAce = function() {
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].name === 'Ace') {
                return true;
            }
        }
        return false;
    };
};

var deckGenerator = {
    GetDeck: function() {
        var deck = [];
        // four suites
        for (var i = 0; i < 4; i++) {
            // fill numbers-cards
            for (var j = 2; j <= 10; j++) {
                deck.push(new Card(`${j}`, cardSuites[i], j));
                // end fill number-cards
            }
            deck.push(new Card('Jack', cardSuites[i], 10));
            deck.push(new Card('Queen', cardSuites[i], 10));
            deck.push(new Card('King', cardSuites[i], 10));
            deck.push(new Card('Ace', cardSuites[i], 1, 11));
            // end of suit gneration
        }
        return deck;
    }
};

var random = {
    GetRandomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};


var Blackjack = function(amountOfdecks) {
    if (amountOfdecks === undefined) {
        amountOfdecks = 2;
    }
    this.cards = [];
    for (var i = 0; i < amountOfdecks; i++) {
      this.cards = this.cards.concat(deckGenerator.GetDeck());
    }

};
