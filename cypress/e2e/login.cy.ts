beforeEach(() => {
  cy.visit('/');
});

describe('login test', () => {
  it('main login test', () => {
    cy.login('/');
    cy.get('button').eq(0).should('contain', '친구');
    cy.get('button').eq(1).should('contain', '알림');
    cy.get('button').eq(2).should('contain', '메뉴');
  });
});

export {};
