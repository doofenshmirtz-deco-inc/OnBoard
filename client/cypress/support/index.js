beforeEach(() => {
  indexedDB.deleteDatabase("firebaseLocalStorageDb");
  cy.visit("http://localhost:3000/");
  cy.get("[data-cy=username-field]").type("doof");
  cy.get("[data-cy=login-button]").click();
});
