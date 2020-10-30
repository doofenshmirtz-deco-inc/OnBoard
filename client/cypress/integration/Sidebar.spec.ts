describe("Sidebar Test", () => {
  it("Checks the sidebar elements", () => {
    cy.get(".MuiDrawer-root")
      .get(".MuiList-root")
      .within(() => {
        cy.get(".MuiListItemIcon-root").its("length").should("be.eq", 5);
      });
  });

  it("Toggle sidebar", () => {
    cy.get(".MuiDrawer-root")
      .get(".MuiToolbar-root")
      .get("button")
      .first()
      .click();
    cy.get(".MuiDrawer-root")
      .get(".MuiList-root")
      .get(".MuiListItemText-root")
      .first()
      .contains("Home");
  });

  it("Log out", () => {
    cy.get(".MuiDrawer-root")
      .get(".MuiList-root")
      .get(".MuiListItemIcon-root")
      .last()
      .click();
    cy.get(".MuiButton-root")
      .contains("OK")
      .click()
      .wait(500);
    cy.get("h1").contains("Welcome");
  });
});
