describe('Login Workflow', () => {
  beforeEach(() => {
    // Mock authentication API calls
    cy.intercept('POST', '**/user/v1/login', (req) => {
      const { email, password } = req.body;
      if (email === 'hasnaenadil@gmail.com' && password === 'cygniV&404') {
        req.reply({ 
          statusCode: 200, 
          body: { 
            success: true, 
            data: { 
              userId: 'user123', 
              name: 'John Doe', 
              email: 'hasnaenadil@gmail.com', 
              token: 'mock-jwt-token-12345' 
            }, 
            message: 'Login successful' 
          } 
        });
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
    
    // Should redirect to dashboard or home (without waiting for API)
    cy.url().should('not.include', '/login', { timeout: 10000 });
    cy.contains(/dashboard|logout|profile/i, { timeout: 10000 });
  });

  it('should show error with incorrect credentials', () => {
    // Test failed login
    cy.get('input[name=email]').type('wrong@example.com');
    cy.get('input[name=password]').type('wrongpassword');
    cy.get('button[type=submit]').click();
    
    // Should show error message (without waiting for API)
    cy.contains(/invalid|error|failed/i, { timeout: 10000 });
  });

  it('should validate required fields', () => {
    // Test form validation
    cy.get('button[type=submit]').click();
    
    // Should show validation errors or stay on login page
    cy.url().should('include', '/login');
  });
}); 