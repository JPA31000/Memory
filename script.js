document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const grid = document.getElementById('memory-grid');
    const pairsFoundDisplay = document.getElementById('pairs-found');
    const attemptsDisplay = document.getElementById('attempts');
    const restartBtn = document.getElementById('restart-btn');
    const timerDisplay = document.querySelector('#timer span'); // Select the timer span

    // --- CARD DATA ---
    // Les cartes sont mises à jour avec les nouveaux mots et les chemins vers vos images.
    const items = [
        { text: 'Architecte', image: 'images/architecte.png' },
        { text: 'Géomètre', image: 'images/geometre.png' },
        { text: 'Économiste', image: 'images/economiste.png' },
        { text: 'Maçon', image: 'images/macon.png' },
        { text: 'Maître d\'ouvrage', image: 'images/maitre-d-ouvrage.png' },
        { text: 'Ouvrier', image: 'images/ouvrier.png' }
    ];
    const cardContentFront = "BTP"; // Texte pour le recto des cartes

    // --- GAME STATE VARIABLES ---
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let canFlip = true;
    const totalPairs = items.length;

    // --- TIMER VARIABLES ---
    let timeElapsed = 0; // Initialize to 0 for counting up
    let timerInterval;
    const gameDuration = 180; // 3 minutes * 60 seconds

    // --- FUNCTIONS ---

    // Mélange un tableau (algorithme Fisher-Yates)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Met à jour l'affichage du timer
    function updateTimerDisplay() {
        const minutes = Math.floor(timeElapsed / 60);
        const seconds = timeElapsed % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Démarre le timer
    function startTimer() {
        clearInterval(timerInterval); // Clear any existing timer
        timeElapsed = 0; // Reset time to 0 for counting up
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            timeElapsed++; // Increment time elapsed
            updateTimerDisplay();
            if (timeElapsed >= gameDuration) { // Check if time has reached 3 minutes
                clearInterval(timerInterval);
                canFlip = false; // Disable card flipping
                alert('Temps écoulé ! Game Over.');
            }
        }, 1000); // Update every second
    }

    // Arrête le timer
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // Crée et affiche le plateau de jeu
    function createBoard() {
        grid.innerHTML = ''; // Vide le plateau précédent
        matchedPairs = 0;
        attempts = 0;
        flippedCards = [];
        canFlip = true;
        updateScore();
        startTimer(); // Start the timer when a new board is created

        const gameItems = [...items, ...items]; // Duplique les objets pour les paires
        cards = shuffle(gameItems);

        cards.forEach((itemData, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = index;
            card.dataset.value = itemData.text; // La valeur de comparaison est le texte

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = cardContentFront;

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');

            // Applique l'image comme fond d'écran
            if (itemData.image) {
                cardBack.style.backgroundImage = `url('${itemData.image}')`;
            }

            // Ajoute toujours le texte par-dessus
            const textSpan = document.createElement('span');
            textSpan.classList.add('placeholder-text');
            textSpan.textContent = itemData.text;
            cardBack.appendChild(textSpan);

            card.appendChild(cardFront);
            card.appendChild(cardBack);

            card.addEventListener('click', () => flipCard(card));
            grid.appendChild(card);
        });
    }

    // Gère le clic sur une carte
    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            canFlip = false;
            incrementAttempts();
            checkForMatch();
        }
    }

    // Vérifie si les deux cartes retournées correspondent
    function checkForMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            // C'est une paire
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateScore();
            flippedCards = [];
            canFlip = true;
            if (matchedPairs === totalPairs) {
                stopTimer(); // Stop the timer if all pairs are found
                setTimeout(() => alert('Félicitations ! Vous avez trouvé toutes les paires !'), 500);
            }
        } else {
            // Ce n'est pas une paire
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true;
            }, 1000);
        }
    }

    // Incrémente les tentatives et met à jour l'affichage
    function incrementAttempts() {
        attempts++;
        updateScore();
    }

    // Met à jour l'affichage du score
    function updateScore() {
        pairsFoundDisplay.textContent = matchedPairs;
        attemptsDisplay.textContent = attempts;
    }
    
    // --- EVENT LISTENERS ---
    restartBtn.addEventListener('click', createBoard);

    // --- INITIALIZE GAME ---
    createBoard();
});