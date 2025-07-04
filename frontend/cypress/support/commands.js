// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to login
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button[type=submit]').click();
});

// Custom command to register
Cypress.Commands.add('register', (name, email, password, address) => {
  cy.visit('/register');
  cy.get('input[name=name]').type(name);
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('input[name=address]').type(address);
  cy.get('button[type=submit]').click();
}); 