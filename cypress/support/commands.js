// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('dragFileTo', (el, files, mimeType = 'application/octet-stream') => {
  cy.window().then (win => {
    class ExFile extends win.File {
      constructor(root, data, fileName, options) {
        super(data, fileName, options);
        this.root = root;
      }
      webkitGetAsEntry() {
        const me = this;
        return {
          isDirectory: false,
          isFile: true,
          name: this.name,
          fullPath: this.root + this.name,
          file: callback => callback(this),
        };
      }
    }
    class ExDir extends ExFile {
      constructor(root, entries, fileName, options) {
        super(root, [], fileName, options);
        this.entries = entries.map(entry => entry.webkitGetAsEntry());
      }
      webkitGetAsEntry() {
        const me = this;
        return {
          isDirectory: true,
          isFile: false,
          name: this.name,
          fullPath: this.root + this.name,
          createReader: () => ({ readEntries: callback => callback(this.entries) }),
        };
      }
    }
  
    if (typeof files === 'string') {
      files = { [files]: files };
    } else if (files.length) {
      files = files.reduce((result, file) => ({ ...result, [file]: file }), {});
    }
    function createFilesTree(filesTree, root) {
      return Promise.all(Object.keys(filesTree).map(filename => typeof filesTree[filename] === 'string'
        ? new Promise(resolve => cy
          .fixture(filesTree[filename], 'base64')
          .then(Cypress.Blob.base64StringToBlob)
          .then(blob => new ExFile(root, [blob], filename, { type: mimeType }))
          .then(resolve))
        : new Promise(resolve => {
          createFilesTree(filesTree[filename], root + filename + '/').then(enteries => resolve(new ExDir(root, enteries, filename)));
        })
      ));
    }
    createFilesTree(files, '/').then(fileTree => {
      const originalDataTransfer = new win.DataTransfer();
      fileTree.forEach(file => originalDataTransfer.items.add(file));
      const dataTransfer = {
        ...originalDataTransfer,
        items: [...fileTree],
        files: [...fileTree],
      };
      dataTransfer.getData = (...args) => originalDataTransfer.getData(...args);
      return cy.get(el).trigger('drop', { dataTransfer });
    });
  });
});