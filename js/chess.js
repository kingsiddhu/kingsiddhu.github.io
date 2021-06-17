var board,
    game = new Chess();

/*The "AI" part starts here */

var calculateBestMove =function(game) {

    var newGameMoves = game.ugly_moves();

    return newGameMoves[Math.floor(Math.random() * newGameMoves.length)];

};

/* board visualization and games state handling starts here*/

var onDragStart = function (source, piece, position, orientation) {
    if (game.in_checkmate() === true || game.in_draw() === true ||
        piece.search(/^b/) !== -1) {
        return false;
    }
};
