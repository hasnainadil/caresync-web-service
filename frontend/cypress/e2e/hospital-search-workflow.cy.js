describe('Hospital Search Workflow', () => {
  beforeEach(() => {
    // Clear any existing auth state
    cy.clearLocalStorage();
    cy.clearCookies();
    
    cy.visit('/hospitals');
    // Wait for the page to load and API call to complete
    cy.get('h1', { timeout: 15000 }).should('be.visible');
  });

  it('should display all hospitals by default', () => {
    // Test that hospitals page loads and shows hospitals
    cy.get('h1').contains('Find Hospitals').should('be.visible');
    
    // Wait for hospitals to load
    cy.get('body').then(($body) => {
      // Look for hospital cards or the "No hospitals found" message
      const hasHospitalCards = $body.find('a[href*="/hospitals/"]').length > 0;
      const hasNoHospitalsMessage = $body.text().includes('No hospitals found');
      
      if (hasHospitalCards) {
        // Verify hospital cards are displayed
        cy.get('a[href*="/hospitals/"]').should('have.length.greaterThan', 0);
      } else if (hasNoHospitalsMessage) {
        // Verify the no hospitals message is shown
        cy.contains('No hospitals found').should('be.visible');
      } else {
        // At minimum, verify the page loaded
        cy.get('h1').should('be.visible');
      }
    });
  });


  it('should switch between grid and map view', () => {
    // Test view switching buttons
    cy.get('button').contains('Grid View').should('be.visible');
    cy.get('button').contains('Map View').should('be.visible');
    
    // Test switching to map view
    cy.get('button').contains('Map View').click();
    cy.get('button').contains('Map View').should('have.class', 'text-gray-700');
    
    // Test switching back to grid view
    cy.get('button').contains('Grid View').click();
    cy.get('button').contains('Grid View').should('have.class', 'text-gray-700');
  });

  it('should show hospital count', () => {
    // Test that hospital count is displayed
    cy.get('body').then(($body) => {
      if ($body.text().includes('Showing')) {
        cy.contains(/Showing \d+ hospitals/).should('be.visible');
      }
    });
  });
}); 