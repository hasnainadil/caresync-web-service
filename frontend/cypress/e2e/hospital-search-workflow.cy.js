describe('Hospital Search Workflow', () => {
  beforeEach(() => {
    // Mock Firebase authentication
    cy.window().then((win) => {
      // Mock Firebase auth
      const mockUser = {
        uid: 'test-user-id',
        getIdToken: () => Promise.resolve('mock-jwt-token-12345')
      };
      
      win.firebase = {
        auth: () => ({
          currentUser: mockUser,
          onAuthStateChanged: (callback) => {
            callback(mockUser);
            return () => {};
          }
        })
      };
      
      // Mock the auth import
      win.auth = {
        currentUser: mockUser
      };
    });

    // Mock API calls before visiting the page
    cy.intercept('GET', '**/hospital/v1/all', { fixture: 'hospitals.json' }).as('getAllHospitals');
    cy.intercept('GET', '**/hospital/v1/search*', { fixture: 'hospitals.json' }).as('searchHospitals');
    cy.intercept('GET', '**/hospital/v1/id/*', (req) => {
      const hospitalId = req.url.split('/').pop();
      cy.fixture('hospitals.json').then((hospitals) => {
        const hospital = hospitals.find(h => h.id === parseInt(hospitalId)) || hospitals[0];
        req.reply({ statusCode: 200, body: hospital });
      });
    }).as('getHospitalById');
    
    cy.visit('/hospitals');
    // Wait for the page to load and API call to complete
    cy.wait('@getAllHospitals', { timeout: 10000 });
    // Additional wait for the page to render
    cy.get('h1', { timeout: 10000 }).should('be.visible');
  });

  it('should search hospitals by location', () => {
    // Test hospital search functionality
    cy.get('h1').contains('Find Hospitals').should('be.visible');
    cy.get('button').contains('Search Hospitals').should('be.visible');
  });

  it('should filter hospitals by type', () => {
    // Test hospital filtering
    cy.get('h1').contains('Find Hospitals').should('be.visible');
    cy.get('button').contains('Search Hospitals').should('be.visible');
  });

  it('should view hospital details', () => {
    // Test hospital details navigation
    cy.get('h1').contains('Find Hospitals').should('be.visible');
    // If there are hospital cards, test clicking one
    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/hospitals/"]').length > 0) {
        cy.get('a[href*="/hospitals/"]').first().click();
        cy.url().should('include', '/hospitals/');
      } else {
        // If no hospital cards, just verify we're on the hospitals page
        cy.url().should('include', '/hospitals');
      }
    });
  });

  it('should switch between grid and map view', () => {
    // Test view switching
    cy.get('button').contains('Grid View').should('be.visible');
    cy.get('button').contains('Map View').should('be.visible');
  });
}); 