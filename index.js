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
let cards_player_array = []
let croupier_cards_array = []
let sum_croupier = 0
let dealerRevealed = false
let messageEl = document.getElementById("message-el")
let player_sum_cards = document.getElementById("sum_player-el")
let player_cards = document.getElementById("cards-el")
let croupier_sum_cards = document.getElementById("croupier-crd-sum")
let croupier_cards = document.getElementById("croupier-card-el")


let playerEl = document.getElementById("player-el")


playerEl.textContent = player.name + ": $"

function getRandomCard() {
    let randomNumber = Math.floor( Math.random()*13 ) + 1
    if (randomNumber > 10) {
        return 10
    } else if (randomNumber === 1) {
        return 11
    } else {
        return randomNumber
    }
}

function startGame() {
    croupier_sum_cards.style.display = "none"
    canDraw = true
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
    sum_player = firstCard + secondCard
    sum_croupier = firstCard_croupier + secondCard_croupier
    renderGame()
}

function renderGame() {
    if (isAlive && !hasBlackJack) {
        btn_stand.style.display = "inline-block"
        btn_hit.style.display = "inline-block"
    } else {
        btn_stand.style.display = "none"
        btn_hit.style.display = "none"
    }
    if (game_tour >= 1){
        player_cards.textContent = "Player cards: "
        for (let i = 0; i < cards_player_array.length; i++) {
            player_cards.textContent += cards_player_array[i] + " "
        }   
        if (!dealerRevealed) {
            croupier_cards.textContent = "Croupier cards: " + croupier_cards_array[0]
            hidden_cart.textContent = "HC"
        } else {
            croupier_cards.textContent = "Croupier cards: " + croupier_cards_array.join(" ")
            hidden_cart.textContent = ""
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
        sum_player += card
        cards_player_array.push(card)
        renderGame()        
    }
}

function stand(){
    if (isAlive === true && hasBlackJack === false){
        dealerRevealed = true
        while (sum_croupier <= 17){
            let card = getRandomCard()
            sum_croupier += card
            croupier_cards.textContent += card
            croupier_cards_array.push(card)
        }
        croupier_sum_cards.style.display = "block"
        croupier_sum_cards.textContent = "Croupier sum: " + sum_croupier
        renderGame()
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
