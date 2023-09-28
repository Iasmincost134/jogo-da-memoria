
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const gridSize = 4; // Tamanho da grade (4x4)
const cardSize = 150; // Tamanho das cartas
const padding = 10; // Espaçamento entre as cartas

//imagens das cartas
const imageURLs = [
    '3.png',
    '8.png',
    '10.png',
    '16.png',
    '18.png',
    '28.png',
    '29.png',
    '30.png',
];

// Array para armazenar informações sobre as cartas
let cards = [];
// Array para armazenar cartas viradas
let flippedCards = [];
// Contador de movimentos
let moves = 0;
// Indica se o jogo começou
let gameStarted = false;
// Contador de cartas combinadas
let totalMatches = 0;
// Tempo de início do jogo
let startTime = 0;
// Variável para armazenar o intervalo do temporizador
let timerInterval;
//botão começar
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

// Função para desenhar uma carta no contexto 2D do canvas
function drawCard(x, y, image, flipped) {
    // Salva o estado atual do contexto de desenho
    context.save();
    //isto vai verificar se a carta esta virada
    if (flipped) {
   // Desenha a imagem da carta nas coordenadas especificadas
        context.drawImage(image, x, y, cardSize, cardSize);
    } else {
        context.fillStyle = '#f4f0bd';
        context.fillRect(x, y, cardSize, cardSize);
    }
        // Restaura o estado anterior do contexto de desenho
    context.restore();
}

// Função para criar o tabuleiro do jogo e distribuir as cartas
function createBoard() {
    cards = [];
     // Embaralha as URLs das imagens e duplica para criar pares de cartas
    const shuffledImages = shuffleArray(imageURLs.concat(imageURLs)); // Duplicar as imagens para criar os pares
   // Loop para criar as cartas e distribuí-las no tabuleiro
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const card = {
                x: j * (cardSize + padding),
                y: i * (cardSize + padding),
                image: new Image(),
                flipped: false,
                matched: false,// Inicialmente, a carta não está combinada com outra
            };
            card.image.src = shuffledImages.pop();
            cards.push(card);
        }
    }
}
// Função para embaralhar um array
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}
// Função para atualizar o estado do jogo desenhando as cartas
function updateGame() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    cards.forEach((card) => {
        drawCard(card.x, card.y, card.image, card.flipped);
    });
}
// Função para verificar se duas cartas viradas correspondem
function checkMatch() {
     // Se as imagens são iguais, marca as cartas como matched (corresponde)
    if (flippedCards[0].image.src === flippedCards[1].image.src) {
        flippedCards[0].matched = true;
        flippedCards[1].matched = true;
        // adiciona o contador de cartas combinadas
        totalMatches += 2;
          // Se todas as cartas foram combinadas, encerra o jogo
        if (totalMatches === gridSize * gridSize) {
            endGame();
        }
    } else {
        // Se as cartas não combinarem, volte-as a posição inicial
        flippedCards[0].flipped = false;
        flippedCards[1].flipped = false;
    }
    // Limpa o array de cartas viradas para a próxima jogada
    flippedCards = [];
        // Incrementa o contador de movimentos
    moves++;
    updateMoves();
     // Atualiza o estado do jogo no canvas
    updateGame();
}
 //função para os movimentos
function updateMoves() {
    const movesElement = document.querySelector('.moves');
    movesElement.textContent = `${moves} movimentos`;
}
// Função para iniciar o jogo
function startGame() {
    if (!gameStarted) {
        gameStarted = true;
        shuffledImages = [];
        flippedCards = [];
        moves = 0;
        totalMatches = 0;
        startTime = Date.now();
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        updateMoves();
        createBoard();
        updateGame();
        const winElement = document.querySelector('.win');
        winElement.style.display = 'none';
    }
}
// Função para encerrar o jogo quando todas as cartas são combinadas
function endGame() {
    gameStarted = false;
    clearInterval(timerInterval);
    const winElement = document.querySelector('.win');
    winElement.textContent = `Você conseguiu em ${moves} movimentos e ${Math.floor((Date.now() - startTime) / 1000)} segundos!`;
    winElement.style.display = 'block';
}
// Função para atualizar o temporizador do jogo
function updateTimer() {
    const timerElement = document.querySelector('.timer');
    const seconds = Math.floor((Date.now() - startTime) / 1000);
    timerElement.textContent = `Tempo: ${seconds} segundos`;
}
//evento de clique no canvas
canvas.addEventListener('click', (event) => {
 // Verifica se o jogo já começou e se há menos de 2 cartas viradas
    if (gameStarted && flippedCards.length < 2) {
        const rect = canvas.getBoundingClientRect();
        //coordenadas relativas
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
     // Encontra a carta clicada com base nas coordenadas do clique
        const clickedCard = cards.find(
            (card) =>
                !card.matched &&
                !flippedCards.includes(card) &&
                x >= card.x &&
                x < card.x + cardSize &&
                y >= card.y &&
                y < card.y + cardSize
        );
 // Se uma carta "correta" foi clicada
        if (clickedCard) {
            clickedCard.flipped = true;
             // Adiciona a carta ao array de cartas viradas
            flippedCards.push(clickedCard);
            updateGame();
            // Se duas cartas estão viradas, verifica se há uma correspondência após um atraso de 1 segundo
            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 1000);
            }
        }
    }
});

// Inicializa o jogo
createBoard();
updateGame();
