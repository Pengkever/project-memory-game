/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 * 为卡片设置一个监听事件，如果卡片被点击
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *    展现卡片的标识（把这个功能放入另一个函数中，使你可以调用这个）
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *    添加这张卡片到一个打开的卡片列表（把这个功能放入另一个你可以调用的函数中）
 *  - if the list already has another card, check to see if the two cards match
 *    如果这个列表已经有一个卡片，检查两张卡片是否匹配。
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *      如果两张卡片匹配，锁定卡片为打开状态（把这个功能放入另一个你可以调用的函数中）
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *      如果两张卡片不匹配，把卡片从列表中移除并隐藏卡片标识
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *      把计数器显示在页面上。
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 *      如果所有卡片都匹配了，显示一个最终得分的信息。
 */

var count = 0;
var cardOpen = [];


function match() {
    var cardOpened = deck.getElementsByClassName("card open show");
    for (var i = cardOpened.length - 1; i >= 0; i--) {
        cardOpened[i].className = "card match turnin";
    }
    isOver();   
};

function unMatch() {
    var cardOpened = deck.getElementsByClassName("card open show");
    for (var i = cardOpened.length - 1; i >= 0; i--) {
        cardOpened[i].className = "card open show turnout";
    }
    setTimeout((function(){
        return unMatchAnimation();
    }), 1000);
}
function unMatchAnimation() {
    var cardTurnout = deck.getElementsByClassName("card open show turnout");
    for (var i = 0; i < cardTurnout.length; i++) {
        cardTurnout[i].className = "card";
    }
}
function matchAnimation() {
    var cardTurnin = deck.getElementsByClassName("card match turnin");
    for (var i = 0; i < cardTurnin.length; i++) {
        cardTurnin[i].className = "card match";
    }
}

function isMatch(card){
    if (card !== cardOpen[0]){
        if (cardOpen[0].getElementsByTagName("i")[0].className === card.getElementsByTagName("i")[0].className) {
        match();
        setTimeout((function(){
            return matchAnimation();
        }), 1000);
        //    setTimeout("match()", 500);
        //    cardOpen.pop();
        } else {
        unMatch();
        setTimeout((function(){
            return unMatchAnimation();
        }), 1000);
        //    setTimeout("unMatch()", 500);
        }        
        count += 1;    
        cardOpen.pop();
    }
}

function steps(){
    var moves = document.getElementsByClassName("moves")[0];
    moves.innerHTML = count;    
}

function cardMatch(){
    if (this.className !== "card match") {
        this.className = "card open show";
        if (cardOpen.length === 0){
            cardOpen.push(this);
        } else {
            isMatch(this);
        }
        steps();
        stars();        
    }
}


function isOver(){
    var gameOver = document.getElementsByClassName("over")[0];
    var matchCards = document.getElementsByClassName("card match");
    if (matchCards.length === cards.length) {
        gameOver.style.display = "flex";
        score();
    }
}

function restart() {
    for (var i = cards.length - 1; i >= 0; i--) {
        cards[i].className = "card";
    }
    count = 0;
    steps();
    refresh();
    var gameOver = document.getElementsByClassName("over")[0];
    gameOver.style.display = "none";
}

function refresh(){
    var cardsInfo = deck.getElementsByTagName("i");
    var newCardsInfo = [];
    for (var i = 0; i < cardsInfo.length; i++) {
        newCardsInfo.push(cardsInfo[i].className);
    }
    shuffle(newCardsInfo);
    for (var j = 0; j < cardsInfo.length; j++) {
        cardsInfo[j].className = newCardsInfo[j];
    }
}


var btn = document.getElementsByClassName("restart");
for (var i = btn.length - 1; i >= 0; i--) {
    btn[i].onclick = restart;
}

var deck = document.getElementsByClassName('deck')[0];
var cards = deck.getElementsByTagName("li");
for (var i = cards.length - 1; i >= 0; i--) {
    if(cards[i].className === "card"){
        cards[i].onclick = cardMatch;
    }
}
function stars(){    
    if ((count - 16) <= 4) {
        return 3;
    } else if ((count - 16) <= 16) {
        return 2;
    } else {
        return 1;
    }
}

function score(){
    var score = document.getElementsByClassName("score")[0];
    score.innerHTML = "With " + count + " Moves and " + stars() + " Stars!";    
}

