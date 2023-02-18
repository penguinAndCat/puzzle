beforeEach(() => {
  cy.visit('/');
  cy.login('/');
});

describe('friend test', () => {
  it('friend request with mock', () => {
    cy.get('[data-testid=friend-button]').click();

    cy.intercept('GET', '/api/users/friends', { fixture: 'users/friends.json' });

    cy.get('[data-testid=friend-input]').type('구글임니당');
    cy.get('[data-testid=searchFriend-button]').click();
    cy.get('[data-testid=requestFriend-button]').click();

    cy.intercept('POST', '/api/users/friends', (req) => {
      expect(req.body.data).to.include.keys('requester', 'requestedNickname');
      expect(req.body.data).to.property('requester').equal('634c019f9aec5165751868e4');
      expect(req.body.data).to.property('requestedNickname').equal('구글임니당');
      req.reply({
        message: 'success',
      });
    });

    cy.get('[data-testid=toast-div]').should('contain', '친구 요청을 보냈습니다.');
  });

  it('friend request', () => {
    cy.get('[data-testid=friend-button]').click();
    cy.get('[data-testid=friend-input]').type('구글임니당');
    cy.get('[data-testid=searchFriend-button]').click();
    cy.get('[data-testid=requestFriend-button]').click();

    cy.intercept('POST', '/api/users/friends', (req) => {
      expect(req.body.data).to.include.keys('requester', 'requestedNickname');
      expect(req.body.data).to.property('requester').equal('634c019f9aec5165751868e4');
      expect(req.body.data).to.property('requestedNickname').equal('구글임니당');
      req.reply({
        message: 'success',
      });
    });

    cy.get('[data-testid=toast-div]').should('contain', '친구 요청을 보냈습니다.');
  });

  it('duplicated friend request', () => {
    cy.get('[data-testid=friend-button]').click();
    cy.get('[data-testid=friend-input]').type('구글임니당');
    cy.get('[data-testid=searchFriend-button]').click();
    cy.get('[data-testid=requestFriend-button]').click();

    cy.intercept('POST', '/api/users/friends', (req) => {
      expect(req.body.data).to.include.keys('requester', 'requestedNickname');
      expect(req.body.data).to.property('requester').equal('634c019f9aec5165751868e4');
      expect(req.body.data).to.property('requestedNickname').equal('구글임니당');
      req.reply({
        message: 'duplicated',
      });
    });

    cy.get('[data-testid=toast-div]').should('contain', '이미 친구 요청을 보냈습니다.');
  });

  it('friend delete with mock', () => {
    cy.get('[data-testid=friend-button]').click();

    cy.intercept('GET', '/api/users/friends', { fixture: 'users/friends.json' });

    cy.get('[data-testid=deleteFriend-button]').should('have.length', 3);

    cy.get('[data-testid=deleteFriend-button]').eq(2).click();
    cy.on('window:confirm', () => true);

    cy.intercept('DELETE', '/api/users/friends/634c019f9aec5165751868e4', (req) => {
      expect(req.body.data).to.include.keys('friendNickname');
      expect(req.body.data).to.property('friendNickname').equal('네이버2');
      req.reply({
        message: 'success',
      });
    });

    cy.get('[data-testid=deleteFriend-button]').should('have.length', 2);
  });
});

export {};
