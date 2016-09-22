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
                value: 1
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
        var moneyBet = Number(document.getElementById('money_amount_input').value);
        if (!isNaN(moneyBet) && moneyBet !== "") {
            this.player.cash -= moneyBet;
            this.moneyBet[this.player.currentDeckIndex] = moneyBet;
            this.GivePlayerCards();
            this.GiveDealerCards();
            var playerResult = this.GetResult('player', 0); // get result for first deck
            var dealerResult = this.GetResult('dealer');
            // check if both has blackjack
            if (playerResult === 'blackjack' && dealerResult === 'blackjack') {
                this.PullBecauseOfDraw(); // return bet
                this.EndGame(); // set all default values
            } else if (playerResult !== 'blackjack' && dealerResult === 'blackjack') {
                this.PlayerLooses(0, 'dealers blackjack');
                this.EndGame(); // set all default values
            } else if (playerResult === 'blackjack' && dealerResult !== 'blackjack') {
                this.player.cash += this.CalculatePrizeMoney('blackjack', this.moneyBet[0]);
                console.log('Players blackjack');
                this.EndGame();
            } else {
                this.player.canSplit = this.CanSplit();
                virtualDomHolder.dealBtn.disabled = true;
            }
            this.UpdateUI();
        }
    },

    Stand: function() {
        if (this.player.currentDeckIndex === 0 && this.player.canSplit) {
            this.player.currentDeckIndex++;
        } else if (this.player.currentDeckIndex === 1 && this.player.canSplit) {
            while (this.dealer.score < 17) {
                this.GiveDealerOneMoreCard();
            }
            this.UpdateUI();
        } else {
          while (this.dealer.score < 17) {
              this.GiveDealerOneMoreCard();
          }
          this.UpdateUI();
        }
    },

    EndGame: function() {
        this.moneyBet = [0, 0];
        this.player.cards = [
            [],
            []
        ];
        this.player.canSplit = false;
        this.player.score = [0, 0];
        this.player.currentDeckIndex = 0;
        this.dealer.cards = [];
        this.dealer.score = 0;
        virtualDomHolder.dealBtn.disabled = false;
        virtualDomHolder.hitBtn.disabled = false;
        virtualDomHolder.doubleBtn.disabled = false;
    },

    Split: function() {
        this.player.cards[1].push(this.player.cards[0].pop());
        this.player.cash -= this.moneyBet[0];
        this.moneyBet[1] = this.moneyBet[0];
        this.GivePlayerOneMoreCard(0); // 0-th deck
        this.GivePlayerOneMoreCard(1); // 1-st deck
        this.UpdatePlayer();
        this.UpdateBet();
    },

    Hit: function() {
        this.GivePlayerOneMoreCard(this.player.currentDeckIndex);
        var result = this.GetResult('player', this.player.currentDeckIndex);
        if (result === 'busted') {
            var deckIndex = this.player.currentDeckIndex;
            this.moneyBet[deckIndex] = 0;
            switch (deckIndex) {
                case 0:
                    {
                        if (this.player.canSplit) {
                            this.player.currentDeckIndex++; // move to next deck
                        } else {
                            virtualDomHolder.hitBtn.disabled = true;
                            // this.EndGame(); // end game if only deck was busted
                        }
                        break;
                    }
                case 1:
                    virtualDomHolder.hitBtn.disabled = true;
                    break; // end game if last deck was busted
            }
            console.log(`Deck ${deckIndex} busted`);
        }
        this.UpdatePlayer();
        this.UpdateBet();
    },


    Double: function() {
        this.player.cash -= this.moneyBet[this.player.currentDeckIndex];
        this.moneyBet[this.player.currentDeckIndex] *= 2;
        this.GivePlayerOneMoreCard(this.player.currentDeckIndex);
        var result = this.GetResult('player', this.player.currentDeckIndex);
        if (result === 'busted') {
            this.moneyBet[this.player.currentDeckIndex] = 0;
            this.PlayerLooses(this.player.currentDeckIndex, 'busted');
        }
        virtualDomHolder.doubleBtn.disabled = true;
        virtualDomHolder.hitBtn.disabled = true;
        this.UpdatePlayer();
        this.UpdateBet();
    },

    Surrender: function() {
        this.player.cash += (this.moneyBet[0] + this.moneyBet[1]);
        this.EndGame();
        this.UpdateUI();
    },

    PullBecauseOfDraw: function() {
        this.player.cash += (this.moneyBet[0] + this.moneyBet[1]);
        console.log('Pull');
    },

    PlayerLooses: function(deckIndex, reason) {
        console.log(`Deck ${deckIndex+1} lost! because of ${reason}`);
    },

    CalculatePrizeMoney: function(result, bet) {
        var currentDeckIndex = this.player.currentDeckIndex;
        if (result === 'blackjack') {
            return bet * 3;
        } else if (result === 'win') {
            return bet * 2;
        }
    },

    CanSplit: function() {
        if (this.player.cards[0][0].value === this.player.cards[0][1].value) {
            return true;
        }
        return false;
    },

    FillDeckIfNeeded: function() {
        if (this.cards.length < 104) {
            this.cards = this.cards.concat(deckGenerator.GetDeck());
        }
    },

    GetResult: function(playerOrDealer, deckIndex) {
        if (playerOrDealer === 'player') {
            var playerScore = this[playerOrDealer].score[deckIndex];
        } else {
            var playerScore = this[playerOrDealer].score;
        }
        if (playerScore.length === 2) {
            if (playerScore[1] === 21 && this.player.cards.length === 2) {
                return this.gameResults.blackjack;
            } else if (playerScore[0] === 21 || playerScore[1] === 21) {
                return this.gameResults.win;
            } else if (playerScore[0] > 21 && playerScore[1] > 21) {
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

    GetRandomCard: function() {
        var cardIndex = random.GetRandomInt(0, this.cards.length - 1);
        var card = this.cards[cardIndex];
        this.cards.splice(cardIndex, 1); // remove this card from deck
        this.FillDeckIfNeeded();
        return card;
    },

    GivePlayerCards: function() {
        this.player.cards[0] = [this.GetRandomCard(), this.GetRandomCard()];
        this.player.score[this.player.currentDeckIndex] = this.GetScore(this.player.cards[this.player.currentDeckIndex]);
    },

    GivePlayerOneMoreCard: function(indexOfDeck) {
        this.player.cards[indexOfDeck].push(this.GetRandomCard());
        this.player.score[indexOfDeck] = this.GetScore(this.player.cards[indexOfDeck]);
    },

    GiveDealerCards: function() {
        this.dealer.cards = [this.GetRandomCard(), this.GetRandomCard()];
        this.dealer.score = this.GetScore(this.dealer.cards);
    },

    GiveDealerOneMoreCard: function() {
        this.dealer.cards.push(this.GetRandomCard());
        this.dealer.score = this.GetScore(this.dealer.cards);
    },

    UpdateUI: function() {
        this.UpdatePlayer();
        this.UpdateDealer();
        this.UpdateBet();
        this.UpdateControls();
    },

    UpdateControls: function() {
        virtualDomHolder.splitBtn.disabled = !this.player.canSplit;
    },

    UpdatePlayer: function() {
        virtualDomHolder.playerCash.innerHTML = `Cash: ${this.player.cash}$`;
        virtualDomHolder.playerScore1.innerHTML = `Score1: ${this.player.score[0]}`;
        virtualDomHolder.playerScore2.innerHTML = `Score2: ${this.player.score[1]}`;
        virtualDomHolder.playerCards1.innerHTML = null;
        virtualDomHolder.playerCards2.innerHTML = null;
        for (var i = 0; i < this.player.cards.length; i++) {
            for (var j = 0; j < this.player.cards[i].length; j++) {
                var element = document.createElement('li');
                element.innerHTML = `${this.player.cards[i][j].name} of ${this.player.cards[i][j].suit}`;
                virtualDomHolder[`playerCards${i+1}`].appendChild(element);
            }

        }

    },

    UpdateDealer: function() {
        virtualDomHolder.dealerCards.innerHTML = null;
        for (var i = 0; i < this.dealer.cards.length; i++) {
            var element = document.createElement('li');
            element.innerHTML = `${this.dealer.cards[i].name} of ${this.dealer.cards[i].suit}`;
            virtualDomHolder.dealerCards.appendChild(element);
        }
        virtualDomHolder.dealerScore.innerHTML = `Score: ${this.dealer.score}`;
    },

    UpdateBet: function() {
        virtualDomHolder.moneyBet1.innerHTML = `$${this.moneyBet[0]}`;
        virtualDomHolder.moneyBet2.innerHTML = `$${this.moneyBet[1]}`;
    },

    gameResults: {
        blackjack: 'blackjack',
        win: 'win',
        busted: 'busted',
        pull: 'pull',
        nothing: 'nothing',
    },

    amountOfdecks: null,
    moneyBet: [0, 0],
    cards: [],
    dealer: {
        cards: [],
        score: 0
    },
    player: {
        cards: [
            [], // default first deck
            [] // second deck if player splits
        ],
        currentDeckIndex: 0,
        cash: 10000,
        score: [0, 0],
        canSplit: false,
    }
};
blackjack.Initialize(2);

var virtualDomHolder = {
    // elements
    dealerCards: document.getElementById('dealer_cards'),
    moneyBet1: document.getElementById('money_bet1'),
    moneyBet2: document.getElementById('money_bet2'),
    playerCards1: document.getElementById('player_cards1'),
    playerCards2: document.getElementById('player_cards2'),
    playerScore1: document.getElementById('player_score'),
    playerScore2: document.getElementById('player_score1'),
    playerCash: document.getElementById('player_cash'),
    dealerScore: document.getElementById('dealer_score'),
    // buttons
    dealBtn: document.getElementById('deal_btn'),
    doubleBtn: document.getElementById('double_btn'),
    hitBtn: document.getElementById('hit_btn'),
    standBtn: document.getElementById('stand_btn'),
    surrenderBtn: document.getElementById('surrender_btn'),
    splitBtn: document.getElementById('split_btn')
};
