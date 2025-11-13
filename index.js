let player = {
    name: "Jedrzej",
    chips: 200
}
let canDraw = true
let sum_player = 0
let btn_stand = document.getElementById("btn-stand")
let btn_hit = document.getElementById("btn-hit")
btn_stand.style.display = "none"
btn_hit.style.display = "none"
let game_tour = 0
let hidden_cart = document.getElementById("not-revealed-card")
let hasBlackJack = false
let isAlive = false
let message = ""
let colors = ["clubs_", "diamonds_","hearts_","spades_"]
let cards_player_array = []
let croupier_cards_array = []
let sum_croupier = 0
let dealerRevealed = false
let messageEl = document.getElementById("message-el")
let player_sum_cards = document.getElementById("sum_player-el")
let player_cards = document.getElementById("cards-el")
let croupier_sum_cards = document.getElementById("croupier-crd-sum")
let croupier_cards = document.getElementById("croupier-card-el")
let playerCardsDisplayHTML = document.querySelector(".playerCardsDisplayHTML")
let croupierCardsDisplayHTML = document.querySelector(".croupier-cards")
let finalShove = false


let playerEl = document.getElementById("player-el")


playerEl.textContent = player.name + ": $"

function clearCardsDisplay() {
        playerCardsDisplayHTML.innerHTML = ""
        croupierCardsDisplayHTML.innerHTML = ""
    }

function drawCardPlayer(cardColor, cardValue){
    let cardImg = document.createElement("img")
    cardImg.style.width = "150px"
    cardImg.style.height = "200px"
    cardImg.src = `/cards/${cardColor+cardValue}.png`
    console.log(cardColor+cardValue)
    playerCardsDisplayHTML.appendChild(cardImg)
}
function drawCardCroupier(cardColor, cardValue){
    let cardImg = document.createElement("img")
    cardImg.style.width = "150px"
    cardImg.style.height = "200px"
    cardImg.src = `/cards/${cardColor+cardValue}.png`
    console.log(cardColor+cardValue)
    croupierCardsDisplayHTML.appendChild(cardImg)
}

function getRandomCard() {
    let randomColor = colors[Math.floor(Math.random() * colors.length)]
    let randomNumber = Math.floor(Math.random() * 13) + 2     
    if(randomNumber >=10){
        randomNumber = 10
    }          
    let randomNumberString = randomNumber.toString()
    return [randomColor, randomNumberString]
}

function startGame() {
    console.log("start")
    clearCardsDisplay()
    croupier_sum_cards.style.display = "none"
    canDraw = true
    finalShove = false
    hasBlackJack = false
    isAlive = true
    dealerRevealed = false
    game_tour = 1
    let firstCard = getRandomCard()
    let secondCard = getRandomCard()
    cards_player_array = [firstCard, secondCard]
    let firstCard_croupier = getRandomCard()
    let secondCard_croupier = getRandomCard()
    croupier_cards_array = [firstCard_croupier,secondCard_croupier]
    sum_player = parseInt(cards_player_array[0][1]) + parseInt(cards_player_array[1][1])
    sum_croupier = parseInt(croupier_cards_array[0][1]) + parseInt(croupier_cards_array[1][1])
    renderGame()
}


function renderGame() {
    
    clearCardsDisplay()
    if (isAlive && !hasBlackJack) {
        btn_stand.style.display = "inline-block"
        btn_hit.style.display = "inline-block"
    } else {
        btn_stand.style.display = "none"
        btn_hit.style.display = "none"
    }
    if (game_tour >= 1){
        for (let i = 0; i < cards_player_array.length; i++) {
            drawCardPlayer(cards_player_array[i][0], cards_player_array[i][1])
        }  
        if(finalShove === true){
            for (let i = 0; i < croupier_cards_array.length; i++) {
            drawCardCroupier(croupier_cards_array[i][0], croupier_cards_array[i][1])
        }  
        } 
        if (!dealerRevealed) {
            drawCardCroupier(croupier_cards_array[0][0], croupier_cards_array[0][1])
            drawCardCroupier("back_","light")
        } 
    }
    

    player_sum_cards.textContent = "Sum: " + sum_player
    if (canDraw){
        if (sum_player <= 20) {
        message = "Do you want to draw a new card?"
    } else if (sum_player === 21) {
        message = "You've got Blackjack!"
        hasBlackJack = true
    } else {
        message = "You're out of the game!"
        isAlive = false
    }
    }
    
    messageEl.textContent = message
}


function newCard() {
    if (isAlive === true && hasBlackJack === false) {
        let card = getRandomCard()
        cards_player_array.push(card)
        sum_player += parseInt(cards_player_array[cards_player_array.length-1][1])
        renderGame()
    }
}

function stand(){
    if (isAlive === true && hasBlackJack === false){
        dealerRevealed = true
        while (sum_croupier <= 17){
            let card = getRandomCard()
            croupier_cards_array.push(card)
            console.log(card)
            sum_croupier += parseInt(croupier_cards_array[croupier_cards_array.length-1][1])
            finalShove = true
        }
        croupier_sum_cards.style.display = "block"
        croupier_sum_cards.textContent = "Croupier sum: " + sum_croupier
        if(sum_croupier <= 21 && sum_player <= 21){
            if (sum_croupier === sum_player){
                message = "Push is better than a shove"
                isAlive = false
            }
            else if (sum_croupier > sum_player){
                message = "Croupier won!"
                isAlive = false
            }
            else if(sum_croupier === 21 && croupier_cards_array.length === 2){
                message = "Croupier got a blackjack!"
                isAlive = false
            }
            else if(sum_croupier > 21 && sum_player <=21){
                isAlive = false
                message = "You won!"
                console.log("KRUPIER PRZEKROCZYL")
            }
            else{
                message = "You won!"
                isAlive = false
            }
        }
    canDraw = false
    renderGame()
    }
}


btn_hit.addEventListener("click", newCard)
btn_stand.addEventListener("click", stand)
