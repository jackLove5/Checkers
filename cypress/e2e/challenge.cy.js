describe('Receive challenge', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/')

    });

    
    it('Receive notification, click accept, game loads', () => {
        const challenge = {
            "senderName": "user2",
            "receiverName": "user1",
            "playerBlack": "user2",
            "playerWhite": "user1",
            "isRanked": false,
            "status": "pending",
            "_id": "64218e7adffd5a3b962fc5f8",
            "__v": 0
        };

        cy.window().its('socketHandlers').invoke('onChallengeRequest', {challenge});
        
        cy.getByData('challenge-request').should('contain.text', 'Unranked');
        cy.getByData('challenge-request').should('contain.text', 'White');

        cy.window().then((win) => {
            cy.stub(win.emittedEvents, 'respondToChallenge', () => {}).as('respondToChallenge');
            cy.getByData('challenge-accept').click();

            cy.get('@respondToChallenge').should('have.been.calledOnce');
            cy.get('@respondToChallenge').should('have.been.calledWith', challenge._id, true);
            cy.window().its('socketHandlers').invoke('onChallengeStart', {gameId: 'abc'});
            cy.location().should((loc) => {
                expect(loc.pathname).to.eq('/play/game/abc');
            })
        })
    });

    it('Multiple notifications should stack', () => {
        const challenge = {
            "senderName": "user2",
            "receiverName": "user1",
            "playerBlack": "user1",
            "playerWhite": "user2",
            "isRanked": true,
            "status": "pending",
            "_id": "64218e7adffd5a3b962fc5f8",
            "__v": 0
        };

        cy.window().its('socketHandlers').invoke('onChallengeRequest', {challenge});
        cy.getByData('challenge-request').should('contain.text', 'Ranked');
        cy.getByData('challenge-request').should('contain.text', 'Black');

        cy.window().its('socketHandlers').invoke('onChallengeRequest', {challenge});

        cy.getByData('challenge-request').should('have.length', 2);
    });

    it('Clicking reject removes the notification from the screen', () => {
        const challenge = {
            "senderName": "user2",
            "receiverName": "user1",
            "playerBlack": "user1",
            "playerWhite": "user2",
            "isRanked": true,
            "status": "pending",
            "_id": "64218e7adffd5a3b962fc5f8",
            "__v": 0
        };

        cy.window().its('socketHandlers').invoke('onChallengeRequest', {challenge});

        cy.window().then((win) => {
            cy.stub(win.emittedEvents, 'respondToChallenge', () => {}).as('respondToChallenge');
            cy.getByData('challenge-reject').click();

            cy.get('@respondToChallenge').should('have.been.calledOnce');
            cy.get('@respondToChallenge').should('have.been.calledWith', challenge._id, false);
            cy.getByData('challenge-request').should('not.exist');
        });
    });
});

describe('send challenge', () => {
    it ('should be able to challenge other user', () => {

        cy.visit('http://localhost:3000/profile?u=user1').then(() => {
            cy.window().then((win) => {
                cy.wait(100);

                cy.stub(win.emittedEvents, 'createChallenge', () => {}).as('createChallenge');


                cy.getByData('challenge').click();
    

                cy.getByData('black').click();
                cy.getByData('unranked').click();
                cy.getByData('send').click();
    
                cy.get('@createChallenge').should('have.been.calledOnce');
                cy.get('@createChallenge').should('have.been.calledWith', 'user1', false, 'b');
                cy.getByData('challenge-request').should('not.exist');
            });
        })

    });
});