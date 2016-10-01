"use strict";

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
    this.TakeBets = function() {
        for (var i = 0; i < this.playerHands.length; i++) {
            this.cash += this.playerHands[i].moneyBet;
        }
    };
    this.GoToNextDeck = function() {
        if (this.currentHandIndex === this.playerHands.length - 1) {
            return false;
        } else {
            this.playerHands[this.currentHandIndex].status = '';
            this.currentHandIndex++;
            this.playerHands[this.currentHandIndex].status = 'active';
            return true;
        }
    };
};

var PlayerHand = function(cards, moneyBet, status) {
    this.cards = cards;
    this.moneyBet = moneyBet;
    this.wasDoubled = false;
    this.status = status;

};

PlayerHand.prototype.GetScore = function() {
    var score1 = 0;
    var score2 = 0;
    for (var i = 0; i < this.cards.length; i++) {
        score1 += this.cards[i].value;
    }
    if (!this.HasAce()) {
        return score1;
    } else {
        for (var i = 0; i < this.cards.length; i++) {
            score2 += this.cards[i].alternativeValue;
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
    for (var i = 0; i < this.cards.length; i++) {
        if (this.cards[i].name === 'Ace') {
            return true;
        }
    }
    return false;
};

PlayerHand.prototype.CanSplit = function() {
    if (this.cards.length === 2) {
        if (this.cards[0].value === this.cards[1].value) {
            return true;
        }
    }
    return false;
};

PlayerHand.prototype.IsBlackjack = function() {
    if (this.cards.length === 2 && this.GetScore() === 21) {
        return true;
    } else {
        return false;
    }
};

PlayerHand.prototype.CompareTo = function(anotherObj) {
    var score1 = this.GetScore() > 21 ? 0 : this.GetScore();
    var score2 = anotherObj.GetScore() > 21 ? 0 : anotherObj.GetScore();
    return score1 - score2;
};

var Blackjack = function(amountOfdecks) {
    if (amountOfdecks === undefined) {
        amountOfdecks = 2;
    }
    this.cards = [];
    for (var i = 0; i < amountOfdecks; i++) {
        this.cards = this.cards.concat(deckGenerator.GetDeck());
    }
    this.GetRandomCard = function() {
        var cardIndex = random.GetRandomInt(0, this.cards.length - 1);
        var card = this.cards[cardIndex];
        this.cards.splice(cardIndex, 1); // remove this card from deck
        this.FillDeckIfNeeded();
        return card;
    };

    this.FillDeckIfNeeded = function() {
        if (this.cards.length < 52) {
            this.cards = this.cards.concat(deckGenerator.GetDeck());
        }
    };

    this.CheckForBlackJack = function(playerHand, dealerHand) {
        var playersBlackjack = playerHand.IsBlackjack(),
            dealersBlackjack = dealerHand.IsBlackjack();
        if (playersBlackjack && !dealersBlackjack) {
            return 'playersBlackjack';
        } else if (!playersBlackjack && dealersBlackjack) {
            return 'dealersBlackjack';
        } else if (playersBlackjack && dealersBlackjack) {
            'bothBlackjack';
        } else {
            return 'nothing';
        }
    };

    this.Deal = function() {
        controls.dealBtn.disabled = true;
        var moneyBet = 100;
        player.cash -= moneyBet;
        player.playerHands.push(
            new PlayerHand([blackjack.GetRandomCard(), blackjack.GetRandomCard()], moneyBet, 'active')
        );
        player.currentHandIndex = 0;
        dealer.dealerHand = new PlayerHand([blackjack.GetRandomCard(), blackjack.GetRandomCard()], 0);
        var result = this.CheckForBlackJack(player.playerHands[0], dealer.dealerHand);
        switch (result) {
            case 'playersBlackjack':
                {
                    player.playerHands[0].status = 'blackjack';
                    break;
                }
            case 'dealersBlackjack':
                {
                    player.playerHands[0].status = 'Dealers blackjack';
                    break;
                }
            case 'bothBlackjack':
                {
                    player.playerHands[0].status = 'both blackjack';
                    break;
                }
            case 'nothing':
                {
                    controls.doubleBtn.disabled = controls.hitBtn.disabled = controls.surrenderBtn.disabled = controls.standBtn.disabled = false;
                    gameuielements.UpdateCash(player.cash);
                    gameuielements.UpdateHands(player.playerHands);
                    gameuielements.UpdateDealer(dealer.dealerHand);
                    controls.splitBtn.disabled = !player.playerHands[0].CanSplit();
                }

        }
    };
    this.Double = function() {
        player.playerHands[player.currentHandIndex].moneyBet *= 2;
        player.playerHands[player.currentHandIndex].cards.push(this.GetRandomCard());
        var goToNextDeck = player.GoToNextDeck();
        gameuielements.UpdateHand(player.currentHandIndex, player.playerHands[player.currentHandIndex]);
        if (!goToNextDeck) {
            controls.doubleBtn.disabled = true;
            controls.hitBtn.disabled = true;
            controls.surrenderBtn.disabled = true;
            this.SetResults();
        }

    };
    this.Hit = function() {
        player.playerHands[player.currentHandIndex].cards.push(this.GetRandomCard());
        gameuielements.UpdateHand(player.currentHandIndex, player.playerHands[player.currentHandIndex]);
        var score = player.playerHands[player.currentHandIndex].GetScore();
        if (score > 21) {
            player.playerHands[player.currentHandIndex].status = 'busted';
            var goToNextDeck = player.GoToNextDeck();
            alert('GO to next deck');
            if (!goToNextDeck) {
                controls.hitBtn.disabled = true;
                controls.doubleBtn.disabled = true;
                controls.surrenderBtn.disabled = true;

                this.SetResults();
            }
            gameuielements.UpdateHands(player.playerHands);
        }
    };
    this.Stand = function() {
        var goToNextDeck = player.GoToNextDeck();
        if (!goToNextDeck) { // if last hand
            controls.standBtn.disabled = true;
            this.FillDealersHand();
            gameuielements.UpdateDealer(dealer.dealerHand);
            this.SetResults();
        }
        gameuielements.UpdateHands(player.playerHands);
    };
    this.SetResults = function() {
        for (var i = 0; i < player.playerHands.length; i++) {
            if ((player.playerHands[i].GetScore() > 21) ||
                (player.playerHands[i].GetScore() > 21 && dealer.dealerHand.GetScore() > 21)) {
                player.playerHands[i].status = 'busted';
            } else if (player.playerHands[i].GetScore() <= 21 && dealer.dealerHand.GetScore() > 21) {
                player.playerHands[i].status = 'win';
            } else {
                if (player.playerHands[i].CompareTo(dealer.dealerHand) > 0) {
                    player.playerHands[i].status = 'win';
                } else if (player.playerHands[i].CompareTo(dealer.dealerHand) < 0) {
                    player.playerHands[i].status = 'loose';
                } else {
                    player.playerHands[i].status = 'pull';
                }
            }
        }
    };
    this.Split = function() {
        var card = player.playerHands[player.currentHandIndex].cards.pop();
        player.playerHands.push(new PlayerHand([card, this.GetRandomCard()], player.playerHands[player.currentHandIndex].moneyBet));
        player.playerHands[player.currentHandIndex].cards.push(this.GetRandomCard());
        gameuielements.UpdateHands(player.playerHands);
        if (!player.playerHands[player.currentHandIndex].CanSplit()) {
            controls.splitBtn.disabled = true;
        }
    };
    this.FillDealersHand = function() {
        while (dealer.dealerHand.GetScore() < 17) {
            dealer.dealerHand.cards.push(this.GetRandomCard());
        }
    };
    this.EndGame = function() {
        player.playerHands = [];
        dealer.dealerHand = null;
        controls.StartNewGame();
        gameuielements.UpdateCash(player.cash);
        gameuielements.UpdateHands(player.playerHands);
    };

};

var Controls = function() {
    this.dealBtn = document.getElementById('deal_btn');
    this.doubleBtn = document.getElementById('double_btn');
    this.hitBtn = document.getElementById('hit_btn');
    this.surrenderBtn = document.getElementById('surrender_btn');
    this.splitBtn = document.getElementById('split_btn');
    this.standBtn = document.getElementById('stand_btn');
    this.StartNewGame = function() {
        this.dealBtn.disabled = false;
        this.doubleBtn.disabled = true;
        this.hitBtn.disabled = true;
        this.surrenderBtn.disabled = true;
        this.splitBtn.disabled = true;
        this.standBtn.disabled = true;
    };
};

var GameUIElements = function() {
    this.playerHandsContainer = document.getElementById('player_hands_container');
    this.UpdateHands = function(playerHands) {
        this.playerHandsContainer.innerHTML = null;
        for (var i = 0; i < playerHands.length; i++) {
            var playerHandElement = document.createElement('div');
            playerHandElement.className = 'player_hand';
            playerHandElement.id = `player_hand${i}`;
            var cardsElement = document.createElement('ul');
            for (var j = 0; j < playerHands[i].cards.length; j++) {
                var li = document.createElement('li');
                li.innerHTML = `${playerHands[i].cards[j].name} of ${playerHands[i].cards[j].suit}`;
                cardsElement.appendChild(li);
            }
            playerHandElement.appendChild(cardsElement);
            var score = document.createElement('span');
            score.innerHTML = `Score: ${playerHands[i].GetScore()}`;
            playerHandElement.appendChild(score);
            playerHandElement.appendChild(document.createElement('br'));

            var moneyBet = document.createElement('span');
            moneyBet.innerHTML = `$${playerHands[i].moneyBet}`;
            playerHandElement.appendChild(moneyBet);

            var status = document.createElement('span');
            status.innerHTML = playerHands[i].status;
            playerHandElement.appendChild(document.createElement('br'));
            playerHandElement.appendChild(status);
            this.playerHandsContainer.appendChild(playerHandElement);
        }
    };
    this.dealerHand = document.getElementById('dealer_hand_container');
    this.UpdateHand = function(handIndex, playerHand) {
        var id = `player_hand${handIndex}`;
        var hand = document.getElementById(id);
        hand.innerHTML = null;
        var cardsElement = document.createElement('ul');
        for (var j = 0; j < playerHand.cards.length; j++) {
            var li = document.createElement('li');
            li.innerHTML = `${playerHand.cards[j].name} of ${playerHand.cards[j].suit}`;
            cardsElement.appendChild(li);
        }
        hand.appendChild(cardsElement);
        var score = document.createElement('span');
        score.innerHTML = `Score: ${playerHand.GetScore()}`;
        hand.appendChild(score);
        hand.appendChild(document.createElement('br'));


        var moneyBet = document.createElement('span');
        moneyBet.innerHTML = `$${playerHand.moneyBet}`;
        hand.appendChild(moneyBet);

        var status = document.createElement('span');
        status.innerHTML = playerHand.status;
        hand.appendChild(document.createElement('br'));
        hand.appendChild(status);
    };
    this.UpdateDealer = function(dealerHand) {
        this.dealerHand.innerHTML = null;
        if (dealerHand !== null) {
            var cardsElement = document.createElement('ul');
            for (var j = 0; j < dealerHand.cards.length; j++) {
                var li = document.createElement('li');
                li.innerHTML = `${dealerHand.cards[j].name} of ${dealerHand.cards[j].suit}`;
                cardsElement.appendChild(li);
            }
            this.dealerHand.appendChild(cardsElement);
            var score = document.createElement('span');
            score.innerHTML = `Score: ${dealerHand.GetScore()}`;
            this.dealerHand.appendChild(score);
        }
    };

    this.cash = document.getElementById('player_cash');
    this.UpdateCash = function(cash) {
        this.cash.innerHTML = `Cash: $${cash}`;
    };
};



/**
 * ========================================================================================================================================
 * Game instances go here
 */

var player = new Player('dmitriydementor', 10000);
var dealer = new Player('dealer', 0);
delete dealer.cash;
delete dealer.currentHandIndex;
delete dealer.playerHands;
dealer.dealerHand = null;
var blackjack = new Blackjack(2);
var controls = new Controls();
controls.StartNewGame();
var gameuielements = new GameUIElements();
