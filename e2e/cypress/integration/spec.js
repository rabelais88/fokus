it('accessing options.html', () => {
  cy.visit('/options.html');
  cy.findByRole('logo').should('exist');
});
