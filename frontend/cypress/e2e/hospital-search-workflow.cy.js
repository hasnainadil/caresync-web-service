describe('Hospital Search Workflow', () => {
  beforeEach(() => {
    cy.visit('/hospitals');
  });

  it('should search hospitals by location', () => {
    // Test hospital search functionality
    cy.get('input[placeholder*="location" i]').type('Dhaka');
    cy.get('button').contains('Search').click();
    
    // Should show search results
    cy.get('[class*="hospital"]').should('be.visible');
  });

  it('should filter hospitals by type', () => {
    // Test hospital filtering
    cy.get('select').first().select('Public');
    cy.get('button').contains('Search').click();
    
    // Should show filtered results
    cy.get('[class*="hospital"]').should('be.visible');
  });

  it('should view hospital details', () => {
    // Test hospital details navigation
    cy.get('a[href*="/hospitals/"]').first().click();
    
    // Should navigate to hospital details page
    cy.url().should('include', '/hospitals/');
    cy.get('h1').should('be.visible');
  });

  it('should switch between grid and map view', () => {
    // Test view switching
    cy.get('button').contains('Map').click();
    cy.get('[class*="map"]').should('be.visible');
    
    cy.get('button').contains('Grid').click();
    cy.get('[class*="grid"]').should('be.visible');
  });
}); 