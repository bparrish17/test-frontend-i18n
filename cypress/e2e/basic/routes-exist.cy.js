const routeList = [
  { path: 'login' },
  { path: '', name: 'feed' },
  // routes with this format need an ID to be passed
  { path: 'focuses' },
  { path: 'focuses/#', name: 'focus' },
  { path: 'settings' },
  { path: 'meeting/#', name: 'meeting' },
  { path: 'insights/#', name: 'insight' }
];

const BASE_APP_URL = Cypress.env('BASE_APP_URL');

describe('Check Routes Load', () => {
  beforeEach(() => {
    cy.setFakeSession();
  });
  routeList.forEach(({ path, name }) => {
    const replacedRoute = path.includes('/#') ? path.replace('/#', '/1') : path;
    path = path.replace('/#', '');

    it(`Route ${name ?? path} loads`, () => {
      cy.viewport(1260, 1000);
      cy.visit(`${BASE_APP_URL}/${replacedRoute}`);
      cy.get(`[data-cy="${name ?? path}-page"]`).should('be.visible');
    });
  });

  it('Route /logout redirects', () => {
    cy.viewport(1260, 1000);
    cy.visit(`${BASE_APP_URL}/logout`);
    cy.location('pathname').should('include', 'login');
  });
});
