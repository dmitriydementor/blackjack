"use strict";

var cardSuites = ['spades', // pika
    'hearts', // chirva
    'diamonds', // buba
    'clubs' // hresta
];

var deckGenerator = {
    GetDeck: function() {
        var deck = [];
        // four suites
        for (var i = 0; i < 4; i++) {
            // fill numbers-cards
            for (var j = 2; j <= 10; j++) {
                deck.push({
                    name: `${j}`,
                    suit: cardSuites[i],
                    value: j,
                });
                // end fill number-cards
            }
            deck.push({
                name: 'Jack',
                suit: cardSuites[i],
                value: 10
            });
            deck.push({
                name: 'Queen',
                suit: cardSuites[i],
                value: 10
            });
            deck.push({
                name: 'King',
                suit: cardSuites[i],
                value: 10
            });
            deck.push({
                name: 'Ace',
                suit: cardSuites[i],
                value: [1, 11]
            });
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

var blackjack = {
    Initialize: function(amountOfdecks) {
        console.log('Initialization started');
        this.amountOfdecks = amountOfdecks;
        this.cardsCount = this.amountOfdecks * 52;
        for (var i = 0; i < this.amountOfdecks; i++) {
            this.cards = this.cards.concat(deckGenerator.GetDeck());
        }
    },
    StartGame: function() {
        console.log("Game started");
        document.getElementById('start_btn').disabled = true;
        this.UpdateUI();
    },

    Deal: function() {
        var moneyBet = document.getElementById('money_amount_input').value;
        if (!isNaN(moneyBet)) {
            this.player.cash -= moneyBet;
            this.moneyBet = moneyBet;
            this.GivePlayerCards();
            this.GiveDealerCards();
            this.player.score = this.GetScore(this.player.cards);
            this.dealer.score = this.GetScore(this.dealer.cards);
            if (this.player.score.length === 2) { // if Ace presents
                if (this.player.score[1] === 21) { // players blackjack
                    if (this.dealer.score.length === 2) {

                    }
                }
            }
            this.UpdatePlayer();
            this.UpdateBet();
            this.UpdateDealer();
        }
    },

    GetPlayerResult: function() {
        var playerScore = this.player.score;
        if (playerScore.length === 2) {
            if (playerScore[1] === 21 && this.player.cards.length === 2) {
                return this.gameResults.blackjack;
            } else if (playerScore[0] === 21 || playerScore[1] === 21) {
                return this.gameResults.win;
            } else if (playerScore[0] > 21 || playerScore[1] > 21) {
                return this.gameResults.busted;
            } else {
                return this.gameResults.nothing;
            }

        } else {
            if (playerScore[0] === 21) {
                return this.gameResults.win;
            } else if (playerScore[0] > 21) {
                return this.gameResults.busted;
            } else {
                return this.gameResults.nothing;
            }
        }
    },

    CanSplit: function() {
        if (this.player.cards[0].name === this.player.cards[1].name) {
            return true;
        }
        return false;
    },

    GetScore: function(cards) {
        // check if Ace presents
        var isAcePresent = false;
        for (var i = 0; i < cards.length; i++) {
            if (cards[i].name == 'Ace') {
                isAcePresent = true;
                break;
            }
        }
        var score = [0];
        if (isAcePresent) {
            score = [0, 0]; // score can be different if Ace is present
            for (var i = 0; i < cards.length; i++) {
                if (cards[i].name == 'Ace') {
                    score[0] += 1;
                    score[1] += 11;
                } else {
                    score[0] += cards[i].value;
                    score[1] += cards[i].value;
                }
            }
        } else {
            for (var i = 0; i < cards.length; i++) {
                score[0] += cards[i].value;
            }
        }
        return score;
    },

    PrintRandomLog: function() {
        for (var i = 0; i < this.cardsCount; i++) {
            console.log(this.GetRandomCard());
        }
    },

    GetRandomCard: function() {
        var cardIndex = random.GetRandomInt(0, this.cards.length - 1);
        var card = this.cards[cardIndex];
        this.cards.splice(cardIndex, 1);
        return card;
    },

    GivePlayerCards: function() {
        this.player.cards = [this.GetRandomCard(), this.GetRandomCard()];
    },

    GivePlayerOneMoreCard: function() {
        this.player.cards.push(this.GetRandomCard());
    },

    GiveDealerCards: function() {
        this.dealer.cards = [this.GetRandomCard(), this.GetRandomCard()];
    },

    GiveDealerOneMoreCard: function() {
        this.dealer.cards.push(this.GetRandomCard());
    },

    UpdateUI: function() {
        this.UpdatePlayer();
        this.UpdateDealer();
        this.UpdateBet();
    },

    UpdatePlayer: function() {
        virtualDomHolder.playerCash.innerHTML = `Cash: ${this.player.cash}$`;
        virtualDomHolder.playerScore.innerHTML = `Score: ${this.player.score}`;
        virtualDomHolder.playerCards.innerHTML = null;
        for (var i = 0; i < this.player.cards.length; i++) {
            var element = document.createElement('li');
            element.innerHTML = `${this.player.cards[i].name} of ${this.player.cards[i].suit}`;
            virtualDomHolder.playerCards.appendChild(element);
        }
    },

    UpdateDealer: function() {
        virtualDomHolder.dealerCards.innerHTML = null;
        for (var i = 0; i < this.dealer.cards.length; i++) {
            var element = document.createElement('li');
            element.innerHTML = `${this.dealer.cards[i].name} of ${this.dealer.cards[i].suit}`;
            virtualDomHolder.dealerCards.appendChild(element);
        }
    },

    UpdateBet: function() {
        virtualDomHolder.moneyBet.innerHTML = `$${this.moneyBet}`;
    },

    gameResults: {
        blackjack: 'blackjack',
        win: 'win',
        busted: 'busted',
        pull: 'pull',
        nothing: 'nothing',
    },

    amountOfdecks: null,
    moneyBet: 0,
    cardsCount: null,
    cards: [],
    dealer: {
        cards: [],
        score: null
    },
    player: {
        cards: [],
        cash: 10000,
        score: null
    }
};
blackjack.Initialize(2);

var virtualDomHolder = {
    // elements
    dealerCards: document.getElementById('dealer_cards'),
    moneyBet: document.getElementById('money_bet'),
    playerCards: document.getElementById('player_cards'),
    playerScore: document.getElementById('player_score'),
    playerCash: document.getElementById('player_cash'),
    // buttons
    dealBtn: document.getElementById('deal_btn'),
    doubleBtn: document.getElementById('double_btn'),
    hitBtn: document.getElementById('hit_btn'),
    standBtn: document.getElementById('stand_btn'),
    surrenderBtn: document.getElementById('surrender_btn'),
    splitBtn: document.getElementById('split_btn')
};
