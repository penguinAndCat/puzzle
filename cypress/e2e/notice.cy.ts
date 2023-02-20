beforeEach(() => {
  cy.visit('/');
  cy.login('/');
  cy.intercept('GET', '/api/users/notices', { fixture: 'users/notices.json' });
});

describe('notice test', () => {
  it('notice list with mock', () => {
    cy.get('[data-testid=notice-button]').click();

    cy.get('[data-testid=acceptFriend-button]').should('have.length', 1);
    cy.get('[data-testid=acceptPuzzle-button]').should('have.length', 1);
  });

  it('friend reject with mock', () => {
    cy.get('[data-testid=notice-button]').click();
    cy.get('[data-testid=rejectFriend-button]').eq(0).click();
    cy.intercept('DELETE', '/api/users/friends', (req) => {
      expect(req.body.data).to.include.keys('userId', 'friendNickname');
      expect(req.body.data).to.property('userId').equal('634c019f9aec5165751868e4');
      expect(req.body.data).to.property('friendNickname').equal('네이버2');
      req.reply({
        message: 'success',
      });
    });

    cy.get('[data-testid=toast-div]').should('contain', '초대를 거절하였습니다.');
  });

  it('puzzle invitation reject with mock', () => {
    cy.get('[data-testid=notice-button]').click();
    cy.get('[data-testid=rejectPuzzle-button]').eq(0).click();
    cy.intercept('DELETE', '/api/users/puzzle', (req) => {
      expect(req.body.data).to.include.keys('userId', 'puzzleId');
      expect(req.body.data).to.property('userId').equal('634c019f9aec5165751868e4');
      expect(req.body.data).to.property('puzzleId').equal('63f1c9b191e9976cb270b0f5');
      req.reply({
        message: 'success',
      });
    });

    cy.get('[data-testid=toast-div]').should('contain', '초대를 거절하였습니다.');
  });
});

export {};
