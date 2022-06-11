import { useState, useEffect } from "react";
import ScoreBoard from "./components/ScoreBoard";
import blue from "./images/blue-candy.png";
import green from "./images/green-candy.png";
import orange from "./images/orange-candy.png";
import purple from "./images/purple-candy.png";
import red from "./images/red-candy.png";
import yellow from "./images/yellow-candy.png";
import blank from "./images/blank.png";

const WIDTH = 8;
const CANDY_COLORS = [blue, yellow, green, orange, purple, red];

const App = () => {
    const [currentColorArrangement, setCurrentColorArrangement] = useState([]);
    const [squareBeingDragged, setSquareBeingDragged] = useState(null);
    const [squareBeingReplaced, setSquareBeingReplaced] = useState(null);
    const [scoreDisplay, setScoreDisplay] = useState(0);

    const checkForColumnOfThree = () => {
        for (let i = 0; i <= 47; i++) {
            const columnOfThree = [i, i + WIDTH, i + WIDTH * 2];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;
            // if each square matches the chosen "decided" color
            if (
                columnOfThree.every(
                    (square) =>
                        currentColorArrangement[square] === decidedColor &&
                        !isBlank
                )
            ) {
                setScoreDisplay((score) => score + 3);
                // if they all 3 match, set to empty string
                columnOfThree.forEach(
                    (square) => (currentColorArrangement[square] = blank)
                );
                return true;
            }
        }
    };

    const checkForColumnOfFour = () => {
        for (let i = 0; i <= 39; i++) {
            const columnOfFour = [i, i + WIDTH, i + WIDTH * 2, i + WIDTH * 3];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;

            // if each square matches the chosen "decided" color
            if (
                columnOfFour.every(
                    (square) =>
                        currentColorArrangement[square] === decidedColor &&
                        !isBlank
                )
            ) {
                setScoreDisplay((score) => score + 4);
                // if they all 3 match, set to empty string
                columnOfFour.forEach(
                    (square) => (currentColorArrangement[square] = blank)
                );
                return true;
            }
        }
    };

    const checkForRowOfThree = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfThree = [i, i + 1, i + 2];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;

            const notValid = [
                6, 7, 14, 15, 22, 30, 31, 38, 39, 46, 47, 54, 55, 63,
            ];
            if (!notValid.includes(i)) {
                // if each square matches the chosen "decided" color
                if (
                    rowOfThree.every(
                        (square) =>
                            currentColorArrangement[square] === decidedColor &&
                            !isBlank
                    )
                ) {
                    setScoreDisplay((score) => score + 3);
                    // if they all 3 match, set to empty string
                    rowOfThree.forEach(
                        (square) => (currentColorArrangement[square] = blank)
                    );

                    return true;
                }
            }
        }
    };

    const checkForRowOfFour = () => {
        for (let i = 0; i < 64; i++) {
            const rowOfFour = [i, i + 1, i + 2, i + 3];
            const decidedColor = currentColorArrangement[i];
            const isBlank = currentColorArrangement[i] === blank;

            const notValid = [
                5, 6, 7, 13, 14, 15, 21, 22, 27, 30, 31, 37, 38, 39, 45, 46, 47,
                53, 54, 55, 62, 63,
            ];
            if (!notValid.includes(i)) {
                // if each square matches the chosen "decided" color
                if (
                    rowOfFour.every(
                        (square) =>
                            currentColorArrangement[square] === decidedColor &&
                            !isBlank
                    )
                ) {
                    setScoreDisplay((score) => score + 4);
                    // if they all 3 match, set to empty string
                    rowOfFour.forEach(
                        (square) => (currentColorArrangement[square] = blank)
                    );

                    return true;
                }
            }
        }
    };

    const moveIntoSquareBelow = () => {
        for (let i = 0; i < 64 - WIDTH; i++) {
            const firstRow = [0, 1, 2, 3, 4, 5, 6, 7];
            const isFirstRow = firstRow.includes(i);
            if (isFirstRow && currentColorArrangement[i] === blank) {
                let randomNumber = Math.floor(
                    Math.random() * CANDY_COLORS.length
                );
                currentColorArrangement[i] = CANDY_COLORS[randomNumber];
            }
            if (currentColorArrangement[i + WIDTH] === blank) {
                currentColorArrangement[i + WIDTH] = currentColorArrangement[i];
                currentColorArrangement[i] = blank;
            }
        }
    };

    const dragStart = (e) => {
        setSquareBeingDragged(e.target);
    };

    const dragDrop = (e) => {
        setSquareBeingReplaced(e.target);
    };
    const dragEnd = (e) => {
        const squareBeingReplacedId = parseInt(
            squareBeingReplaced.getAttribute("data-id")
        );
        const squareBeingDraggedId = parseInt(
            squareBeingDragged.getAttribute("data-id")
        );

        currentColorArrangement[squareBeingReplacedId] =
            squareBeingDragged.getAttribute("src");
        currentColorArrangement[squareBeingDraggedId] =
            squareBeingReplaced.getAttribute("src");

        const validMoves = [
            squareBeingDraggedId - 1,
            squareBeingDraggedId - WIDTH,
            squareBeingDraggedId + 1,
            squareBeingDraggedId + WIDTH,
        ];

        const isValidMove = validMoves.includes(squareBeingReplacedId);

        const isColumnOfFour = checkForColumnOfFour();
        const isColumnOfThree = checkForColumnOfThree();
        const isRowOfFour = checkForRowOfFour();
        const isRowOfThree = checkForRowOfThree();

        const isGroupedCorrectly =
            isColumnOfFour || isColumnOfThree || isRowOfFour || isRowOfThree;

        if (squareBeingReplacedId && isValidMove && isGroupedCorrectly) {
            setSquareBeingDragged(null);
            setSquareBeingReplaced(null);
        } else {
            currentColorArrangement[squareBeingReplacedId] =
                squareBeingReplaced.getAttribute("src");
            currentColorArrangement[squareBeingDraggedId] =
                squareBeingDragged.getAttribute("src");
            setCurrentColorArrangement([...currentColorArrangement]);
        }
    };

    const createBoard = () => {
        const randomColorArrangement = [];
        for (let i = 0; i < WIDTH * WIDTH; i++) {
            const randomColor =
                CANDY_COLORS[Math.floor(Math.random() * CANDY_COLORS.length)];
            randomColorArrangement.push(randomColor);
        }
        setCurrentColorArrangement(randomColorArrangement);
    };

    useEffect(() => {
        createBoard();
    }, []);

    useEffect(() => {
        // after component mounts, every 100 ms it runs checks for columns/rows
        // if there are 3, it sets to blank
        const timer = setInterval(() => {
            checkForColumnOfFour();
            checkForColumnOfThree();
            checkForRowOfThree();
            checkForRowOfFour();
            moveIntoSquareBelow();
            // re-set state with currentColorArrangement
            setCurrentColorArrangement([...currentColorArrangement]);
        }, 100);
        return () => clearInterval(timer);
    }, [
        checkForColumnOfFour,
        checkForColumnOfThree,
        checkForRowOfThree,
        checkForRowOfFour,
        moveIntoSquareBelow,
        currentColorArrangement,
    ]);

    return (
        <div className="app">
            <div className="game">
                {currentColorArrangement.map((candyColor, index) => (
                    <img
                        key={index}
                        src={candyColor}
                        alt={candyColor}
                        data-id={index}
                        draggable={true}
                        onDragOver={(e) => e.preventDefault()}
                        onDragEnter={(e) => e.preventDefault()}
                        onDragLeave={(e) => e.preventDefault()}
                        onDrop={dragDrop}
                        onDragEnd={dragEnd}
                        onDragStart={dragStart}
                    />
                ))}
            </div>
            <ScoreBoard score={scoreDisplay} />
        </div>
    );
};

export default App;
