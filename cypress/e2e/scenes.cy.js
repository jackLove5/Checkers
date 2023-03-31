const Chance = require('chance');
const chance = new Chance();
describe('Receive challenge', () => {

    beforeEach(() => {
        cy.visit('http://localhost:3000/')

    });

    it('Register new account, play game, game should appear on profile page, and user should be online', () => {
        cy.getByData('signin').click();
        cy.getByData('register').find('a').click();

        const username = chance.word({length: 15});
        const password = chance.word({length: 15});

        cy.getByData('username').type(username);
        cy.getByData('password').type(password);
        cy.getByData('submit').click();

        cy.getByData('profile').should('have.text', username);
        cy.getByData('play-comp').click();

        cy.getByData('resign').click();

        cy.getByData('profile').click();

        cy.getByData('username').should('have.text', username);
        cy.getByData('game').should('have.length', 1);
        cy.get('[data-cy="status"][data-status="online"]').should('exist');


    })


});