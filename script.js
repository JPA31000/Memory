document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENT SELECTORS ---
    const grid = document.getElementById('memory-grid');
    const pairsFoundDisplay = document.getElementById('pairs-found');
    const attemptsDisplay = document.getElementById('attempts');
    const restartBtn = document.getElementById('restart-btn');

    // --- CARD DATA ---
    // Customize your card content here.
    // For images: { type: 'image', value: 'path/to/image1.png', alt: 'Description' }
    // For text:   { type: 'text', value: 'Casque (EPI)' }
    const items = [
        { type: 'text', value: 'Casque (EPI)' },
        { type: 'text', value: 'Gants' },
        { type: 'text', value: 'Bottes Séc.' },
        { type: 'text', value: 'Harnais' },
        { type: 'text', value: 'Lunettes Prot.' },
        { type: 'text', value: 'Masque Resp.' }
    ];
    const cardContentFront = "BTP"; // Text for the front of the cards

    // --- GAME STATE VARIABLES ---
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let attempts = 0;
    let canFlip = true;
    const totalPairs = items.length;

    // --- FUNCTIONS ---

    // Shuffle an array (Fisher-Yates algorithm)
    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    // Create and display the game board
    function createBoard() {
        grid.innerHTML = ''; // Clear previous board
        matchedPairs = 0;
        attempts = 0;
        flippedCards = [];
        canFlip = true;
        updateScore();

        const gameItems = [...items, ...items]; // Duplicate items for pairs
        cards = shuffle(gameItems);

        cards.forEach((itemData, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = index; // Unique ID for each card element
            card.dataset.value = itemData.value; // The actual value for matching

            const cardFront = document.createElement('div');
            cardFront.classList.add('card-face', 'card-front');
            cardFront.textContent = cardContentFront;

            const cardBack = document.createElement('div');
            cardBack.classList.add('card-face', 'card-back');

            if (itemData.type === 'image') {
                const img = document.createElement('img');
                img.src = itemData.value;
                img.alt = itemData.alt || 'Image carte';
                // Handle image loading errors
                img.onerror = function() {
                    this.style.display = 'none';
                    const errorText = document.createElement('span');
                    errorText.classList.add('placeholder-text');
                    errorText.textContent = `Image ${itemData.alt || itemData.value.split('/').pop()} non trouvée`;
                    cardBack.appendChild(errorText);
                };
                cardBack.appendChild(img);
            } else { // 'text' type
                const textSpan = document.createElement('span');
                textSpan.classList.add('placeholder-text');
                textSpan.textContent = itemData.value;
                cardBack.appendChild(textSpan);
            }

            card.appendChild(cardFront);
            card.appendChild(cardBack);

            card.addEventListener('click', () => flipCard(card));
            grid.appendChild(card);
        });
    }

    // Handle card click event
    function flipCard(card) {
        if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            canFlip = false; // Prevent more flips until these are processed
            incrementAttempts();
            checkForMatch();
        }
    }

    // Check if the two flipped cards are a match
    function checkForMatch() {
        const [card1, card2] = flippedCards;

        if (card1.dataset.value === card2.dataset.value) {
            // It's a match
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateScore();
            flippedCards = [];
            canFlip = true; // Allow flipping again
            if (matchedPairs === totalPairs) {
                setTimeout(() => alert('Félicitations ! Vous avez trouvé toutes les paires !'), 500);
            }
        } else {
            // Not a match
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                flippedCards = [];
                canFlip = true; // Allow flipping again
            }, 1000); // Time to see the second card before it flips back
        }
    }

    // Increment attempts and update the display
    function incrementAttempts() {
        attempts++;
        updateScore();
    }

    // Update the score display
    function updateScore() {
        pairsFoundDisplay.textContent = matchedPairs;
        attemptsDisplay.textContent = attempts;
    }
    
    // --- EVENT LISTENERS ---
    restartBtn.addEventListener('click', createBoard);

    // --- INITIALIZE GAME ---
    createBoard();
});