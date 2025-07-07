# Cypress E2E Testing

This directory contains end-to-end tests for the CareSync frontend application using Cypress.

## Overview

The tests have been updated to use the **real API endpoints** instead of mock data. All tests now interact with the live backend at `https://services.caresync.district12.xyz/`.

## Test Files

- `login-workflow.cy.js` - Tests user login functionality
- `login.cy.js` - Additional login tests
- `login-debug.cy.js` - Debug test for login process
- `registration-workflow.cy.js` - Tests user registration
- `hospital-search-workflow.cy.js` - Tests hospital display and view switching
- `api-integration.cy.js` - Tests real API integration for all main pages

## Test Coverage

The tests cover the three main application pages:

### 1. Hospitals Page (`/hospitals`)
- Displays all hospitals by default (no search required)
- Shows hospital cards with details
- Grid/Map view switching
- Hospital count display
- Search functionality availability

### 2. Login Page (`/login`)
- User authentication with real credentials
- Form validation
- Error handling for invalid credentials
- Successful login redirect

### 3. Registration Page (`/register`)
- User registration with unique emails
- Form validation
- Error handling for duplicate emails
- Successful registration redirect

## Configuration

The Cypress configuration (`cypress.config.cjs`) has been updated with:
- Increased timeouts for real API calls (20 seconds)
- Retry configuration for flaky tests
- Better error handling for network requests

## Custom Commands

The following custom commands are available in `cypress/support/commands.js`:

- `cy.login(email, password)` - Login with real API
- `cy.register(name, email, password, address)` - Register with real API
- `cy.clearAuth()` - Clear authentication state
- `cy.waitForApi(method, url, alias)` - Wait for API response

## Running Tests

### Prerequisites
1. Ensure your frontend is running on `http://localhost:5173`
2. Ensure your backend is accessible at `https://services.caresync.district12.xyz/`
3. Have valid test credentials ready

### Commands

```bash
# Run all tests
npm run cypress:run

# Open Cypress Test Runner
npm run cypress:open

# Run specific test file
npx cypress run --spec "cypress/e2e/login-workflow.cy.js"

# Run debug test
npx cypress run --spec "cypress/e2e/login-debug.cy.js"

# Run tests in headed mode
npx cypress run --headed
```

## Test Data

The tests use the following real credentials:
- **Email**: `hasnaenadil@gmail.com`
- **Password**: `adil@101`

For registration tests, unique emails are generated using timestamps to avoid conflicts.

## API Endpoints Tested

The tests interact with these real API endpoints:

### Authentication Service
- `POST /user/v1/login` - User login
- `POST /user/v1/register` - User registration

### Data Service
- `GET /hospital/v1/all` - Get all hospitals (displayed by default)

## Troubleshooting

### Common Issues

1. **Timeout Errors**: If tests timeout, check that:
   - Your frontend is running on the correct port
   - Your backend is accessible
   - Network connectivity is stable
   - Firebase authentication is working

2. **Authentication Errors**: If login tests fail:
   - Verify the test credentials are still valid
   - Check if the backend authentication is working
   - Ensure Firebase configuration is correct
   - Run the debug test to see detailed logs

3. **API Errors**: If API calls fail:
   - Check the backend service status
   - Verify API endpoints are correct
   - Check network connectivity

### Debug Mode

To run tests in debug mode:

```bash
# Run with verbose logging
DEBUG=cypress:* npx cypress run

# Run debug test with detailed logging
npx cypress run --spec "cypress/e2e/login-debug.cy.js" --headed
```

## Key Features Tested

### Hospitals Page
- ✅ Loads all hospitals by default (no search required)
- ✅ Displays hospital cards with proper information
- ✅ Grid/Map view switching functionality
- ✅ Hospital count display
- ✅ Search form availability

### Login Page
- ✅ Real authentication with Firebase and backend
- ✅ Form validation
- ✅ Error handling
- ✅ Successful login redirect

### Registration Page
- ✅ Complete registration flow
- ✅ Form validation
- ✅ Duplicate email handling
- ✅ Successful registration redirect

## Best Practices

1. **Test Isolation**: Each test clears authentication state before running
2. **Realistic Data**: Tests use real API responses and realistic test data
3. **Error Handling**: Tests verify both success and error scenarios
4. **Timeouts**: Appropriate timeouts are set for real API calls (30 seconds for login)
5. **Retries**: Tests can retry on failure to handle flaky network conditions
6. **Debug Tests**: Use debug tests to troubleshoot authentication issues 