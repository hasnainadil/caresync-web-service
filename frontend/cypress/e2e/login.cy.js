describe('Login Workflow', () => {
  it('shows error on invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type('wrong@example.com');
    cy.get('input[name=password]').type('wrongpassword');
    cy.get('button[type=submit]').click();
    cy.contains(/invalid|error|failed/i); // Adjust to your error message
  });

  it('logs in with correct credentials', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type('hasnaenadil@gmail.com');
    cy.get('input[name=password]').type('cygniV&404');
    cy.get('button[type=submit]').click();
    cy.url().should('not.include', '/login');
    cy.contains(/dashboard|logout|profile/i); // Adjust to your logged-in indicator
  });
}); 