const {Piece } = require('../src/Piece');
const { CheckersBoard } = require('../src/CheckersBoard');
const { CheckersGame } = require('../src/CheckersGame');

test('Should be able to create a Checkers board', () => {
    const board = new CheckersBoard();
    expect(board).toBeTruthy();
});

test('Game board should have exactly 32 playable squares', () => {
    const board = new CheckersBoard();
    expect(Object.keys(board.squares).length).toBe(32);
});

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
    game.makeBlackMove("10", "15");
});

test('White must not be able to make a move at the beginning of a new game', () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeWhiteMove()).toThrow();
});

test('White must be able to make a move after black', () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "14");
    game.makeWhiteMove("23", "19");
});

test('Black must not be able to move twice before white', () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "14");
    expect(() => game.makeBlackMove("11", "15")).toThrow();
});

test('White must not be able to move twice before Black', () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("11", "15");
    game.makeWhiteMove("22", "17");
    expect(() => game.makeWhiteMove()).toThrow();
});

test('Black must be able to move after white', () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("24", "20");
    expect(() => game.makeBlackMove("11", "16")).not.toThrow();
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
    expect(() => { game.board.squares["32"] = null }).toThrow();
});


/* 
    Regular pieces must move forward diagonally
*/
test("Black must not be able to play the move 10-11", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("10", "11")).toThrow();
});

test("White must not be able to play the move 12-21", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    expect(() => game.makeWhiteMove("122", "21")).toThrow();
});

test("Black must not be able to play the move 9-6", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("9", "6")).toThrow();
});

test("White must not be able to play the move 27-19", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    expect(() => game.makeWhiteMove("27", "19")).toThrow();
});

test("White must not be able to play the move 26-24", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    expect(() => game.makeWhiteMove("26", "24")).toThrow();
});

test("White must not be able to play the move 23-20", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    expect(() => game.makeWhiteMove("23", "20")).toThrow();
});

test("White must not be able to play the move 28-25", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    expect(() => game.makeWhiteMove("28", "25")).toThrow();
});

test("White must not be able to play the move 21-16", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    expect(() => game.makeWhiteMove("21", "16")).toThrow();
})

test("Black must not be able to play the move 12-13", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("12", "13")).toThrow();
});


test("Black must not be able to play the move 12-17", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("12", "17")).toThrow();
});

test("Black must not be able to play the move 13-16", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("13", "16")).toThrow();
});

test("Black must be able to play the move 12-16", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("12", "16")).not.toThrow();
});


/*
    Can't move piece to an occupied square
*/
test("Black must not be able to play the move 3-7", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("3", "7")).toThrow();
});
test("Black must not be able to play the move 5-9", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("5", "9")).toThrow();
});

test("White must not be able to play the move 31-27", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    expect(() => game.makeWhiteMove("31", "27")).toThrow();
});

/*
    board should update after move 
*/
test("position 10 should be empty after the move 10-15", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    expect(game.getPieceAtPosition("10")).toBeNull();
});

test("position 15 should have black piece after the move 10-15", () => {
    const blackPiece = new Piece("b");
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    expect(game.getPieceAtPosition("15")).toEqual(blackPiece);
});

test("makeBlackMove should fail when no arguments are provided", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove()).toThrow();
});

test("makeBlackMove should fail when one argument is provided", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("12")).toThrow();
});

test("makeWhiteMove should fail when no arguments are provided", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    expect(() => game.makeWhiteMove()).toThrow();
});

test("position 23 should be empty after the move 23-19", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "19");
    expect(game.getPieceAtPosition(23)).toBeNull();
});

test("position 19 should have a white piece after the move 23-19", () => {
    const whitePiece = new Piece('w');
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "19");
    expect(game.getPieceAtPosition(19)).toEqual(whitePiece);
});

test("should not be able to play the move 15-19 at the beginning of the game", () => {
    const game = new CheckersGame();
    game.start();
    expect(() => game.makeBlackMove("15", "19")).toThrow();
    
});

test("should not be able to play the move 17-14 after 11-15 at the beginning of the game", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("11", "15");
    expect(() => game.makeWhiteMove("17", "14")).toThrow();
});

test("black should be able to play 15x24 after 10-15 24-19 at the beginning of the game", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("24", "19");
    expect(() => game.makeBlackMove("15", "24")).not.toThrow();
});

test("black should be able to play 15x22 after 10-15 22-18 at the beginning of the game", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("22", "18");
    expect(() => game.makeBlackMove("15", "22")).not.toThrow();
});

test("black should be able to play 19x28 when jump is available", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("24", "20");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("15", "19");
    game.makeWhiteMove("28", "24");
    expect(() => game.makeBlackMove("19", "28")).not.toThrow();
});

test("black should not be able to play the move 18x25 when white piece is not on at position 22", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "19");
    game.makeBlackMove("7", "10");
    game.makeWhiteMove("22", "17");
    game.makeBlackMove("15", "18");
    game.makeWhiteMove("17", "13");
    game.makeBlackMove("3", "7");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("11", "16");
    game.makeWhiteMove("25", "21");
    expect(() => game.makeBlackMove("18", "25")).toThrow();
});


test("black should be able to play 18x25 when jump is available", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "19");
    game.makeBlackMove("7", "10");
    game.makeWhiteMove("22", "17");
    game.makeBlackMove("15", "18");
    game.makeWhiteMove("25", "22");
    expect(() => game.makeBlackMove("18", "25")).not.toThrow();
});

test("black should not be able to play 14x23 when white piece is not on position 18", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "14");
    game.makeWhiteMove("23", "19");
    game.makeBlackMove("5", "9");
    game.makeWhiteMove("24", "20");
    expect(() => game.makeBlackMove("14", "23")).toThrow();
});

test("white should be able to play 18x11 after 10-15 23-18 11-16", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("11", "16");
    expect(() => game.makeWhiteMove("18", "11")).not.toThrow();
});

test("white should be able to play 18x9 after 10-15 23-18 9-14", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("9", "14");
    expect(() => game.makeWhiteMove("18", "9")).not.toThrow();
});


test("white should be able to play 14x5 when jump is available ", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("18", "14");
    game.makeBlackMove("5", "9");
    expect(() => game.makeWhiteMove("14", "5")).not.toThrow();
});

test("white should not be able to play 18x9 when black piece is not on position 14", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("9", "13");
    expect(() => game.makeWhiteMove("18", "9")).toThrow();
});

test("white should not be able to play 23x16 when black piece is not on position 19", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("12", "16");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("16", "20");
    expect(() => game.makeWhiteMove("23", "16")).toThrow();
});


test("white should be able to play 14x7 when jump is available ", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("18", "14");
    game.makeBlackMove("7", "10");
    expect(() => game.makeWhiteMove("14", "7")).not.toThrow();
});

test("black should not be able to play 12-16 when 15x24 can be played", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("24", "19");
    expect(() => game.makeBlackMove("12", "16")).toThrow();
});

test("black should not be able to play 9x16", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("11", "15");
    game.makeWhiteMove("22", "17");
    game.makeBlackMove("8", "11");
    game.makeWhiteMove("17", "13");
    expect(() => game.makeBlackMove("9", "16")).toThrow();
});

test("black should not be able to play 12x21", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("21", "17");
    expect(() => game.makeBlackMove("12", "21")).toThrow();
});

test("black should not be able to play 13x20", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("12", "16");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("11", "15");
    game.makeWhiteMove("25", "21");
    game.makeBlackMove("16", "19");
    game.makeWhiteMove("23", "16");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("27", "23");
    expect(() => game.makeBlackMove("13", "20")).toThrow();
});
test("black should not be able to play 16x25", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("11", "16");
    game.makeWhiteMove("22", "18");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("25", "22");
    game.makeBlackMove("6", "9");
    game.makeWhiteMove("24", "20");
    expect(() => game.makeBlackMove("16", "25")).toThrow();

});


test("white should not be able to play 24x17", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("12", "16");
    game.makeWhiteMove("22", "18");
    game.makeBlackMove("16", "20");
    expect(() => game.makeWhiteMove("24", "17")).toThrow();
});

test("white should not be able to play 21x12", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("12", "16");
    expect(() => game.makeWhiteMove("21", "12")).toThrow();
});

test("white should not be able to play 20x13", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "14");
    game.makeWhiteMove("24", "20");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("22", "18");
    game.makeBlackMove("6", "9");
    game.makeWhiteMove("28", "24");
    game.makeBlackMove("13", "17");
    expect(() => game.makeWhiteMove("20", "13")).toThrow();
});

test("white should not be able to play 17x8", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("11", "15");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("8", "11");
    expect(() => game.makeWhiteMove("17", "8")).toThrow();
});

test("Black must be able to play 15x31 when possible", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("26", "23");
    game.makeBlackMove("6", "9");
    game.makeWhiteMove("31", "26");
    game.makeBlackMove("1", "6");
    game.makeWhiteMove("24", "19");
    expect(() => game.makeBlackMove("15", "31")).not.toThrow();
});


test("position 19 should not have a piece after playing the move 15x24", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("24", "19");
    game.makeBlackMove("15", "24");
    expect(game.getPieceAtPosition("19")).toBeNull();
});

test("White must be able to play 19x3 when possible", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("12", "16");
    game.makeWhiteMove("25", "21");
    game.makeBlackMove("16", "20");
    game.makeWhiteMove("29", "25");
    game.makeBlackMove("8", "12");
    game.makeWhiteMove("17", "13");
    game.makeBlackMove("3", "8");
    game.makeWhiteMove("23", "19");
    game.makeBlackMove("9", "14");
    expect(() => game.makeWhiteMove("19", "3")).not.toThrow();
});


test("position 14 should not have a piece after playing the move 8x19", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("9", "14");
    game.makeWhiteMove("18", "9");
    expect(game.getPieceAtPosition("14")).toBeNull();
});

test("White piece should be promoted after playing 12x3", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("15", "18");
    game.makeWhiteMove("22", "15");
    game.makeBlackMove("11", "18");
    game.makeWhiteMove("23", "14");
    game.makeBlackMove("9", "18");
    game.makeWhiteMove("24", "19");

    game.makeBlackMove("7", "11");
    game.makeWhiteMove("28", "24");
    game.makeBlackMove("12", "16");
    game.makeWhiteMove("19", "12");
    game.makeBlackMove("11", "16");
    game.makeWhiteMove("26", "22");
    game.makeBlackMove("8", "11");
    game.makeWhiteMove("22", "8");

    game.makeBlackMove("4", "11");
    game.makeWhiteMove("25", "22");
    game.makeBlackMove("3", "8");
    game.makeWhiteMove("12", "3");
    expect(game.getPieceAtPosition(3).isKing).toBeTruthy();

});

test("Black piece should be promoted after playing 22x29", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("6", "10");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("9", "14");
    game.makeWhiteMove("18", "9");
    game.makeBlackMove("5", "21");
    game.makeWhiteMove("22", "17");

    game.makeBlackMove("1", "5");
    game.makeWhiteMove("25", "22");
    game.makeBlackMove("11", "16");
    game.makeWhiteMove("26", "23");
    game.makeBlackMove("8", "11");
    game.makeWhiteMove("22", "18");
    game.makeBlackMove("15", "22");
    game.makeWhiteMove("29", "25");
    game.makeBlackMove("22", "29");
    expect(game.getPieceAtPosition(29).isKing).toBeTruthy();

});


test("White king should be able to play 2x11", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("12", "16");
    game.makeWhiteMove("24", "19");
    game.makeBlackMove("15", "24");
    game.makeWhiteMove("28", "12");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("27", "24");

    game.makeBlackMove("6", "9");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("1", "6");
    game.makeWhiteMove("18", "15");
    game.makeBlackMove("11", "18");
    game.makeWhiteMove("22", "15");
    game.makeBlackMove("13", "22");
    game.makeWhiteMove("25", "18");

    game.makeBlackMove("9", "14");
    game.makeWhiteMove("18", "9");
    game.makeBlackMove("5", "14");
    game.makeWhiteMove("29", "25");

    game.makeBlackMove("6", "9");
    game.makeWhiteMove("25", "22");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("26", "23");

    game.makeBlackMove("2", "6");
    game.makeWhiteMove("22", "18");
    game.makeBlackMove("6", "9");
    game.makeWhiteMove("15", "10");

    game.makeBlackMove("13", "17");
    game.makeWhiteMove("10", "6");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("18", "9");

    game.makeBlackMove("17", "22");
    game.makeWhiteMove("6", "2");
    game.makeBlackMove("13", "17")
    expect(() => game.makeWhiteMove("2", "11")).not.toThrow();

});

test("White should be able to play 18x9 when 18x11 is also available", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("11", "15");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("23", "18");
    game.makeBlackMove("10", "14");

    expect(() => game.makeWhiteMove("18", "9")).not.toThrow();

});

test("Black should be able to play 15x24 when 15x22 is also available", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("12", "16");
    game.makeWhiteMove("22", "18");
    game.makeBlackMove("8", "12");
    game.makeWhiteMove("24", "20");
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("23", "19");

    expect(() => game.makeBlackMove("15", "24")).not.toThrow();

});


test("White king should be able to play 1-5", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("9", "13");
    game.makeWhiteMove("22", "18");
    game.makeBlackMove("10", "14");
    game.makeWhiteMove("18", "9");
    game.makeBlackMove("5", "14");
    game.makeWhiteMove("25", "22");
    game.makeBlackMove("14", "18");
    game.makeWhiteMove("23", "14");

    game.makeBlackMove("6", "9");
    game.makeWhiteMove("14", "5");
    game.makeBlackMove("1", "6");
    game.makeWhiteMove("5", "1");
    game.makeBlackMove("13", "17");
    game.makeWhiteMove("22", "13");
    game.makeBlackMove("6", "10");

    expect(() => game.makeWhiteMove("1", "5")).not.toThrow();

});

test("White king should be able to play 10x3 (10x19x12x3)", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("7", "10");
    game.makeWhiteMove("17", "14");
    game.makeBlackMove("10", "17");
    game.makeWhiteMove("22", "13");
    game.makeBlackMove("9", "14");
    game.makeWhiteMove("24", "20");

    game.makeBlackMove("6", "10");
    game.makeWhiteMove("28", "24");
    game.makeBlackMove("3", "7");
    game.makeWhiteMove("25", "21");
    game.makeBlackMove("2", "6");
    game.makeWhiteMove("23", "19");
    game.makeBlackMove("14", "18");
    game.makeWhiteMove("26", "23");

    game.makeBlackMove("10", "14");
    game.makeWhiteMove("19", "3");
    game.makeBlackMove("11", "15");
    game.makeWhiteMove("23", "19");

    game.makeBlackMove("6", "10");
    game.makeWhiteMove("3", "7");
    game.makeBlackMove("1", "6");
    game.makeWhiteMove("21", "17");

    game.makeBlackMove("14", "21");
    game.makeWhiteMove("7", "23");
    game.makeBlackMove("8", "11");
    game.makeWhiteMove("19", "1");

    game.makeBlackMove("11", "15");
    game.makeWhiteMove("1", "6");
    game.makeBlackMove("4", "8");
    game.makeWhiteMove("6", "10");

    game.makeBlackMove("12", "16");

    expect(() => game.makeWhiteMove("10", "3")).not.toThrow();

});


test("Black king must be able to play 30x16 (30x23x16)", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("6", "10");
    game.makeWhiteMove("24", "20");
    game.makeBlackMove("9", "14");
    game.makeWhiteMove("17", "13");
    game.makeBlackMove("14", "18");
    game.makeWhiteMove("23", "14");

    game.makeBlackMove("10", "17");
    game.makeWhiteMove("22", "18");

    game.makeBlackMove("15", "22");
    game.makeWhiteMove("25", "18");

    game.makeBlackMove("17", "21");
    game.makeWhiteMove("29", "25");

    game.makeBlackMove("7", "10");
    game.makeWhiteMove("25", "22");

    game.makeBlackMove("3", "7");
    game.makeWhiteMove("26", "23");
    game.makeBlackMove("2", "6");
    game.makeWhiteMove("30", "26");

    game.makeBlackMove("21", "25");
    game.makeWhiteMove("27", "24");

    game.makeBlackMove("25", "30");
    game.makeWhiteMove("23", "19");
    game.makeBlackMove("30", "16");
});

test("White should be winner if black has no moves", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("21", "17");
    game.makeBlackMove("6", "10");
    game.makeWhiteMove("17", "13");
    game.makeBlackMove("11", "16");
    game.makeWhiteMove("13", "6");
    game.makeBlackMove("2", "9");
    game.makeWhiteMove("24", "19");

    game.makeBlackMove("15", "24");
    game.makeWhiteMove("27", "2");

    game.makeBlackMove("10", "15");
    game.makeWhiteMove("28", "24");

    game.makeBlackMove("9", "14");
    game.makeWhiteMove("23", "18");

    game.makeBlackMove("14", "23");
    game.makeWhiteMove("26", "10");

    game.makeBlackMove("1", "6");
    game.makeWhiteMove("10", "1");


    game.makeBlackMove("5", "9");
    game.makeWhiteMove("2", "6");

    game.makeBlackMove("8", "11");
    game.makeWhiteMove("6", "13");

    game.makeBlackMove("3", "7");
    game.makeWhiteMove("1", "6");
    game.makeBlackMove("11", "15");

    game.makeWhiteMove("22", "18");
    game.makeBlackMove("15", "22");

    game.makeWhiteMove("25", "18");
    game.makeBlackMove("12", "16");

    game.makeWhiteMove("13", "17");
    game.makeBlackMove("4", "8");
    game.makeWhiteMove("18", "15");
    game.makeBlackMove("8", "11");
    game.makeWhiteMove("15", "8");
    game.makeBlackMove("7", "11");
    game.makeWhiteMove("6", "10");
    game.makeBlackMove("16", "20");
    game.makeWhiteMove("10", "15");
    game.makeBlackMove("11", "18");
    game.makeWhiteMove("17", "21");
    game.makeBlackMove("20", "27");

    expect(() => game.makeWhiteMove("32", "14")).not.toThrow();
    expect(game.getWinner()).toEqual(CheckersGame.PLAYER_WHITE);

});

test("Black king should be able to play the move 29-25", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("22", "18");
    game.makeBlackMove("15", "22");
    game.makeWhiteMove("25", "18");
    game.makeBlackMove("11", "15");
    game.makeWhiteMove("18", "11");
    game.makeBlackMove("8", "15");
    game.makeWhiteMove("21", "17");

    game.makeBlackMove("9", "13");
    game.makeWhiteMove("17", "14");

    game.makeBlackMove("6", "10");
    game.makeWhiteMove("26", "22");

    game.makeBlackMove("10", "26");
    game.makeWhiteMove("31", "22");

    game.makeBlackMove("4", "8");
    game.makeWhiteMove("29", "25");

    game.makeBlackMove("8", "11");
    game.makeWhiteMove("23", "18");


    game.makeBlackMove("13", "17");
    game.makeWhiteMove("22", "13");


    game.makeBlackMove("15", "29");
    game.makeWhiteMove("30", "26");
    expect(() => game.makeBlackMove("29", "25")).not.toThrow();
});

test("Black should be winner if white has no moves", () => {
    const game = new CheckersGame();
    game.start();
    game.makeBlackMove("10", "15");
    game.makeWhiteMove("22", "18");
    game.makeBlackMove("15", "22");
    game.makeWhiteMove("25", "18");
    game.makeBlackMove("11", "15");
    game.makeWhiteMove("18", "11");
    game.makeBlackMove("8", "15");
    game.makeWhiteMove("21", "17");

    game.makeBlackMove("9", "13");
    game.makeWhiteMove("17", "14");

    game.makeBlackMove("6", "10");
    game.makeWhiteMove("26", "22");

    game.makeBlackMove("10", "26");
    game.makeWhiteMove("31", "22");

    game.makeBlackMove("4", "8");
    game.makeWhiteMove("29", "25");

    game.makeBlackMove("8", "11");
    game.makeWhiteMove("23", "18");


    game.makeBlackMove("13", "17");
    game.makeWhiteMove("22", "13");


    game.makeBlackMove("15", "29");
    game.makeWhiteMove("30", "26");

    game.makeBlackMove("29", "25");
    game.makeWhiteMove("26", "23");
    game.makeBlackMove("25", "22");

    game.makeWhiteMove("24", "19");
    game.makeBlackMove("11", "16");

    game.makeWhiteMove("19", "15");
    game.makeBlackMove("5", "9");

    game.makeWhiteMove("13", "6");
    game.makeBlackMove("1", "26");
    game.makeWhiteMove("27", "24");
    game.makeBlackMove("26", "31");
    game.makeWhiteMove("24", "19");
    game.makeBlackMove("16", "23");
    game.makeWhiteMove("32", "27");
    game.makeBlackMove("23", "32");
    game.makeWhiteMove("28", "24");
    game.makeBlackMove("32", "27");
    game.makeWhiteMove("24", "19");
    game.makeBlackMove("27", "23");

    game.makeWhiteMove("19", "15");
    game.makeBlackMove("23", "19");

    game.makeWhiteMove("15", "10");
    game.makeBlackMove("7", "14");
    expect(game.getWinner()).toEqual(CheckersGame.PLAYER_BLACK);

});