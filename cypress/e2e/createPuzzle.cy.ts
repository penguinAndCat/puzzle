Cypress.Commands.add('login', (url: string) => {
  cy.log('Logging in to Google');
  cy.setCookie('refreshToken', String(Cypress.env('CYPRESS_REFRESH_TOKEN')));
  cy.visit(url);
});

beforeEach(() => {
  cy.visit('/');
});

describe('create puzzle test', () => {
  it('main login test', () => {
    cy.login('/');
    cy.get('button').eq(0).should('contain', '친구');
    cy.get('button').eq(1).should('contain', '알림');
    cy.get('button').eq(2).should('contain', '메뉴');
  });

  it('playAlonePuzzle test', () => {
    cy.get('[data-testid=create-button]').click();

    cy.get('[data-testid=roomName-input]').type('테스트 제목');
    cy.get('[data-testid=puzzleImage-input]').as('fileInput').attachFile('cat.jpg');

    cy.wait(1000); // 이미지 저장 기다림
    cy.get('[data-testid=playAlonePuzzle-button]').click();

    cy.url().should('include', '/puzzle');
    cy.get('button').eq(0).should('contain', '퍼즐수');
    cy.get('button').eq(1).should('contain', '방 만들기');
  });
});

export {};
