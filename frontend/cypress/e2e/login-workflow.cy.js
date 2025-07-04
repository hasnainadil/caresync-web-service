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
    
    cy.visit('/login');
  });

  it('should login with correct credentials', () => {
    // Test successful login
    cy.get('input[name=email]').type('hasnaenadil@gmail.com');
    cy.get('input[name=password]').type('cygniV&404');
    cy.get('button[type=submit]').click();
    
    // Wait for the login request to complete
    cy.wait('@loginRequest');
    
    // Should redirect to dashboard or home
    cy.url().should('not.include', '/login');
    cy.contains(/dashboard|logout|profile/i);
  });

  it('should show error with incorrect credentials', () => {
    // Test failed login
    cy.get('input[name=email]').type('wrong@example.com');
    cy.get('input[name=password]').type('wrongpassword');
    cy.get('button[type=submit]').click();
    
    // Wait for the login request to complete
    cy.wait('@loginRequest');
    
    // Should show error message
    cy.contains(/invalid|error|failed/i);
  });

  it('should validate required fields', () => {
    // Test form validation
    cy.get('button[type=submit]').click();
    
    // Should show validation errors or stay on login page
    cy.url().should('include', '/login');
  });
}); 