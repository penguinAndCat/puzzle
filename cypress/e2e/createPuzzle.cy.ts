beforeEach(() => {
  cy.visit('/');
});

describe('create puzzle test', () => {
  it('not title', () => {
    cy.get('[data-testid=create-button]').click();
    cy.get('[data-testid=puzzleImage-input]').as('fileInput').attachFile('cat.jpg');
    cy.wait(1000); // 이미지 저장 기다림
    cy.get('[data-testid=playAlonePuzzle-button]').click();

    cy.get('[data-testid=toast-div]').should('contain', '방 제목을 지어주세요.');
  });

  it('not image', () => {
    cy.get('[data-testid=create-button]').click();
    cy.get('[data-testid=roomName-input]').type('테스트 제목');
    cy.get('[data-testid=playAlonePuzzle-button]').click();

    cy.get('[data-testid=toast-div]').should('contain', '퍼즐 이미지를 등록해주세요.');
  });

  it('play alone puzzle', () => {
    cy.get('[data-testid=create-button]').click();
    cy.get('[data-testid=roomName-input]').type('테스트 제목');
    cy.get('[data-testid=puzzleImage-input]').as('fileInput').attachFile('cat.jpg');
    cy.wait(1000); // 이미지 저장 기다림
    cy.get('[data-testid=playAlonePuzzle-button]').click();

    cy.url().should('include', '/puzzle');
    cy.get('button').eq(0).should('contain', '퍼즐수');
    cy.get('button').eq(1).should('contain', '방 만들기');
  });

  it('create pzzle', () => {
    cy.login('/');
    cy.get('[data-testid=create-button]').click();
    cy.get('[data-testid=roomName-input]').type('테스트 제목');
    cy.get('[data-testid=puzzleImage-input]').as('fileInput').attachFile('cat.jpg');
    cy.wait(1000); // 이미지 저장 기다림
    cy.get('[data-testid=createPuzzleRoom-button]').click();

    cy.intercept('POST', 'https://api.cloudinary.com/v1_1/**', (req) => {
      req.reply({ url: 'http://cypress.test/data' });
    });
    cy.intercept('POST', '/api/puzzle', (req) => {
      expect(req.body.data).to.include.keys(
        'config',
        'level',
        'maximumPlayer',
        'perfection',
        'secretRoom',
        'thumbImage',
        'title',
        'userId'
      );
      expect(req.body.data).to.property('title').equal('테스트 제목');
      expect(req.body.data).to.property('thumbImage').equal('http://cypress.test/data');
      req.reply({
        item: { _id: '63be44aebc49226bbf55344a' },
      });
    });
    cy.wait(1000); // 퍼즐 페이지 이동 기다림

    cy.url().should('include', '/puzzle');
    cy.get('button').eq(0).should('contain', '방 정보');
  });
});

export {};
