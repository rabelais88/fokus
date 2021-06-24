beforeEach(() => {
  cy.changeLang();
});

it('options.html should load properly', () => {
  cy.visit('/options.html');
  cy.findByRole('logo').should('exist');
  cy.findByRole('tablist').should('exist');
  cy.findByRole('tab', { name: 'tasks', selected: true }).should('exist');
});

it('websites tab should be accessible', () => {
  cy.visit('/options.html');
  cy.findByRole('tab', { name: 'websites' }).click();
  cy.findByRole('textbox', { timeout: 3000 }).should('exist');
});

it('donation tab should be accessible', () => {
  cy.visit('/options.html');
  cy.findByRole('tab', { name: 'donate' }).click();
  cy.findByText(/patreon/, { timeout: 3000 });
});
