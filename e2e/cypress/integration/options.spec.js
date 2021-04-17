// it('examples', () => {
//   cy.findByRole('button', { name: /Jackie Chan/i }).click();
//   cy.findByRole('button', { name: /Button Text/i }).should('exist');
//   cy.findByRole('button', { name: /Non-existing Button Text/i }).should(
//     'not.exist'
//   );
//   cy.findByLabelText(/Label text/i, { timeout: 7000 }).should('exist');

//   // findAllByText _inside_ a form element
//   cy.get('form')
//     .findByText('button', { name: /Button Text/i })
//     .should('exist');
//   cy.findByRole('dialog').within(() => {
//     cy.findByRole('button', { name: /confirm/i });
//   });
// });

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
