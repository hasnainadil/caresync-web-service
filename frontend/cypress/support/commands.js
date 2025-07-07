// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Custom command to login with real API
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('button[type=submit]').click();
  
  // Wait for authentication to complete
  cy.url().should('not.include', '/login', { timeout: 15000 });
});

// Custom command to register with real API
Cypress.Commands.add('register', (name, email, password, address) => {
  cy.visit('/register');
  cy.get('input[name=name]').type(name);
  cy.get('input[name=email]').type(email);
  cy.get('input[name=password]').type(password);
  cy.get('input[name=address]').type(address);
  cy.get('button[type=submit]').click();
  
  // Wait for registration to complete
  cy.url().should('not.include', '/register', { timeout: 15000 });
});

// Custom command to clear auth state
Cypress.Commands.add('clearAuth', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});

// Custom command to wait for API response
Cypress.Commands.add('waitForApi', (method, url, alias) => {
  cy.intercept(method, url).as(alias);
  cy.wait(`@${alias}`, { timeout: 15000 });
}); 