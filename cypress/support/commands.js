import 'cypress-localstorage-commands';

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', () => {
  const BASE_API_URL = Cypress.env('BASE_API_URL');
  const email = Cypress.env('TEST_EMAIL');
  const password = Cypress.env('TEST_PASSWORD');
  cy.request({
    method: 'POST',
    url: `${BASE_API_URL}/people/authenticate`,
    body: {
      email,
      password,
      rememberMe: true
    }
  }).then((response) => {
    cy.setLocalStorage('session', response.body);
    cy.setLocalStorage('sessionID', response.body.id);
  });
});

// for tests not requiring an api call
Cypress.Commands.add('setFakeSession', () => {
  cy.setLocalStorage('session', {
    person: {},
    expiresAt: new Date().setFullYear(2030)
  });
  cy.setLocalStorage('sessionID', 12345);
});

// for tests not requiring an api call
Cypress.Commands.add('clearSession', () => {
  cy.setLocalStorage('session', {
    person: {},
    expiresAt: new Date().setFullYear(2030)
  });
  cy.setLocalStorage('sessionID', 12345);
});
