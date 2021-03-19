/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1234/');
  });

  it('should drag', () => {
    cy.dragFileTo('#drop', { dir: { test: 'test.txt' } });
    cy.get('#drop').should('contain.text', 'dir');
    cy.get('#drop').should('contain.text', 'test');
  });
});
