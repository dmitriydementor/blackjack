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
    this.playerHands = [];
    this.currentHandIndex = 0;
};

var PlayerHand = function(cards, moneyBet) {
    this.cards = cards;
    this.moneyBet = moneyBet;
};

PlayerHand.prototype.GetScore = function() {
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
            return this.SelectRightScore(score1, score2);
        }

    }
};

PlayerHand.prototype.SelectRightScore = function(score1, score2) {
    if (score1 <= 21 && score2 > 21) {
        return score1;
    } else {
        return score2;
    }
};

PlayerHand.prototype.HasAce = function() {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].name === 'Ace') {
            return true;
        }
    }
    return false;
};

PlayerHand.prototype.CanSplit = function() {
    if (this.cards.length === 2) {
        if (this.cards[0].value === this.cards[1]) {
            return true;
        }
    }
    return false;
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

Blackjack.prototype.Deal = function() {

};


var Controls = function() {
    this.dealBtn = document.getElementById('deal_btn');
    this.doubleBtn = document.getElementById('double_btn');
    this.hitBtn = document.getElementById('hit_btn');
    this.surrenderBtn = document.getElementById('surrender_btn');
    this.splitBtn = document.getElementById('split_btn');
    this.standBtn = document.getElementById('stand_btn');
    this.amountSelectors = []; // numbers to be displayed as coins with its value
};

Controls.prototype.SetAmountSelectors = function() {
    var moneyAmount = player.cash;
    var amountNumberLength = moneyAmount.toString().length; // get length to create divider
    var divider = '1';

    for (var i = 0; i < amountNumberLength - 1; i++) {
        divider += '0';
    }

    while (amountNumberLength !== 0) {

    }
};



/**
 * ========================================================================================================================================
 * Game instances go here
 */

var player = new Player('dmitriydementor', 10000);
var blackjack = new Blackjack(2);
var controls = new Controls();
