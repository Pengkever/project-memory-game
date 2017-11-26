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

//声明一个已打开卡片列表
var cardOpenning = [];

//申明一个匹配计步器，每次匹配算一次
var count = 0;
// 动态刷新步数显示
/* 疑问？究竟是通过点击来刷星显示还是用计时器刷新显示，从优化和同步的角度考虑
 * 由于步数计算是根据两张卡片匹配一次计算的，跟随匹配动作更合适
 * 但是1、重置过程中也需要更新步数显示，需要重复获取更新显示步数。
 *     2、第一次游戏开始时，未进行卡片匹配时，若不获取更新显示步数，则moves前没有任何显示（可以在html中设置值为0）
 * 如果采用每10ms刷新一次，如果存在点击超快的动作，则会产生迟滞的条约额感。
 */
/*setInterval(function() {
    return $('.moves').text(count);
}, 10);*/

// 获取ul中i标签的数组长度，不需要每次点击生成，故而成为全局变量。
var matchLength = $('.deck').children('li').length;


// 给所有卡片设置一个监听事件
$('.card').click(function() {
    //如果card的class没有match才添加点击事件；
    if (this.className === 'card') {
        // console.log(this.className);
        return cardMatch(this);        
    }
});
//卡片匹配函数
function cardMatch(card){
    // 给未匹配的卡片添加打开标识
    if(card.className !== "card match"){
        $(card).addClass('open show');
        // 查看卡片列表是否为空
        if (cardOpenning.length === 0){
            // 为空，就将卡片下的子元素“i”的class的值放入卡片添加进已打开列表
            cardOpenning.push(card);
        } else {
            // 非空，则进行比较
            matching(card);
        }
    }
    function matching(card) {
        // 防止重复点击同一卡片，进行匹配
        if (card !== cardOpenning[0]){
            if (isMatch(card)) {
                // true即为相同，则删除 open show 标识，添加 match turnin标识，turnin绑定匹配成功的动画，
                $('.card.open.show').removeClass('open show').addClass('match turnin');
                //延迟0.5秒后删除turnin标识
                setTimeout(function() {
                    $('.card.match.turnin').removeClass('turnin');
                    //判断是否结束
                    if (isOver()){
                        //执行gameover，分为几步，弹出消息message，用时，步数，和星数，最后。弹出幕布（display改变为flex）
                        // var message = {count:count, starnum:starnum, timer: timer}
                        // 幕布要有重新开始按钮。
                        gameOver();  
                    }
                }, 500);
            } else {
                // false即为不同，则添加 turnout，turnout绑定匹配失败的动画效果，
                $('.card.open.show').addClass('turnout');
                // 延迟0.5秒后删除 open show turnout。
                setTimeout(function() {
                    $('.card.open.show.turnout').removeClass('open show turnout');
                }, 500);
            }
            // 匹配完毕，清空卡片列表
            cardOpenning.splice(0, cardOpenning.length);
            // 每次匹配后，计步器+1
            count++;
            // 更新步数显示
            $('.moves').text(count);
            // 根据步数来计算点亮几颗星
            stars(score(matchLength));
            // 添加结束函数
            function isOver() {
                return (matchLength === $('.card.match').length);
            }
            // 星星的点亮壳数，通过数组的slice()函数的起始位置，将星星倒序变暗色。
            function stars(starsnum) {              
                $('i.fa.fa-star').slice(starsnum, 3).css('color', 'black');
            }
        }
        
        // 声明函数，判断是否匹配
        function isMatch(card) {
            // 比较卡片的子元素“i”的class的值,相同返回true;否则，返回false。
            return ($(cardOpenning[0]).children('i').attr('class') === $(card).children('i').attr('class'));
        }


        // 添加得分函数，将传入参数为卡片列表的长度，通过步数和卡片列表长度计算得分。
        function score(num){
            if (count > (num * 1.5)) {
                return 1;
            } else if ( count > num) {
                return 2;
            } else {
                return 3;
            }

        }
        // 游戏结束执行函数
        function gameOver(){
            // 游戏结束停止计时
            stopTime();            
            $('div.over').css('display', 'flex');
            $('p.score').text(`cost ${minutes} minutes and ${seconds} seconds, With ${count} moves and ${score(matchLength)} stars.`);
            // 停止计时器
        }
    }
}


// 定义计时器id,分钟和秒数
var startTimeId;
var seconds = 0;
var minutes = 0;
// 定义计时函数
function timeCost(){
    // 每秒执行一次
    startTimeId = setInterval(function() {
        $('.time_box').text(timeFlying());
    }, 1000);

    // 计时器计算
    function timeFlying() {
        seconds++;
        // 秒数大于60，分钟增长1
        if (seconds > 59) {
            seconds = 0;
            minutes += 1;
        }        
        // 格式化显示，如果seconds 和 minutes 小于10，则在前面加 0
        function formatStr(num) {
            return ( parseInt(num) < 10? '0' + parseInt(num): num );
        }
        
        return `${formatStr(minutes)} : ${formatStr(seconds)}`;
    }
}

// 计时停止函数
function stopTime() {
    self.clearInterval(startTimeId);
}

// 绑定重新开始游戏事件
$('.restart').click(function() {
    // 步数归零
    count = 0;
    // 更新步数显示
    $('.moves').text(count);
    // 星星全部点亮
    $('i.fa.fa-star').css('color', 'yellow');
    // 获取卡片列表并打乱
    var changeCards = shuffle($('li.card'));
    // 除去匹配标识
    $('li.card').attr('class', 'card');
    // 清空场上卡片（ul.deck的子元素），并将打乱后的卡片列表添加给它
    $('ul.deck').empty().append(changeCards);
    // 给新的卡片列表绑定点击事件
    $('.card').click(function() {
    //如果card的class没有match才添加点击事件；
        if (this.className === 'card') {
            return cardMatch(this);        
        }
    });
    // 分钟和秒数，归零
    seconds = 0;
    minutes = 0;
    // gameOver的幕布div隐去
    $('div.over').css('display', 'none');
    // 开始计时
    timeCost();
});
// 加载完成，执行计时
timeCost();


