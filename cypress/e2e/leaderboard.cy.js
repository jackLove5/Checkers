describe('Leaderboard', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/leaderboard');
  })

  it('should display usernames, rankings, and online status', () => {
    cy.window().then((win) => {
      cy.stub(win.api, 'getRankings', async () => [{username: 'user1', rating: 1000}, {username: 'user2', rating: 500}]).as('getRankings');
      win.socketHandlers.onOnlineUsers({usernames: ['user1']});
      win.displayRankings();

      cy.get('@getRankings').should('have.been.calledOnce');

      cy.get('[data-username="user1"]').as('user1');
      cy.get('[data-username="user2"]').as('user2');
      
      cy.get('@user1').find('[data-cy="rating"]').should('have.text', 1000);
      cy.get('@user1').find('[data-cy="rank"]').should('contain.text', 1);
      cy.get('@user1').find('[data-status="online"]').should('exist');
      cy.get('@user1').find('[data-status="offline"]').should('not.exist');


      cy.get('@user2').find('[data-cy="rating"]').should('have.text', 500);
      cy.get('@user2').find('[data-cy="rank"]').should('contain.text', 2);
      cy.get('@user2').find('[data-status="online"]').should('not.exist');
      cy.get('@user2').find('[data-status="offline"]').should('exist');

    });
  });

  it('clicking name redirects user to profile page', () => {
    cy.window().then((win) => {
      cy.stub(win.api, 'getRankings', async () => [{username: 'user1', rating: 1000}, {username: 'user2', rating: 500}]).as('getRankings');
      win.socketHandlers.onOnlineUsers({usernames: ['user1']});
      win.displayRankings();

      cy.get('@getRankings').should('have.been.calledOnce');

      cy.contains('user1').click();

      cy.location().should((loc) => {
        expect(loc.pathname).to.eq('/profile/');
        expect(loc.search).to.eq('?u=user1')
      })
    });
  });
});