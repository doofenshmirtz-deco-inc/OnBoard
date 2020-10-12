beforeEach(() => {
  indexedDB.deleteDatabase("firebaseLocalStorageDb");
  cy.visit("/");
  cy.get("[data-cy=username-field]").type("doof");
  cy.get("[data-cy=login-button]").click();
});
