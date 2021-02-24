it('accessing options.html welcoming page', () => {
  cy.visit('/options.html');
  cy.findByRole('logo').should('exist');
  cy.findByRole('tablist').should('exist');
  cy.findByRole('tab', { name: 'tasks', selected: true }).should('exist');
});
