describe("Learning Resouce Test", () => {
  it("Navigate to learning resources", () => {
    cy.get(".MuiDrawer-root")
      .get(".MuiList-root")
      .get(".MuiButtonBase-root")
      .eq(4)
      .click();
    cy.get(".MuiCollapse-wrapper").within(() => {
      cy.get(".MuiButtonBase-root").eq(1).click();
    });
    cy.get("h1").contains("PHFE2001");
  });

  it("Check learning resources", () => {
    cy.get(".MuiDrawer-root")
      .get(".MuiList-root")
      .get(".MuiButtonBase-root")
      .eq(4)
      .click();
    cy.get(".MuiCollapse-wrapper").within(() => {
      cy.get(".MuiButtonBase-root").eq(1).click();
    });

    cy.get(".MuiAppBar-root").get(".MuiTab-wrapper").eq(1).click();
    cy.get("[data-cy=folder-node]").click();
    cy.get(".MuiBreadcrumbs-ol")
      .contains("/")
      .eq(0)
      .get("li")
      .first()
      .click()
      .should("not.contain", "/");
    cy.get(".MuiBreadcrumbs-ol").should("not.contain", "/");
  });
});
