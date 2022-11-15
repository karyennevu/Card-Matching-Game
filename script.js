class AudioController {
    constructor() {
        this.bgMusic = new Audio('Music/ACozyDay.mp3');
        this.bgMusic.volume = 0.3;
        this.bgMusic.loop = true;
        this.matchSound = new Audio('Music/Pop.mp3');
        this.flipSound = new Audio('Music/FlipCard.mp3');
        this.victorySound = new Audio('Music/WinFantasia.mp3');
        this.gameOverSound = new Audio('Music/NegativeBeeps.mp3');
    }
    startMusic() {
        this.bgMusic.play();
    }
    stopMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    victory() {
        this.stopMusic();
        this.victorySound.play();
    }
    gameOver() {
        this.stopMusic();
        this.gameOverSound.play();
    }
    muteMusic() {
        this.bgMusic.volume = 0;
        document.getElementById('mute-button').classList.add('visible');
        document.getElementById('music-button').classList.remove('visible');
    }
    unMuteMusic() {
        this.bgMusic.volume = 0.3;
        document.getElementById('music-button').classList.add('visible');
        document.getElementById('mute-button').classList.remove('visible');
    }
}

class RelaxAndMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }
    startGame() {
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.ticker.innerText = this.totalClicks
        this.timeRemaining = this.totalTime; //This is so that the totalTime resets everytime we start a new game
        this.timer.innerText = this.timeRemaining
        this.matchedCards = [];
        this.busy = true; //Animation is happening
        setTimeout(() => {
            this.audioController.startMusic();

            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 10); //Wait 500ms before performing the actions in the curly brackets
        this.hideCards();
    }
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched')
        });
    }
    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');
            if (this.cardToCheck) {
                this.checkForCardMatch(card);
            }
            else {
                this.cardToCheck = card;
            }
        }
    }
    checkForCardMatch(card) {
        let thisCardType = card.getElementsByClassName('card-value')[0].src;
        let thatCardType = this.cardToCheck.getElementsByClassName('card-value')[0].src;

        if (thisCardType === thatCardType)
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);
        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1, card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length)
            this.victory();
    }
    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }
    shuffleCards() { // Fisher-Yates Shuffle
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            this.cardsArray[j].style.order = i;
            this.cardsArray[i].style.order = j;
        }
    }
    canFlipCard(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
        //Card can be flipped if no animation happening and not matched yet and is not the card we already flipped to match
    }
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) this.gameOver();
        }, 1000);
    }
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('game-over-text').classList.add('visible');
    }
    victory() {
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victory-text').classList.add('visible');
    }
}

function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let musicButton = document.getElementById('music-button');
    let muteButton = document.getElementById('mute-button');
    //By doing only document.getElementsByClassName('___'), it returns an html collection. However, you won't be able to do use it as a JS array (aka can't use JS array functions)
    let game = new RelaxAndMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });

    musicButton.addEventListener('click', () => {
        game.audioController.muteMusic();
    });

    muteButton.addEventListener('click', () => {
        game.audioController.unMuteMusic();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}
//Once everything inside HTML file loaded, it will call whichever function we give in here
//If html not finished loading then when it is loaded, call ready. Else, call ready.


