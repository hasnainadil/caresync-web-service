describe('User Registration Workflow', () => {
  beforeEach(() => {
    // Mock registration and OTP verification API calls
    cy.intercept('POST', '**/user/v1/register', { fixture: 'auth.json' }).as('registerUser');
    cy.intercept('POST', '**/user/v1/verify-otp', { fixture: 'auth.json' }).as('verifyOtp');
    
    cy.visit('/register');
  });

  it('should register a new user successfully', () => {
    // Test successful registration
    cy.get('input[name=name]').type('John Doe');
    cy.get('input[name=email]').type('john.doe@example.com');
    cy.get('input[name=password]').type('SecurePass123!');
    cy.get('input[name=address]').type('123 Main St, Dhaka');
    cy.get('button[type=submit]').click();
    
    // Wait for registration request
    cy.wait('@registerUser');
    
    // Should show success message or redirect to OTP verification
    cy.contains(/success|verification|otp/i);
  });

  it('should validate form fields', () => {
    // Test form validation
    cy.get('button[type=submit]').click();
    
    // Should show validation errors or stay on register page
    cy.url().should('include', '/register');
  });

  it('should verify OTP after registration', () => {
    // Test OTP verification flow
    cy.get('input[name=name]').type('Jane Smith');
    cy.get('input[name=email]').type('jane.smith@example.com');
    cy.get('input[name=password]').type('SecurePass123!');
    cy.get('input[name=address]').type('456 Oak St, Dhaka');
    cy.get('button[type=submit]').click();
    
    // Wait for registration request
    cy.wait('@registerUser');
    
    // Should redirect to OTP verification page or show success
    cy.url().should('include', '/verify-otp');
    cy.get('input[type=text]').type('123456');
    cy.get('button').contains('Verify').click();
    
    // Wait for OTP verification request
    cy.wait('@verifyOtp');
    
    // Should show verification success
    cy.contains(/success|verified/i);
  });
}); 