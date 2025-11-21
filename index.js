let player = {
    name: "Jedrzej",
    chips: 200
}

let gameState = {
    canDraw: false,
    dealerRevealed: false,
    hasBlackJack: false,
    isAlive: true,
    canSplit: false,
    player: {
        cards: [],
        sum: 0
    },
    dealer: {
        cards: [],
        sum: 0
    }
}
let game_tour = 0
let message = ""

let btn_stand = document.getElementById("btn-stand")
let btn_hit = document.getElementById("btn-hit")
let btn_split = document.getElementById("btn-split")
let hidden_cart = document.getElementById("not-revealed-card")
let colors = ["clubs_", "diamonds_","hearts_","spades_"]
let messageEl = document.getElementById("message-el")
let player_sum_cards = document.getElementById("sum_player-el")
let player_cards = document.getElementById("cards-el")
let croupier_sum_cards = document.getElementById("croupier-crd-sum")
let croupier_cards = document.getElementById("croupier-card-el")
let playerCardsDisplayHTML = document.querySelector(".playerCardsDisplayHTML")
let croupierCardsDisplayHTML = document.querySelector(".croupier-cards")
let playerEl = document.getElementById("player-el")
btn_stand.style.display = "none"
btn_hit.style.display = "none"
btn_split.style.display = "none"




playerEl.textContent = player.name + ": $"

function clearCardsDisplay() {
        playerCardsDisplayHTML.innerHTML = ""
        croupierCardsDisplayHTML.innerHTML = ""
    }

function drawCardPlayer(card){
    let cardImg = document.createElement("img")
    cardImg.style.width = "150px"
    cardImg.style.height = "200px"
    cardImg.src = `/cards/${card.color+card.imgValue}.png`
    playerCardsDisplayHTML.appendChild(cardImg)
}
function drawCardCroupier(card){
    let cardImg = document.createElement("img")
    cardImg.style.width = "150px"
    cardImg.style.height = "200px"
    cardImg.src = `/cards/${card.color+card.imgValue}.png`
    croupierCardsDisplayHTML.appendChild(cardImg)
}

function getRandomCard() {
    let randomColor = colors[Math.floor(Math.random() * colors.length)]
    let randomNumber = Math.floor(Math.random() * 13) + 2
    let realValue = randomNumber
    let isAce = false
    if (randomNumber >= 10) {
        if (randomNumber === 14) {
            realValue = 11
            isAce = true
        } else {
            realValue = 10
        }
    }
    let randomNumberString = randomNumber.toString()
    return {
        color: randomColor,
        imgValue: randomNumberString,
        realValue,
        isAce
    }
}

function calculateHandSum(cards) {
    let lowSum = 0
    let aceCount = 0
    for (let i = 0; i < cards.length; i++) {
        if (cards[i].isAce) {
            lowSum += 1
            aceCount += 1
        } else {
            lowSum += cards[i].realValue
        }
    }
    let highSum = lowSum
    if (aceCount > 0 && highSum + 10 <= 21) {
        highSum += 10
    }
    return {
        low: lowSum,
        high: highSum
    }
}

function addCardToHand(hand, card) {
    hand.cards.push(card)
    const sums = calculateHandSum(hand.cards)
    hand.sum = sums.high <= 21 ? sums.high : sums.low
    hand.altSum = sums.high !== sums.low ? Math.min(sums.low, sums.high) : null
}

function startGame() {
    console.log("start")
    clearCardsDisplay()
    croupier_sum_cards.style.display = "none"
    gameState.canDraw = true
    gameState.hasBlackJack = false
    gameState.isAlive = true
    gameState.dealerRevealed = false
    game_tour = 1
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()
    gameState.player.cards = [firstCard, secondCard]
    const playerSums = calculateHandSum(gameState.player.cards)
    gameState.player.sum = playerSums.high <= 21 ? playerSums.high : playerSums.low
    gameState.player.altSum = playerSums.high !== playerSums.low ? Math.min(playerSums.low, playerSums.high) : null
    let firstCard_croupier = getRandomCard()
    let secondCard_croupier = getRandomCard()
    gameState.dealer.cards = [firstCard_croupier,secondCard_croupier]
    const dealerSums = calculateHandSum(gameState.dealer.cards)
    gameState.dealer.sum = dealerSums.high <= 21 ? dealerSums.high : dealerSums.low
    gameState.dealer.altSum = dealerSums.high !== dealerSums.low ? Math.min(dealerSums.low, dealerSums.high) : null
    renderGame()
}

function renderPlayerHand(){
    for (let i = 0; i < gameState.player.cards.length; i++) {
        drawCardPlayer(gameState.player.cards[i])
    }  
}

function renderDealerHand(){
    if (gameState.dealerRevealed) {
        for (let i = 0; i < gameState.dealer.cards.length; i++) {
            drawCardCroupier(gameState.dealer.cards[i])
        }
    } 
    else {
        drawCardCroupier(gameState.dealer.cards[0])
        drawCardCroupier({ color: "back_", imgValue: "light" })
    }
}

function updateControlsAndMessages(){
    if (gameState.canDraw){
        if (gameState.player.sum <= 20) {
        message = "Do you want to draw a new card?"
    } else if (gameState.player.sum === 21 && gameState.player.cards.length === 2) {
        message = "You've got Blackjack!"
        gameState.hasBlackJack = true
    } else {
        message = "You're out of the game!"
        gameState.isAlive = false
    }
    }
}

function renderGame() {
    clearCardsDisplay()
    canSplit()
    if (gameState.isAlive && !gameState.hasBlackJack) {
        btn_stand.style.display = "inline-block"
        btn_hit.style.display = "inline-block"
    } else {
        btn_stand.style.display = "none"
        btn_hit.style.display = "none"
    }

    if (game_tour >= 1){
        renderPlayerHand()
        renderDealerHand() 
    }
    

    if (gameState.player.altSum !== null && gameState.player.altSum !== undefined && gameState.player.altSum !== gameState.player.sum) {
        player_sum_cards.textContent = "Sum: " + gameState.player.altSum + "/" + gameState.player.sum
    } else {
        player_sum_cards.textContent = "Sum: " + gameState.player.sum
    }
    
    updateControlsAndMessages()
    
    messageEl.textContent = message
}

function canSplit(){
    const deck = gameState.player.cards
    if (deck[0].realValue === deck[1].realValue){
        btn_split.style.display = "inline-block"
        gameState.canSplit = true
    }
}

function isAceinDeck(hand){
    const deck = hand.cards
    for(let i = 0; i<deck.length; i++){
        if(deck[i].isAce){
            return true
        }
    }
    return false
}



function newCard() {
    if (gameState.isAlive === true && gameState.hasBlackJack === false) {
        let card = getRandomCard()
        addCardToHand(gameState.player, card)
        renderGame()
    }
}

function stand(){
    if (!(gameState.isAlive === true && gameState.hasBlackJack === false)) {
        return
    }
    playDealerTurn()
    matchScores(gameState.player, gameState.dealer)
    gameState.canDraw = false
    renderGame()
}

function playDealerTurn(){
    if (gameState.isAlive === true && gameState.hasBlackJack === false){
        gameState.dealerRevealed = true
        while (gameState.dealer.sum < 17){
            let card = getRandomCard()
            addCardToHand(gameState.dealer, card)
            console.log(card)
            game_tour += 1
        }
        croupier_sum_cards.style.display = "block"
        croupier_sum_cards.textContent = "Croupier sum: " + gameState.dealer.sum
    }
    return gameState.dealer.sum
}

function matchScores(playerHand, dealerHand){
    const playerSum = playerHand.sum
    const dealerSum = dealerHand.sum
    if (playerSum > 21) {
        message = "You're out of the game!"
        gameState.isAlive = false
        return
    }
    if(dealerSum>21 && playerSum<=21){
        gameState.isAlive = false
        message = "You won!"
    }
    else if(dealerSum<=21 && playerSum<=21){
        if (dealerSum === playerSum){
            message = "Push is better than a shove"
            gameState.isAlive = false
        }
        else if (dealerSum > playerSum){
            message = "Croupier won!"
            gameState.isAlive = false
        }
        else if(dealerSum === 21 && dealerHand.cards.length === 2){
            message = "Croupier got a blackjack!"
            gameState.isAlive = false
        }
        else{
            message = "You won!"
            gameState.isAlive = false
        }
    }
}

btn_hit.addEventListener("click", newCard)
btn_stand.addEventListener("click", stand)
