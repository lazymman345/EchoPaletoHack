const grid = document.getElementById('grid');
const startButton = document.getElementById('startButton');
let circles = [];
let code = [];
let incorrectAttempts = 0;
let currentIndex = 0; // This will represent the current selected circle
let currentRow = 0; // Track the row for navigation
let lastHighlightedCircles = []; // Store the last highlighted circles
let gameStarted = false; // Track if the game has started
let firstRowActive = false; // Track if the first row is active
let columnActivated = 0; // Track the currently active column

// Create circles
for (let i = 0; i < 30; i++) {
    const circle = document.createElement('div');
    circle.classList.add('circle', 'inactive');
    grid.appendChild(circle);
    circles.push(circle);
}

startButton.addEventListener('click', startGame);

function startGame() {
    if (gameStarted) return; // Prevent starting the game again if already started
    gameStarted = true; // Set the flag to true
    console.log("Game started!");
    // Reset state
    resetCircles();
    code = [];
    currentIndex = 0; // Start at the first circle index
    currentRow = 0; // Start at the first row
    columnActivated = 0; // Reset the activated column

    // Lighting up circles
    for (let i = 0; i < 5; i++) {
        setTimeout(() => lightUpCircles(i), i * 2000); // Light up circles every 2 seconds
    }
}

function lightUpCircles(round) {
    console.log(`Lighting up circles for round ${round}`);
    let selected = new Set();

    // Select one circle from each column
    while (selected.size < 6) {
        const randomIndex = Math.floor(Math.random() * 30); // Generate a random index from 0 to 29
        console.log(`Random Index Selected: ${randomIndex}`); // Log the random index
        const circle = circles[randomIndex];

        // Ensure unique circle selection
        const column = randomIndex % 6; // Get column index (0-5)
        if (!selected.has(column) && !circle.classList.contains('highlight')) {
            selected.add(column); // Store the column index to ensure only one per column
            circle.style.backgroundColor = 'cyan'; // Directly set the color for visibility test
            circle.style.border = '2px solid white'; // Change the border for visibility test
            console.log(`Circle at index ${randomIndex} lit up!`); // Log when circle lights up

            // Save the code on the fifth iteration
            if (round === 4) {
                code.push(randomIndex);
                lastHighlightedCircles.push(circle); // Store the last highlighted circles
            }
        }
    }

    // Turn off the lights after a delay
    setTimeout(() => {
        selected.forEach(columnIndex => {
            circles.forEach(circle => {
                const index = circles.indexOf(circle);
                if (index % 6 === columnIndex) {
                    circle.style.backgroundColor = 'black'; // Reset to original color
                    circle.style.border = '2px solid red'; // Reset border
                }
            });
        });

        // Handle blinking on the last round
        if (round === 4) {
            setTimeout(() => {
                blinkCircles(); // Blink only the last highlighted circles
                activateFirstColumn(); // Activate the first column after blinking
            }, 1000); // Wait before blinking
        }
    }, 1500); // Keep circles lit for 1.5 seconds before turning them off
}

function activateFirstColumn() {
    console.log("Activating first column...");
    circles.forEach((circle, index) => {
        if (index % 6 === 0) { // Only activate circles in the first column
            circle.style.border = '2px solid white'; // Change outline to white
            console.log(`Circle at index ${index} activated.`); // Log activation of circle
        } else {
            circle.style.border = '2px solid red'; // Reset border for other circles
        }
    });
    currentRow = 0; // Reset cursor position to the top left circle
    currentIndex = 0; // Start from the first circle
    updateCircleStyles(); // Update styles to show the selected circle
    firstRowActive = true; // Set the first row as active
}

function blinkCircles() {
    console.log("Blinking circles!");
    // Blink only the last highlighted circles
    lastHighlightedCircles.forEach(circle => {
        circle.style.backgroundColor = 'cyan'; // Turn them back on
    });

    // Clear highlights after blinking
    setTimeout(() => {
        lastHighlightedCircles.forEach(circle => {
            circle.style.backgroundColor = 'black'; // Reset to original color
            circle.style.border = '2px solid red'; // Reset border
        });
    }, 1000); // Keep them lit for 1 second
}

function resetCircles() {
    circles.forEach(circle => {
        circle.classList.remove('highlight', 'selected-correct', 'selected-incorrect', 'active', 'selected');
        circle.style.backgroundColor = 'black'; // Reset color to black
        circle.style.border = '2px solid red'; // Reset border to red
    });
    lastHighlightedCircles = []; // Clear last highlighted circles on reset
    firstRowActive = false; // Reset the first row active state
    columnActivated = 0; // Reset the activated column
}

function updateCircleStyles() {
    circles.forEach((circle, index) => {
        circle.classList.remove('active');
        // Check if the current index corresponds to the selected circle
        if (index === (currentRow * 6 + currentIndex) && firstRowActive) {
            circle.classList.add('selected'); // Add selected class to the currently selected circle
            circle.style.border = '4px solid white'; // Larger white outline for the selected circle
            console.log(`Circle ${index} is currently selected.`); // Log the currently selected circle
        } else {
            // Keep previously activated columns with white outline
            if (index % 6 <= columnActivated) {
                circle.style.border = '2px solid white'; // White outline for activated columns
            } else {
                circle.style.border = '2px solid red'; // Reset border for other circles
            }
        }
    });
}

// Handle W & S navigation and Enter key
document.addEventListener('keydown', (e) => {
    // Navigate through the grid only if the first row is active
    if (firstRowActive) {
        if (e.key === 'w' && currentRow > 0) {
            currentRow--; // Move up
            updateCircleStyles();
        }
        if (e.key === 's' && currentRow < 4) {
            currentRow++; // Move down
            updateCircleStyles();
        }
    }

    // Check if Enter is pressed to select a circle
    if (e.key === 'Enter' && firstRowActive) {
        const selectedCircleIndex = (currentRow * 6) + currentIndex; // Calculate index
        const selectedCircle = circles[selectedCircleIndex];

        // Log selected circle index
        console.log(`Selected Circle Index: ${selectedCircleIndex}`);

        // Check if the selected circle is part of the code
        if (code.includes(selectedCircleIndex)) {
            selectedCircle.style.backgroundColor = 'cyan'; // Turn it cyan for a correct selection
            console.log(`Circle ${selectedCircleIndex} is part of the code!`);

            // Activate the next column
            columnActivated++;
            if (columnActivated < 6) {
                circles.forEach((circle, index) => {
                    if (index % 6 === columnActivated) {
                        circle.style.border = '2px solid white'; // Change outline to white for the next column
                        console.log(`Activating next column: Circle ${index} activated.`);
                    }
                });
            }

            // Move cursor to the next column (reset currentRow to 0 and increment currentIndex)
            currentRow = 0; // Reset row to the top
            currentIndex++; // Move to the next index in the new column

            // Check if we exceed the column size
            if (currentIndex > 5) {
                currentIndex = 0; // Reset to first circle in next column
            }

            updateCircleStyles(); // Update styles after selection
        } else {
            selectedCircle.style.backgroundColor = 'red'; // Fill with red for an incorrect selection
            console.log(`Circle ${selectedCircleIndex} is NOT part of the code!`);
            incorrectAttempts++; // Increment incorrect attempts
            console.log(`Incorrect Attempts: ${incorrectAttempts}`);

            // Check if the game should end
            if (incorrectAttempts >= 3) {
                alert("Game Over! Click 'Start' to restart.");
                resetGame();
                gameStarted = false; // Prevent further game actions until restart
                return; // Exit after resetting the game
            }
        }
    }
});

function resetGame() {
    resetCircles();
    currentIndex = 0;
    incorrectAttempts = 0;
    code = [];
}
