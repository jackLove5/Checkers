const Piece = require('../public/Piece');
const CheckersGame = require('../public/CheckersGame.js');
const CheckersAi = require('../public/CheckersAi');


test('Should be able to create a Checkers game', () => {
    const game = new CheckersGame();
    expect(game).toBeTruthy();
});

test('Checkers game should allow exactly 2 players', () => {
    const game = new CheckersGame();
    expect(game.players.length).toBe(2);
});

test('Should be able to start a new game', () => {
    const game = new CheckersGame();
    game.start();
});

test('White should have 12 pieces at the start of a new game', () => {
    const game = new CheckersGame();
    game.start();
    let whitePieceCount = 0;
    for (let i = 1; i <= 32; i++) {
        const piece = game.getPieceAtPosition(i);
        if (piece !== null && piece.color === 'w' ) {
            whitePieceCount++;
        }
    }
    expect(whitePieceCount).toBe(12);
});

test('Black should have 12 pieces at the start of a new game', () => {
    const game = new CheckersGame();
    game.start();
    let blackPieceCount = 0;
    for (let i = 1; i <= 32; i++) {
        const piece = game.getPieceAtPosition(i);
        if (piece !== null && piece.color === 'b') {
            blackPieceCount++;
        }
    }
    expect(blackPieceCount).toBe(12);
});

test('Black must be able to make a move at the beginning of a new game', () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
});

test('White must not be able to make a move at the beginning of a new game', () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("22", "18")).toThrow();
});

test('White must be able to make a move after black', () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "14");
    expect(() => game.doMove("23", "19")).not.toThrow();
});

test('Black must not be able to move twice before white', () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "14");
    expect(() => game.doMove("11", "15")).toThrow();
});

test('White must not be able to move twice before Black', () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("11", "15");
    game.doMove("22", "17");
    expect(() => game.doMove()).toThrow();
});

test('Black must be able to move after white', () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    game.doMove("24", "20");
    expect(() => game.doMove("11", "16")).not.toThrow();
});



/*
  
    After starting a new game, the pieces should be in the correct starting configuration

*/
test('After starting a new game, there should be a regular black piece at position 1 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("1")).toEqual(blackPiece);
});

test('After starting a new game, there should be a regular black piece at position 2 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("2")).toEqual(blackPiece);
});

test('After starting a new game, there should be a regular black piece at position 3 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("3")).toEqual(blackPiece);
});


test('After starting a new game, there should be a regular black piece at position 4 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("4")).toEqual(blackPiece);
});


test('After starting a new game, there should be a regular black piece at position 5 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("5")).toEqual(blackPiece);
});


test('After starting a new game, there should be a regular black piece at position 6 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("6")).toEqual(blackPiece);
});


test('After starting a new game, there should be a regular black piece at position 7 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("7")).toEqual(blackPiece);
});


test('After starting a new game, there should be a regular black piece at position 8 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("8")).toEqual(blackPiece);
});


test('After starting a new game, there should be a regular black piece at position 9 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("9")).toEqual(blackPiece);
});


test('After starting a new game, there should be a regular black piece at position 10 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("10")).toEqual(blackPiece);
});


test('After starting a new game, there should be a regular black piece at position 11 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("11")).toEqual(blackPiece);
});


test('After starting a new game, there should be a regular black piece at position 12 on the game board', () => {
    const blackPiece = new Piece('b');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("12")).toEqual(blackPiece);
});


test('After starting a new game, there should be no piece at position 13 on the game board', () => {
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("13")).toBeNull();
});

test('After starting a new game, there should be no piece at position 14 on the game board', () => {
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("14")).toBeNull();
});

test('After starting a new game, there should be no piece at position 15 on the game board', () => {
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("15")).toBeNull();
});

test('After starting a new game, there should be no piece at position 16 on the game board', () => {
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("16")).toBeNull();
});

test('After starting a new game, there should be no piece at position 17 on the game board', () => {
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("17")).toBeNull();
});

test('After starting a new game, there should be no piece at position 18 on the game board', () => {
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("18")).toBeNull();
});

test('After starting a new game, there should be no piece at position 19 on the game board', () => {
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("19")).toBeNull();
});

test('After starting a new game, there should be no piece at position 20 on the game board', () => {
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("20")).toBeNull();
});

test('After starting a new game, there should be a regular white piece at position 21 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("21")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 22 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("22")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 23 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("23")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 24 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("24")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 25 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("25")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 26 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("26")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 27 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("27")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 28 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("28")).toEqual(whitePiece);
});


test('After starting a new game, there should be a regular white piece at position 29 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("29")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 30 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("30")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 31 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("31")).toEqual(whitePiece);
});

test('After starting a new game, there should be a regular white piece at position 32 on the game board', () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    expect(game.getPieceAtPosition("32")).toEqual(whitePiece);
});

test("The game's board must not be accessible", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => { game.board["32"] = null }).toThrow();
});


/* 
    Regular pieces must move forward diagonally
*/
test("Black must not be able to play the move 10-11", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("10", "11")).toThrow();
});

test("White must not be able to play the move 12-21", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    expect(() => game.doMove("122", "21")).toThrow();
});

test("Black must not be able to play the move 9-6", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("9", "6")).toThrow();
});

test("White must not be able to play the move 27-19", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    expect(() => game.doMove("27", "19")).toThrow();
});

test("White must not be able to play the move 26-24", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    expect(() => game.doMove("26", "24")).toThrow();
});

test("White must not be able to play the move 23-20", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    expect(() => game.doMove("23", "20")).toThrow();
});

test("White must not be able to play the move 28-25", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    expect(() => game.doMove("28", "25")).toThrow();
});

test("White must not be able to play the move 21-16", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    expect(() => game.doMove("21", "16")).toThrow();
})

test("Black must not be able to play the move 12-13", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("12", "13")).toThrow();
});


test("Black must not be able to play the move 12-17", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("12", "17")).toThrow();
});

test("Black must not be able to play the move 13-16", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("13", "16")).toThrow();
});

test("Black must be able to play the move 12-16", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("12", "16")).not.toThrow();
});


/*
    Can't move piece to an occupied square
*/
test("Black must not be able to play the move 3-7", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("3", "7")).toThrow();
});
test("Black must not be able to play the move 5-9", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("5", "9")).toThrow();
});

test("White must not be able to play the move 31-27", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    expect(() => game.doMove("31", "27")).toThrow();
});

/*
    board should update after move 
*/
test("position 10 should be empty after the move 10-15", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    expect(game.getPieceAtPosition("10")).toBeNull();
});

test("position 15 should have black piece after the move 10-15", () => {
    const blackPiece = new Piece("b");
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    expect(game.getPieceAtPosition("15")).toEqual(blackPiece);
});

test("doMove should fail when no arguments are provided", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove()).toThrow();
});

test("doMove should fail when one argument is provided", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("12")).toThrow();
});

test("doMove should fail when no arguments are provided", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    expect(() => game.doMove()).toThrow();
});

test("position 23 should be empty after the move 23-19", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "19");
    expect(game.getPieceAtPosition(23)).toBeNull();
});

test("position 19 should have a white piece after the move 23-19", () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "19");
    expect(game.getPieceAtPosition(19)).toEqual(whitePiece);
});

test("should not be able to play the move 15-19 at the beginning of the game", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.doMove("15", "19")).toThrow();
    
});

test("should not be able to play the move 17-14 after 11-15 at the beginning of the game", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("11", "15");
    expect(() => game.doMove("17", "14")).toThrow();
});

test("black should be able to play 15x24 after 10-15 24-19 at the beginning of the game", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("24", "19");
    expect(() => game.doMove("15", "24")).not.toThrow();
});

test("black should be able to play 15x22 after 10-15 22-18 at the beginning of the game", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("22", "18");
    expect(() => game.doMove("15", "22")).not.toThrow();
});

test("black should be able to play 19x28 when jump is available", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("24", "20");
    game.doMove("9", "13");
    game.doMove("23", "18");
    game.doMove("15", "19");
    game.doMove("28", "24");
    expect(() => game.doMove("19", "28")).not.toThrow();
});

test("black should not be able to play the move 18x25 when white piece is not on at position 22", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "19");
    game.doMove("7", "10");
    game.doMove("22", "17");
    game.doMove("15", "18");
    game.doMove("17", "13");
    game.doMove("3", "7");
    game.doMove("21", "17");
    game.doMove("11", "16");
    game.doMove("25", "21");
    expect(() => game.doMove("18", "25")).toThrow();
});


test("black should be able to play 18x25 when jump is available", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "19");
    game.doMove("7", "10");
    game.doMove("22", "17");
    game.doMove("15", "18");
    game.doMove("25", "22");
    expect(() => game.doMove("18", "25")).not.toThrow();
});

test("black should not be able to play 14x23 when white piece is not on position 18", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "14");
    game.doMove("23", "19");
    game.doMove("5", "9");
    game.doMove("24", "20");
    expect(() => game.doMove("14", "23")).toThrow();
});

test("white should be able to play 18x11 after 10-15 23-18 11-16", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "18");
    game.doMove("11", "16");
    expect(() => game.doMove("18", "11")).not.toThrow();
});

test("white should be able to play 18x9 after 10-15 23-18 9-14", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "18");
    game.doMove("9", "14");
    expect(() => game.doMove("18", "9")).not.toThrow();
});


test("white should be able to play 14x5 when jump is available ", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "18");
    game.doMove("9", "13");
    game.doMove("18", "14");
    game.doMove("5", "9");
    expect(() => game.doMove("14", "5")).not.toThrow();
});

test("white should not be able to play 18x9 when black piece is not on position 14", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "18");
    game.doMove("9", "13");
    expect(() => game.doMove("18", "9")).toThrow();
});

test("white should not be able to play 23x16 when black piece is not on position 19", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("12", "16");
    game.doMove("21", "17");
    game.doMove("16", "20");
    expect(() => game.doMove("23", "16")).toThrow();
});


test("white should be able to play 14x7 when jump is available ", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "18");
    game.doMove("9", "13");
    game.doMove("18", "14");
    game.doMove("7", "10");
    expect(() => game.doMove("14", "7")).not.toThrow();
});

test("black should not be able to play 12-16 when 15x24 can be played", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("24", "19");
    expect(() => game.doMove("12", "16")).toThrow();
});

test("black should not be able to play 9x16", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("11", "15");
    game.doMove("22", "17");
    game.doMove("8", "11");
    game.doMove("17", "13");
    expect(() => game.doMove("9", "16")).toThrow();
});

test("black should not be able to play 12x21", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    game.doMove("21", "17");
    expect(() => game.doMove("12", "21")).toThrow();
});

test("black should not be able to play 13x20", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("12", "16");
    game.doMove("21", "17");
    game.doMove("11", "15");
    game.doMove("25", "21");
    game.doMove("16", "19");
    game.doMove("23", "16");
    game.doMove("9", "13");
    game.doMove("27", "23");
    expect(() => game.doMove("13", "20")).toThrow();
});
test("black should not be able to play 16x25", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("11", "16");
    game.doMove("22", "18");
    game.doMove("9", "13");
    game.doMove("25", "22");
    game.doMove("6", "9");
    game.doMove("24", "20");
    expect(() => game.doMove("16", "25")).toThrow();

});


test("white should not be able to play 24x17", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("12", "16");
    game.doMove("22", "18");
    game.doMove("16", "20");
    expect(() => game.doMove("24", "17")).toThrow();
});

test("white should not be able to play 21x12", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("12", "16");
    expect(() => game.doMove("21", "12")).toThrow();
});

test("white should not be able to play 20x13", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "14");
    game.doMove("24", "20");
    game.doMove("9", "13");
    game.doMove("22", "18");
    game.doMove("6", "9");
    game.doMove("28", "24");
    game.doMove("13", "17");
    expect(() => game.doMove("20", "13")).toThrow();
});

test("white should not be able to play 17x8", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    game.doMove("21", "17");
    game.doMove("11", "15");
    game.doMove("23", "18");
    game.doMove("8", "11");
    expect(() => game.doMove("17", "8")).toThrow();
});

test("Black must be able to play 15x31 when possible", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "18");
    game.doMove("9", "13");
    game.doMove("26", "23");
    game.doMove("6", "9");
    game.doMove("31", "26");
    game.doMove("1", "6");
    game.doMove("24", "19");
    expect(() => game.doMove("15", "31")).not.toThrow();
});


test("position 19 should not have a piece after playing the move 15x24", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("24", "19");
    game.doMove("15", "24");
    expect(game.getPieceAtPosition("19")).toBeNull();
});

test("White must be able to play 19x3 when possible", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("21", "17");
    game.doMove("12", "16");
    game.doMove("25", "21");
    game.doMove("16", "20");
    game.doMove("29", "25");
    game.doMove("8", "12");
    game.doMove("17", "13");
    game.doMove("3", "8");
    game.doMove("23", "19");
    game.doMove("9", "14");
    expect(() => game.doMove("19", "3")).not.toThrow();
});


test("position 14 should not have a piece after playing the move 8x19", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "18");
    game.doMove("9", "14");
    game.doMove("18", "9");
    expect(game.getPieceAtPosition("14")).toBeNull();
});

test("White piece should be promoted after playing 12x3", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("21", "17");
    game.doMove("15", "18");
    game.doMove("22", "15");
    game.doMove("11", "18");
    game.doMove("23", "14");
    game.doMove("9", "18");
    game.doMove("24", "19");

    game.doMove("7", "11");
    game.doMove("28", "24");
    game.doMove("12", "16");
    game.doMove("19", "12");
    game.doMove("11", "16");
    game.doMove("26", "22");
    game.doMove("8", "11");
    game.doMove("22", "8");

    game.doMove("4", "11");
    game.doMove("25", "22");
    game.doMove("3", "8");
    game.doMove("12", "3");
    expect(game.getPieceAtPosition(3).isKing).toBeTruthy();

});

test("Black piece should be promoted after playing 22x29", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "18");
    game.doMove("6", "10");
    game.doMove("21", "17");
    game.doMove("9", "14");
    game.doMove("18", "9");
    game.doMove("5", "21");
    game.doMove("22", "17");

    game.doMove("1", "5");
    game.doMove("25", "22");
    game.doMove("11", "16");
    game.doMove("26", "23");
    game.doMove("8", "11");
    game.doMove("22", "18");
    game.doMove("15", "22");
    game.doMove("29", "25");
    game.doMove("22", "29");
    expect(game.getPieceAtPosition(29).isKing).toBeTruthy();

});


test("White king should be able to play 2x11", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("21", "17");
    game.doMove("12", "16");
    game.doMove("24", "19");
    game.doMove("15", "24");
    game.doMove("28", "12");
    game.doMove("9", "13");
    game.doMove("27", "24");

    game.doMove("6", "9");
    game.doMove("23", "18");
    game.doMove("1", "6");
    game.doMove("18", "15");
    game.doMove("11", "18");
    game.doMove("22", "15");
    game.doMove("13", "22");
    game.doMove("25", "18");

    game.doMove("9", "14");
    game.doMove("18", "9");
    game.doMove("5", "14");
    game.doMove("29", "25");

    game.doMove("6", "9");
    game.doMove("25", "22");
    game.doMove("9", "13");
    game.doMove("26", "23");

    game.doMove("2", "6");
    game.doMove("22", "18");
    game.doMove("6", "9");
    game.doMove("15", "10");

    game.doMove("13", "17");
    game.doMove("10", "6");
    game.doMove("9", "13");
    game.doMove("18", "9");

    game.doMove("17", "22");
    game.doMove("6", "2");
    game.doMove("13", "17")
    expect(() => game.doMove("2", "11")).not.toThrow();

});

test("White should be able to play 18x9 when 18x11 is also available", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("11", "15");
    game.doMove("21", "17");
    game.doMove("9", "13");
    game.doMove("23", "18");
    game.doMove("10", "14");

    expect(() => game.doMove("18", "9")).not.toThrow();

});

test("Black should be able to play 15x24 when 15x22 is also available", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("12", "16");
    game.doMove("22", "18");
    game.doMove("8", "12");
    game.doMove("24", "20");
    game.doMove("10", "15");
    game.doMove("23", "19");

    expect(() => game.doMove("15", "24")).not.toThrow();

});


test("White king should be able to play 1-5", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    game.doMove("22", "18");
    game.doMove("10", "14");
    game.doMove("18", "9");
    game.doMove("5", "14");
    game.doMove("25", "22");
    game.doMove("14", "18");
    game.doMove("23", "14");

    game.doMove("6", "9");
    game.doMove("14", "5");
    game.doMove("1", "6");
    game.doMove("5", "1");
    game.doMove("13", "17");
    game.doMove("22", "13");
    game.doMove("6", "10");

    expect(() => game.doMove("1", "5")).not.toThrow();

});

test("White king should be able to play 10x3 (10x19x12x3)", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("21", "17");
    game.doMove("7", "10");
    game.doMove("17", "14");
    game.doMove("10", "17");
    game.doMove("22", "13");
    game.doMove("9", "14");
    game.doMove("24", "20");

    game.doMove("6", "10");
    game.doMove("28", "24");
    game.doMove("3", "7");
    game.doMove("25", "21");
    game.doMove("2", "6");
    game.doMove("23", "19");
    game.doMove("14", "18");
    game.doMove("26", "23");

    game.doMove("10", "14");
    game.doMove("19", "3");
    game.doMove("11", "15");
    game.doMove("23", "19");

    game.doMove("6", "10");
    game.doMove("3", "7");
    game.doMove("1", "6");
    game.doMove("21", "17");

    game.doMove("14", "21");
    game.doMove("7", "23");
    game.doMove("8", "11");
    game.doMove("19", "1");

    game.doMove("11", "15");
    game.doMove("1", "6");
    game.doMove("4", "8");
    game.doMove("6", "10");

    game.doMove("12", "16");

    expect(() => game.doMove("10", "3")).not.toThrow();

});


test("Black king must be able to play 30x16 (30x23x16)", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("21", "17");
    game.doMove("6", "10");
    game.doMove("24", "20");
    game.doMove("9", "14");
    game.doMove("17", "13");
    game.doMove("14", "18");
    game.doMove("23", "14");

    game.doMove("10", "17");
    game.doMove("22", "18");

    game.doMove("15", "22");
    game.doMove("25", "18");

    game.doMove("17", "21");
    game.doMove("29", "25");

    game.doMove("7", "10");
    game.doMove("25", "22");

    game.doMove("3", "7");
    game.doMove("26", "23");
    game.doMove("2", "6");
    game.doMove("30", "26");

    game.doMove("21", "25");
    game.doMove("27", "24");

    game.doMove("25", "30");
    game.doMove("23", "19");
    game.doMove("30", "16");
});

test("White should be winner if black has no moves", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("21", "17");
    game.doMove("6", "10");
    game.doMove("17", "13");
    game.doMove("11", "16");
    game.doMove("13", "6");
    game.doMove("2", "9");
    game.doMove("24", "19");

    game.doMove("15", "24");
    game.doMove("27", "2");

    game.doMove("10", "15");
    game.doMove("28", "24");

    game.doMove("9", "14");
    game.doMove("23", "18");

    game.doMove("14", "23");
    game.doMove("26", "10");

    game.doMove("1", "6");
    game.doMove("10", "1");


    game.doMove("5", "9");
    game.doMove("2", "6");

    game.doMove("8", "11");
    game.doMove("6", "13");

    game.doMove("3", "7");
    game.doMove("1", "6");
    game.doMove("11", "15");

    game.doMove("22", "18");
    game.doMove("15", "22");

    game.doMove("25", "18");
    game.doMove("12", "16");

    game.doMove("13", "17");
    game.doMove("4", "8");
    game.doMove("18", "15");
    game.doMove("8", "11");
    game.doMove("15", "8");
    game.doMove("7", "11");
    game.doMove("6", "10");
    game.doMove("16", "20");
    game.doMove("10", "15");
    game.doMove("11", "18");
    game.doMove("17", "21");
    game.doMove("20", "27");

    expect(() => game.doMove("32", "14")).not.toThrow();
    expect(game.getWinner()).toEqual(CheckersGame.PLAYER_WHITE);

});

test("Black king should be able to play the move 29-25", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("22", "18");
    game.doMove("15", "22");
    game.doMove("25", "18");
    game.doMove("11", "15");
    game.doMove("18", "11");
    game.doMove("8", "15");
    game.doMove("21", "17");

    game.doMove("9", "13");
    game.doMove("17", "14");

    game.doMove("6", "10");
    game.doMove("26", "22");

    game.doMove("10", "26");
    game.doMove("31", "22");

    game.doMove("4", "8");
    game.doMove("29", "25");

    game.doMove("8", "11");
    game.doMove("23", "18");


    game.doMove("13", "17");
    game.doMove("22", "13");


    game.doMove("15", "29");
    game.doMove("30", "26");
    expect(() => game.doMove("29", "25")).not.toThrow();
});

test("Black should be winner if white has no moves", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("22", "18");
    game.doMove("15", "22");
    game.doMove("25", "18");
    game.doMove("11", "15");
    game.doMove("18", "11");
    game.doMove("8", "15");
    game.doMove("21", "17");

    game.doMove("9", "13");
    game.doMove("17", "14");

    game.doMove("6", "10");
    game.doMove("26", "22");

    game.doMove("10", "26");
    game.doMove("31", "22");

    game.doMove("4", "8");
    game.doMove("29", "25");

    game.doMove("8", "11");
    game.doMove("23", "18");


    game.doMove("13", "17");
    game.doMove("22", "13");


    game.doMove("15", "29");
    game.doMove("30", "26");

    game.doMove("29", "25");
    game.doMove("26", "23");
    game.doMove("25", "22");

    game.doMove("24", "19");
    game.doMove("11", "16");

    game.doMove("19", "15");
    game.doMove("5", "9");

    game.doMove("13", "6");
    game.doMove("1", "26");
    game.doMove("27", "24");
    game.doMove("26", "31");
    game.doMove("24", "19");
    game.doMove("16", "23");
    game.doMove("32", "27");
    game.doMove("23", "32");
    game.doMove("28", "24");
    game.doMove("32", "27");
    game.doMove("24", "19");
    game.doMove("27", "23");

    game.doMove("19", "15");
    game.doMove("23", "19");

    game.doMove("15", "10");
    game.doMove("7", "14");
    expect(game.getWinner()).toEqual(CheckersGame.PLAYER_BLACK);

});

test("getPlayableMovesByPosition should only return jump moves when a jump is playable", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("21", "17");
    game.doMove("7", "10");
    game.doMove("17", "14");
    const legalMovesFrom15 = game.getPlayableMovesByPosition(15);
    const has15_18 = legalMovesFrom15.find(move => move.shortNotation === "15-18");
    expect(has15_18).not.toBeTruthy();
});

test("doMove should not accept 25x2 when there exists more than one such jump", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "14");
    game.doMove("24", "20");
    game.doMove("11", "15");
    game.doMove("28", "24");
    game.doMove("6", "9");
    game.doMove("22", "17");
    game.doMove("9", "13");
    game.doMove("32", "28");
    game.doMove("13", "22");
    game.doMove("26", "17");
    game.doMove("2", "6");
    game.doMove("20", "16");
    game.doMove("12", "26");
    game.doMove("30", "23");
    game.doMove("8", "11");
    game.doMove("24", "20");
    game.doMove("15", "18");
    game.doMove("20", "16");
    game.doMove("11", "20");
    game.doMove("28", "24");
    game.doMove("4", "8");
    game.doMove("24", "19");
    game.doMove("8", "11");
    game.doMove("19", "16");
    game.doMove("11", "15");
    game.doMove("16", "12");
    game.doMove("18", "22");
    expect(() => game.doMove("25", "2")).toThrow();
});

test("doMove should accept 25x18x9x2 when playable", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "14");
    game.doMove("24", "20");
    game.doMove("11", "15");
    game.doMove("28", "24");
    game.doMove("6", "9");
    game.doMove("22", "17");
    game.doMove("9", "13");
    game.doMove("32", "28");
    game.doMove("13", "22");
    game.doMove("26", "17");
    game.doMove("2", "6");
    game.doMove("20", "16");
    game.doMove("12", "26");
    game.doMove("30", "23");
    game.doMove("8", "11");
    game.doMove("24", "20");
    game.doMove("15", "18");
    game.doMove("20", "16");
    game.doMove("11", "20");
    game.doMove("28", "24");
    game.doMove("4", "8");
    game.doMove("24", "19");
    game.doMove("8", "11");
    game.doMove("19", "16");
    game.doMove("11", "15");
    game.doMove("16", "12");
    game.doMove("18", "22");
    expect(() => game.doMove("25", "2", "25x18x9x2")).not.toThrow();
});

test("getPlayableMovesByPosition should accept string as input", () => {
    const game = new CheckersGame();
    game.start();
    const moves = game.getPlayableMovesByPosition("1");
    expect(moves.length).toBe(0);
});

test("getPlayableMovesByPosition should only return moves that are playable", () => {
    const game = new CheckersGame();
    game.start();
    const moves = game.getPlayableMovesByPosition("23");
    expect(moves.length).toBe(0);
});


test("Should be able to play the move 2x11x18x9x2", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    game.doMove("22", "18");
    game.doMove("10", "15");
    game.doMove("18", "14");
    game.doMove("11", "16");
    game.doMove("14", "10");
    game.doMove("7", "14");
    game.doMove("24", "20");
    game.doMove("2", "7");
    game.doMove("20", "2");
    game.doMove("3", "7");
    expect(() => game.doMove("2", "2", "2x11x18x9x2")).not.toThrow();

});

test("Pieces should be reset after undoing the first move", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    game.undoLastMove();

    const blackPiece = new Piece('b');
    const whitePiece = new Piece('w');
    for (let i = 1; i <= 32; i++) {
        const piece = game.getPieceAtPosition(i);
        if (i <= 12) {
            expect(piece).toEqual(blackPiece);
        } else if (i >= 21) {
            expect(piece).toEqual(whitePiece);
        } else {
            expect(piece).toBeNull();
        }
    }

    expect(game.turn).toBe(CheckersGame.PLAYER_BLACK);

});

test("Should be black's turn after undoing the first move", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    game.undoLastMove();

    expect(game.turn).toBe(CheckersGame.PLAYER_BLACK);
});

test("Should be white's turn after undoing the second move", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    game.doMove("22", "18");
    game.undoLastMove();

    expect(game.turn).toBe(CheckersGame.PLAYER_WHITE);
});

test("Should throw error when trying to undo move at the beginning of game", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.undoLastMove()).toThrow();
});

test("should be black piece on 7, white piece on 10, and empty on 14 after undoing move 7x14", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("9", "13");
    game.doMove("22", "18");
    game.doMove("10", "15");
    game.doMove("18", "14");
    game.doMove("11", "16");
    game.doMove("14", "10");
    game.doMove("7", "14");
    game.undoLastMove();

    const blackPiece = new Piece('b');
    const whitePiece = new Piece('w');

    expect(game.getPieceAtPosition(7)).toEqual(blackPiece);
    expect(game.getPieceAtPosition(10)).toEqual(whitePiece);
    expect(game.getPieceAtPosition(14)).toBeNull();
});

test("board evaluation should be 0 at beginning of the game", () => {
    const game = new CheckersGame();
    game.start();

    const ai = new CheckersAi(game);
    const utility = ai.getBoardEvaluation(game);
    expect(utility).toBe(0);
});

test("board evaluation should be > 0 when black has more pieces than white", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("24", "19");
    game.doMove("15", "24");

    const ai = new CheckersAi(game);
    const utility = ai.getBoardEvaluation(game);
    expect(utility).toBeGreaterThan(0);
});

test("board evaluation should be < 0 when white has more pieces than black", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("23", "18");
    game.doMove("15", "19");
    game.doMove("24", "15");

    const ai = new CheckersAi(game);
    const utility = ai.getBoardEvaluation(game);
    expect(utility).toBeLessThan(0);
});

test("board evaluation should be INF when black wins", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("22", "18");
    game.doMove("15", "22");
    game.doMove("25", "18");
    game.doMove("11", "15");
    game.doMove("18", "11");
    game.doMove("8", "15");
    game.doMove("21", "17");

    game.doMove("9", "13");
    game.doMove("17", "14");

    game.doMove("6", "10");
    game.doMove("26", "22");

    game.doMove("10", "26");
    game.doMove("31", "22");

    game.doMove("4", "8");
    game.doMove("29", "25");

    game.doMove("8", "11");
    game.doMove("23", "18");


    game.doMove("13", "17");
    game.doMove("22", "13");


    game.doMove("15", "29");
    game.doMove("30", "26");

    game.doMove("29", "25");
    game.doMove("26", "23");
    game.doMove("25", "22");

    game.doMove("24", "19");
    game.doMove("11", "16");

    game.doMove("19", "15");
    game.doMove("5", "9");

    game.doMove("13", "6");
    game.doMove("1", "26");
    game.doMove("27", "24");
    game.doMove("26", "31");
    game.doMove("24", "19");
    game.doMove("16", "23");
    game.doMove("32", "27");
    game.doMove("23", "32");
    game.doMove("28", "24");
    game.doMove("32", "27");
    game.doMove("24", "19");
    game.doMove("27", "23");

    game.doMove("19", "15");
    game.doMove("23", "19");

    game.doMove("15", "10");
    game.doMove("7", "14");

    const ai = new CheckersAi(game);
    const utility = ai.getBoardEvaluation(game);
    expect(utility).toEqual(Infinity);
});

test("board evaluation should be -INF when white wins", () => {
    const game = new CheckersGame();
    game.start();
    game.doMove("10", "15");
    game.doMove("21", "17");
    game.doMove("6", "10");
    game.doMove("17", "13");
    game.doMove("11", "16");
    game.doMove("13", "6");
    game.doMove("2", "9");
    game.doMove("24", "19");

    game.doMove("15", "24");
    game.doMove("27", "2");

    game.doMove("10", "15");
    game.doMove("28", "24");

    game.doMove("9", "14");
    game.doMove("23", "18");

    game.doMove("14", "23");
    game.doMove("26", "10");

    game.doMove("1", "6");
    game.doMove("10", "1");


    game.doMove("5", "9");
    game.doMove("2", "6");

    game.doMove("8", "11");
    game.doMove("6", "13");

    game.doMove("3", "7");
    game.doMove("1", "6");
    game.doMove("11", "15");

    game.doMove("22", "18");
    game.doMove("15", "22");

    game.doMove("25", "18");
    game.doMove("12", "16");

    game.doMove("13", "17");
    game.doMove("4", "8");
    game.doMove("18", "15");
    game.doMove("8", "11");
    game.doMove("15", "8");
    game.doMove("7", "11");
    game.doMove("6", "10");
    game.doMove("16", "20");
    game.doMove("10", "15");
    game.doMove("11", "18");
    game.doMove("17", "21");
    game.doMove("20", "27");
    game.doMove("32", "14")

    const ai = new CheckersAi(game);
    const utility = ai.getBoardEvaluation(game);
    expect(utility).toEqual(-Infinity);
});

test("getNextMove should not return null when all moves result in a win", () => {

    const game = new CheckersGame();
    game.start();
    game.doMove("11", "15");
    game.doMove("21", "17");
    game.doMove("8", "11");
    game.doMove("24", "19");
    game.doMove("15", "24");
    game.doMove("27", "20");
    game.doMove("11", "15");
    game.doMove("23", "19");
    game.doMove("15", "24");
    game.doMove("28", "19");
    game.doMove("10", "15");
    game.doMove("19", "10");
    game.doMove("7", "21");
    game.doMove("22", "18");
    game.doMove("9", "14");
    game.doMove("18", "9");
    game.doMove("5", "14");
    game.doMove("25", "22");
    game.doMove("6", "10");
    game.doMove("22", "18");
    game.doMove("14", "23");
    game.doMove("26", "19");
    game.doMove("1", "6");
    game.doMove("29", "25");
    game.doMove("2", "7");
    game.doMove("30", "26");
    game.doMove("21", "30");
    game.doMove("31", "27");
    game.doMove("30", "16");
    game.doMove("20", "2", "20x11x2");
    game.doMove("6", "9");
    game.doMove("2", "6");
    game.doMove("10", "15");
    game.doMove("6", "13");
    game.doMove("12", "16");
    game.doMove("13", "17");
    game.doMove("3", "7");
    game.doMove("17", "21");
    game.doMove("4", "8");
    game.doMove("21", "25");
    game.doMove("7", "10");
    game.doMove("25", "29");
    game.doMove("8", "11");
    game.doMove("29", "25");
    game.doMove("10", "14");
    game.doMove("25", "30");
    game.doMove("14", "18");
    game.doMove("27", "23");
    game.doMove("18", "27");
    game.doMove("32", "23");
    game.doMove("16", "20");
    game.doMove("30", "26");
    game.doMove("20", "24");
    game.doMove("23", "19");
    game.doMove("15", "18");
    game.doMove("19", "15");
    game.doMove("11", "16");
    game.doMove("15", "11");
    game.doMove("24", "27");
    game.doMove("26", "23");
    game.doMove("27", "32");
    game.doMove("23", "14");
    game.doMove("32", "27");
    game.doMove("11", "7");
    game.doMove("27", "23");
    game.doMove("7", "3");
    game.doMove("16", "19");
    game.doMove("3", "7");
    game.doMove("19", "24");
    game.doMove("7", "11");
    game.doMove("24", "28");
    game.doMove("11", "15");
    game.doMove("28", "32");
    game.doMove("14", "17");
    game.doMove("32", "27");
    game.doMove("15", "11");
    game.doMove("23", "18");
    game.doMove("11", "16");
    game.doMove("27", "24");
    game.doMove("16", "12");
    game.doMove("24", "27");
    game.doMove("12", "16");
    game.doMove("27", "23");
    game.doMove("16", "12");
    game.doMove("23", "19");


    const ai = new CheckersAi(game);

    const [move, v] = ai.getNextMove();
    expect(move).not.toBeNull();
});

test('Game should be draw after position has been repeated 3 times', () => {
    const game = new CheckersGame();
    game.start();
    game.doMove('10', '15');
    game.doMove('21', '17');
    game.doMove('15', '18');
    game.doMove('22', '15');
    game.doMove('11', '18');
    game.doMove('23', '14');
    game.doMove('9', '18');
    game.doMove('24', '19');
    game.doMove('6', '10');
    game.doMove('26', '23');
    game.doMove('5', '9');
    game.doMove('23', '5');
    game.doMove('1', '6');
    game.doMove('25', '22');
    game.doMove('8', '11');
    game.doMove('27', '23');
    game.doMove('11', '15');
    game.doMove('28', '24');
    
    
    game.doMove('6', '9');
    game.doMove('29', '25');
    game.doMove('4', '8');
    game.doMove('22', '18');
    game.doMove('15', '29');
    game.doMove('19', '15');
    game.doMove('10', '28');
    game.doMove('23', '19');
    game.doMove('7', '11');

   
    game.doMove('30', '26');
    game.doMove('3', '7');
    game.doMove('26', '23');
    game.doMove('11', '15');
    game.doMove('19', '3');
    game.doMove('8', '11');
    game.doMove('3', '8');
    game.doMove('2', '7');


    game.doMove('8', '15');
    game.doMove('29', '25');
    game.doMove('23', '18');
    game.doMove('25', '22');

   
    game.doMove('15', '10');
    game.doMove('22', '6');
    game.doMove('32', '27');
    game.doMove('9', '14');
    game.doMove('17', '3');
    

    game.doMove('12', '16');
    game.doMove('27', '24');
    game.doMove('16', '19');
    game.doMove('24', '15');
    game.doMove('6', '10');
    game.doMove('15', '6');
    game.doMove('28', '32');
    game.doMove('31', '27');
    game.doMove('32', '23');
    game.doMove('6', '2');
    game.doMove('23', '18');
    game.doMove('2', '7');
    game.doMove('18', '15');
    game.doMove('7', '10');
    game.doMove('15', '6');
    game.doMove('5', '1');
    game.doMove('6', '9');
    game.doMove('1', '6');
    game.doMove('9', '2');
    game.doMove('3', '8');
    game.doMove('2', '7');
    game.doMove('8', '3');
    game.doMove('7', '2');
    game.doMove('3', '8');
    game.doMove('2', '7');
    game.doMove('8', '3');
    game.doMove('7', '2');
    expect(game.isDraw()).toBe(true);

    
});

test('Game should be draw if no captures have been made in the last 40 moves and no unpromoted piece has advanced', () => {
    const game = new CheckersGame();
    game.start();
    game.doMove('10', '15');
    game.doMove('21', '17');
    game.doMove('15', '18');
    game.doMove('22', '15');
    game.doMove('11', '18');
    game.doMove('23', '14');
    game.doMove('9', '18');
    game.doMove('24', '19');
    game.doMove('6', '10');
    game.doMove('26', '23');
    game.doMove('5', '9');
    game.doMove('23', '5');
    game.doMove('1', '6');
    game.doMove('25', '22');
    game.doMove('8', '11');
    game.doMove('27', '23');
    game.doMove('11', '15');
    game.doMove('28', '24');
    
    
    game.doMove('6', '9');
    game.doMove('29', '25');
    game.doMove('4', '8');
    game.doMove('22', '18');
    game.doMove('15', '29');
    game.doMove('19', '15');
    game.doMove('10', '28');
    game.doMove('23', '19');
    game.doMove('7', '11');

   
    game.doMove('30', '26');
    game.doMove('3', '7');
    game.doMove('26', '23');
    game.doMove('11', '15');
    game.doMove('19', '3');
    game.doMove('8', '11');
    game.doMove('3', '8');
    game.doMove('2', '7');


    game.doMove('8', '15');
    game.doMove('29', '25');
    game.doMove('23', '18');
    game.doMove('25', '22');

   
    game.doMove('15', '10');
    game.doMove('22', '6');
    game.doMove('32', '27');
    game.doMove('9', '14');
    game.doMove('17', '3');
    

    game.doMove('12', '16');
    game.doMove('27', '24');
    game.doMove('16', '19');
    game.doMove('24', '15');
    game.doMove('6', '10');
    game.doMove('15', '6');
    game.doMove('28', '32');
    game.doMove('31', '27');
    game.doMove('32', '23');
    game.doMove('6', '2');
    game.doMove('23', '18');
    game.doMove('2', '7');
    game.doMove('18', '15');
    game.doMove('7', '10');
    game.doMove('15', '6');
    game.doMove('5', '1');
    game.doMove('6', '9');
    game.doMove('1', '6');
    game.doMove('9', '2');


    game.doMove('3', '8');
    game.doMove('2', '7');

    game.doMove('8', '12');
    game.doMove('7', '2');

    game.doMove('12', '16');
    game.doMove('2', '7');

    game.doMove('16', '20');
    game.doMove('7', '2');

    game.doMove('20', '24');
    game.doMove('2', '7');

    game.doMove('24', '27');
    game.doMove('7', '2');

    game.doMove('27', '23');
    game.doMove('2', '7');

    game.doMove('23', '26');
    game.doMove('7', '2');

    game.doMove('26', '22');
    game.doMove('2', '7');

    game.doMove('22', '25');
    game.doMove('7', '2');

    game.doMove('25', '30');
    game.doMove('2', '7');

    game.doMove('30', '26');
    game.doMove('7', '2');

    game.doMove('26', '31');
    game.doMove('2', '7');

    game.doMove('31', '27');
    game.doMove('7', '2');

    game.doMove('27', '32');
    game.doMove('2', '7');

    game.doMove('32', '28');
    game.doMove('7', '2');

    game.doMove('28', '32');
    game.doMove('2', '6');

    game.doMove('32', '27');
    game.doMove('6', '1');

    game.doMove('27', '31');
    game.doMove('1', '6');

    game.doMove('31', '26');
    game.doMove('6', '1');

    game.doMove('26', '30');
    game.doMove('1', '6');

    game.doMove('30', '25');
    game.doMove('6', '1');

    game.doMove('25', '21');
    game.doMove('1', '6');

    game.doMove('21', '17');
    game.doMove('6', '1');

    game.doMove('17', '22');
    game.doMove('1', '6');

    game.doMove('22', '18');
    game.doMove('6', '1');

    game.doMove('18', '23');
    game.doMove('1', '6');

    game.doMove('23', '19');
    game.doMove('6', '1');

    game.doMove('19', '24');
    game.doMove('1', '6');

    game.doMove('24', '20');
    game.doMove('6', '1');

    game.doMove('20', '16');
    game.doMove('1', '5');

    game.doMove('16', '19');
    game.doMove('5', '9');

    game.doMove('19', '15');
    game.doMove('9', '5');

    game.doMove('15', '18');
    game.doMove('5', '9');

    game.doMove('18', '22');
    game.doMove('9', '5');

    game.doMove('22', '17');
    game.doMove('5', '9');

    game.doMove('17', '21');
    game.doMove('9', '5');

    game.doMove('21', '25');
    game.doMove('5', '9');

    game.doMove('25', '22');
    game.doMove('9', '5');

    game.doMove('22', '26');
    
    expect(game.isDraw()).toBe(false);
    
    game.doMove('5', '9');

    expect(game.isDraw()).toBe(true);
});

test('Game should have playable moves after starting', () => {
    const game = new CheckersGame();
    game.start();
    const moves = game.getPlayableMoves();
    expect(moves).toBeTruthy();
});

test('getFen() should return current state of the board', () => {
    const game = new CheckersGame();
    game.start();

    const fen = game.getFen();
    expect(fen).toBeTruthy();
})

test("draws calculated by ai should not affect the draw status of the actual game", () => {
    const game = new CheckersGame();
    const ai = new CheckersAi(game);
    game.start();

    game.doMove("10", "14");
    game.doMove("22", "18");
    game.doMove("7", "10");
    game.doMove("23", "19");
    game.doMove("14", "23");
    game.doMove("27", "18");
    game.doMove("11", "15");

    game.doMove("18", "11");
    game.doMove("8", "15");

    game.doMove("21", "17");
    game.doMove("9", "14");
    game.doMove("17", "13");
    game.doMove("5", "9");
    game.doMove("24", "20");
    game.doMove("15", "24");
    game.doMove("28", "19");
    game.doMove("4", "8");
    game.doMove("25", "21");
    game.doMove("8", "11");
    game.doMove("26", "23");
    game.doMove("10", "15");
    game.doMove("19", "10");
    game.doMove("6", "15");
    game.doMove("13", "6");
    game.doMove("2", "9");
    game.doMove("23", "19");
    game.doMove("15", "24");
    game.doMove("32", "28");
    game.doMove("12", "16");
    game.doMove("28", "12");
    game.doMove("11", "15");
    game.doMove("20", "16");
    game.doMove("14", "18");
    game.doMove("16", "11");
    game.doMove("15", "19");
    game.doMove("11", "8");
    game.doMove("19", "24");
    game.doMove("8", "4");
    game.doMove("24", "28");
    game.doMove("4", "8");
    game.doMove("28", "32");
    game.doMove("8", "11");
    game.doMove("18", "23");
    game.doMove("11", "15");
    game.doMove("9", "14");
    game.doMove("15", "19");
    game.doMove("23", "27");
    game.doMove("31", "24");
    game.doMove("14", "18");
    game.doMove("21", "17");
    game.doMove("18", "22");

    game.doMove("17", "13");
    game.doMove("3", "7");

    game.doMove("12", "8");
    game.doMove("7", "10");

    game.doMove("8", "4");
    game.doMove("10", "14");

    game.doMove("4", "8");
    game.doMove("14", "17");
    game.doMove("8", "12");
    game.doMove("17", "21");
    game.doMove("12", "16");
    game.doMove("1", "6");
    
    let [move, _] = ai.getNextMove();
    let [src, dst] = move.shortNotation.split(/-|x/);
    
    game.doMove(src, dst);
    
    expect(game.isDraw()).toBe(false);
});