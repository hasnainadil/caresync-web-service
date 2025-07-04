describe('Login Workflow', () => {
  beforeEach(() => {
    // Mock authentication API calls
    cy.intercept('POST', '**/user/v1/login', (req) => {
      const { email, password } = req.body;
      if (email === 'hasnaenadil@gmail.com' && password === 'cygniV&404') {
        req.reply({ fixture: 'auth.json', statusCode: 200 });
      } else {
        req.reply({ 
          statusCode: 401, 
          body: { 
            success: false, 
            error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' } 
          } 
        });
      }
    }).as('loginRequest');
  });

  it('shows error on invalid credentials', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type('wrong@example.com');
    cy.get('input[name=password]').type('wrongpassword');
    cy.get('button[type=submit]').click();
    cy.wait('@loginRequest');
    cy.contains(/invalid|error|failed/i); // Adjust to your error message
  });

  it('logs in with correct credentials', () => {
    cy.visit('/login');
    cy.get('input[name=email]').type('hasnaenadil@gmail.com');
    cy.get('input[name=password]').type('cygniV&404');
    cy.get('button[type=submit]').click();
    cy.wait('@loginRequest');
    cy.url().should('not.include', '/login');
    cy.contains(/dashboard|logout|profile/i); // Adjust to your logged-in indicator
  });
}); 