// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Handle uncaught exceptions globally to prevent test failures
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // on uncaught exceptions (like network errors)
  console.log('Uncaught exception:', err.message);
  return false;
});

// Mock all API calls that might fail in CI environment
beforeEach(() => {
  // Mock any unhandled API calls with empty responses
  cy.intercept('GET', '**/api/**', { statusCode: 200, body: [] }).as('apiFallback');
  cy.intercept('POST', '**/api/**', { statusCode: 200, body: { success: true } }).as('apiPostFallback');
  
  // Mock Firebase auth calls
  cy.intercept('POST', '**/identitytoolkit.googleapis.com/**', { 
    statusCode: 200, 
    body: { 
      idToken: 'mock-firebase-token',
      localId: 'mock-user-id',
      email: 'test@example.com'
    } 
  }).as('firebaseAuth');
  
  // Mock any other potential API calls
  cy.intercept('GET', '**/hospital/**', { statusCode: 200, body: [] }).as('hospitalFallback');
  cy.intercept('POST', '**/hospital/**', { statusCode: 200, body: { success: true } }).as('hospitalPostFallback');
  cy.intercept('GET', '**/user/**', { statusCode: 200, body: [] }).as('userFallback');
  cy.intercept('POST', '**/user/**', { statusCode: 200, body: { success: true } }).as('userPostFallback');
}); 