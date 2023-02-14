beforeEach(() => {
  cy.visit('http://localhost:3000/');
});

describe('create puzzle test', () => {
  it('playAlonePuzzle test', () => {
    cy.get('[data-testid=create-button]').click();

    cy.get('[data-testid=roomName-input]').type('테스트 제목');
    cy.get('[data-testid=puzzleImage-input]').as('fileInput').attachFile('cat.jpg');

    cy.get('[data-testid=playAlonePuzzle-button]').click();

    cy.url().should('include', '/puzzle');
    cy.get('button').eq(0).should('contain', '퍼즐수');
    cy.get('button').eq(1).should('contain', '방 만들기');
  });
});

export {};
