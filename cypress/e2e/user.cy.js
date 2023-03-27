describe('Player vs Player', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.getByData('play-friend').click();
    cy.getByData('board')
  })

  const firstMoveOptions =  [
      {
        "shortNotation": "9-13",
        "longNotation": "9-13",
        "capturedPieces": []
      },
      {
        "shortNotation": "9-14",
        "longNotation": "9-14",
        "capturedPieces": []
      },
      {
        "shortNotation": "10-14",
        "longNotation": "10-14",
        "capturedPieces": []
      },
      {
        "shortNotation": "10-15",
        "longNotation": "10-15",
        "capturedPieces": []
      },
      {
        "shortNotation": "11-15",
        "longNotation": "11-15",
        "capturedPieces": []
      },
      {
        "shortNotation": "11-16",
        "longNotation": "11-16",
        "capturedPieces": []
      },
      {
        "shortNotation": "12-16",
        "longNotation": "12-16",
        "capturedPieces": []
      }
    ];

    describe('game over', () => {
      it("display message and disable clicks on board", () => {
        cy.window().its('socketHandlers').invoke('onGameOver', {result: 'b', reason: 'White resigned'});
        cy.getByData('message').should('contain.text', 'White resigned');
        cy.getByData('message').should('contain.text', 'Black wins');

        cy.getByData('square-15').click();
        cy.get('[data-cy~=highlight]').should('not.exist');
      });

    });


    describe('setup', () => {
      it("message should be blank when page loads", () => {
        cy.getByData('message').should('have.text', '');
  
      });

      it("board flipped correcly depending on player color", () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'w', moveOptions: firstMoveOptions});
        cy.getByData('message').should('contain.text', 'Game started');

        cy.get('[data-cy^=square]').first().should('have.attr', 'data-cy', 'square-1');

        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions})
        cy.get('[data-cy^=square]').first().should('have.attr', 'data-cy', 'square-32');

      })

      it('Board configuration should persist after player refreshes the page', () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions})
    
        cy.getByData('message').should('contain.text', 'Game started');
  
        cy.get('[data-cy^=square]').first().should('have.attr', 'data-cy', 'square-32');
  
        cy.getByData('square-11').click();
        cy.getByData('square-15').find('[data-cy~=highlight]').should('exist');
        cy.getByData('square-16').find('[data-cy~=highlight]').should('exist');
        
        cy.getByData('square-15').click();
        cy.getByData('square-15').find('[data-cy~="piece"][data-cy~="black"]');
        
  
        cy.window().its('socketHandlers').invoke('onMove', {fen: 'B:W32,31,30,29,28,27,26,25,23,22,21,19:B15,12,10,9,8,7,6,5,4,3,2,1'})
        cy.getByData('square-19').find('[data-cy~=piece]').get('[data-cy~=white]');
  
        cy.reload();
  
        cy.window().its('socketHandlers').invoke('onPlayerReconnect', {color: 'b', fen: 'B:W32,31,30,29,28,27,26,25,23,22,21,19:B15,12,10,9,8,7,6,5,4,3,2,1'})
        cy.getByData('square-19').find('[data-cy~=piece][data-cy~=white]');
        cy.getByData('square-15').find('[data-cy~=piece][data-cy~=black]');
      });
    })
    describe('movement', () => {
      it("black pieces should move first, and board should update", () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions})
    
  
        cy.get('[data-cy^=square]').first().should('have.attr', 'data-cy', 'square-32');
  
        cy.getByData('square-11').click();
        cy.getByData('square-15').find('[data-cy~=highlight]').should('exist');
        cy.getByData('square-16').find('[data-cy~=highlight]').should('exist');
        
        cy.getByData('square-15').click();
        cy.getByData('square-15').find('[data-cy~="piece"][data-cy~="black"]');
        
  
        cy.window().its('socketHandlers').invoke('onMove', {fen: 'B:W32,31,30,29,28,27,26,25,23,22,21,19:B15,12,10,9,8,7,6,5,4,3,2,1'})
        cy.getByData('square-19').find('[data-cy~=piece][data-cy~=white]');
      });

      it("player with white pieces should not be able to move until opponent moves first", () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'w', moveOptions: firstMoveOptions});
        cy.getByData('square-11').click();
        cy.get('[data-cy~=highlight]').should('not.exist');

        cy.getByData('square-22').click();
        cy.get('[data-cy~=highlight]').should('not.exist');


        cy.window().its('socketHandlers').invoke('onMove', {fen: 'W:W32,31,30,29,28,27,26,25,24,23,22,21:B15,12,10,9,8,7,6,5,4,3,2,1', moveOptions: []})


        cy.getByData('square-23').click();
        cy.getByData('square-18').find('[data-cy~=highlight]').should('exist');
        cy.getByData('square-19').find('[data-cy~=highlight]').should('exist');
        
        cy.getByData('square-18').click();
        cy.getByData('square-18').find('[data-cy~="piece"][data-cy~="white"]');
  
      });

      it("clicking board should emit move event to server", () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions})
  
        cy.window().then((win) => {
          cy.stub(win.emittedEvents, 'makeMove', () => {}).as('makeMove')
          cy.getByData('square-11').click();
          cy.getByData('square-15').click();
          const firstMove = {
            "shortNotation": "11-15",
            "longNotation": "11-15",
            "capturedPieces": []
          };
          
          cy.get('@makeMove').should('have.been.calledOnce')
          cy.get('@makeMove').should('have.been.calledWith', firstMove, win.gameId);
        });
      });
    });
    

    describe('resign', () => {
      it("player should be able to resign after game has started", () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions})      
        cy.window().then((win) => {
          cy.stub(win.emittedEvents, 'resign', () => {}).as('resign');
          cy.getByData('resign').click();
          cy.get('@resign').should('have.been.calledOnce');
          cy.get('@resign').should('have.been.calledWith', win.gameId);
        })
      });
  
      it("resign button should not exist if game has not started", () => {
        cy.getByData('resign').should('not.exist');
      });

    });

    describe('offer draw', () => {
      it("player should be able to offer draw after game has started", () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions})      
        cy.window().then((win) => {
          cy.stub(win.emittedEvents, 'offerDraw', () => {}).as('offerDraw');
          cy.getByData('offer-draw').click();
          cy.get('@offerDraw').should('have.been.calledOnce');
          cy.get('@offerDraw').should('have.been.calledWith', win.gameId);
        })
      });

      it('Player should be able to accept draw offer when offered by opponent', () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions});
        cy.window().its('socketHandlers').invoke('onOfferDraw', {color: 'w'});
  
        cy.getByData('message').should('contain.text', 'Opponent is offering draw.');
  
        cy.window().then((win) => {
          cy.stub(win.emittedEvents, 'respondDraw', () => {}).as('respondDraw')
          cy.getByData('accept-draw').click();
          cy.get('@respondDraw').should('have.been.calledOnce')
          cy.get('@respondDraw').should('have.been.calledWith', win.gameId, true);
          cy.getByData('accept-draw').should('not.exist');
          cy.getByData('decline-draw').should('not.exist');
  
        });
  
  
      });

      it('Player should be able to reject draw offer when offered by opponent', () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions});
        cy.window().its('socketHandlers').invoke('onOfferDraw', {color: 'w'});
  
        cy.getByData('message').should('contain.text', 'Opponent is offering draw.');
  
        cy.window().then((win) => {
          cy.stub(win.emittedEvents, 'respondDraw', () => {}).as('respondDraw')
          cy.getByData('decline-draw').click();
          cy.get('@respondDraw').should('have.been.calledOnce')
          cy.get('@respondDraw').should('have.been.calledWith', win.gameId, false);
          cy.getByData('accept-draw').should('not.exist');
          cy.getByData('decline-draw').should('not.exist');
  
        });
      });

      it("offer draw button should not exist if game has not started", () => {
        cy.getByData('offer-draw').should('not.exist');
      });

      it("remove offer message when opponent declines draw offer", () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions});
        cy.window().its('socketHandlers').invoke('onOfferDraw', {color: 'b'});
        cy.window().its('socketHandlers').invoke('onDrawDeclined', {color: 'w'});
        cy.getByData('message').should('contain.text', 'decline');
  
      });
  
    })
    
    describe('disconnect', () => {
      it('Player should be able to call draw 10s after opponent disconnects', () => {
        cy.clock()
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions});
  
        cy.window().then((win) => {
  
          cy.stub(win.emittedEvents, 'callDraw', () => {}).as('callDraw')
  
  
          cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions});
    
          cy.window().its('socketHandlers').invoke('onPlayerDisconnect', {});
    
          cy.tick(0);
          cy.getByData('message').should('contain.text', 'Opponent left the game');
          cy.getByData('message').should('contain.text', '10 seconds');
    
          cy.tick(10000)
          cy.getByData('message').should('have.text', 'Opponent left the game.');
          cy.getByData('call-draw').should('have.text', 'call draw').click();
  
          cy.get('@callDraw').should('have.been.calledOnce')
          cy.get('@callDraw').should('have.been.calledWith', win.gameId);
          cy.window().its('socketHandlers').invoke('onGameOver', {result: 'd', reason: 'called draw'});
          cy.getByData('message').should('contain.text', 'Draw');
    
          cy.getByData('claim-win').should('not.exist');
        });
      });

      it('Player should be able to claim win 10s after opponent disconnects', () => {
        cy.clock()
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions});
  
        cy.window().then((win) => {
  
          cy.window().its('socketHandlers').invoke('onPlayerDisconnect', {});
  
          cy.tick(0);
          cy.getByData('message').should('contain.text', 'Opponent left the game');
          cy.getByData('message').should('contain.text', '10 seconds');
    
          cy.tick(10000)
          cy.getByData('message').should('have.text', 'Opponent left the game.');
  
          cy.getByData('claim-win').should('have.text', 'claim win').click();
          cy.stub(win.emittedEvents, 'claimWin', () => {}).as('claimWin')
          cy.get('@claimWin').should('have.been.calledOnce')
          cy.get('@claimWin').should('have.been.calledWith', win.gameId);
          cy.window().its('socketHandlers').invoke('onGameOver', {result: 'b', reason: 'claimed win'});
          cy.getByData('message').should('contain.text', 'Black');
    
          cy.getByData('claim-win').should('not.exist');
        });
      });
    });

    describe('reconnect', () => {
      it('Should hide buttons letting player claim win / call draw when player reconnects', () => {
        cy.window().its('socketHandlers').invoke('onStartGame', {color: 'b', moveOptions: firstMoveOptions});
  
        cy.window().its('socketHandlers').invoke('onPlayerDisconnect', {});
  
        cy.getByData('message').should('contain.text', 'Opponent left');
        cy.window().its('socketHandlers').invoke('onPlayerReconnect', {color: 'w'});
  
        cy.getByData('message').should('have.text', '');
        cy.getByData('claim-win').should('not.exist');
        cy.getByData('call-draw').should('not.exist');
      });

    })
});