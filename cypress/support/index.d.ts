/// <reference types="cypress" />

type Files = {
  [k: string]: string | Files;
};
declare namespace Cypress {
  interface Cypress {
    formatDate(date?: Date): string;
  }

  interface Chainable<Subject> {
    dragFileTo(collection: string, filename: string, mimeType?: string): Chainable<Subject>;
    dragFileTo(collection: string, files: string[], mimeType?: string): Chainable<Subject>;
    dragFileTo(collection: string, files: Files, mimeType?: string): Chainable<Subject>;
  }
}