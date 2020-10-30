describe("Messaging Test", () => {
  it("Navigate to Message", () => {
    cy.get(".MuiDrawer-root")
      .get(".MuiList-root")
      .get(".MuiButtonBase-root")
      .eq(5)
      .click();
    cy.get("h1").contains("Study Rooms");
  });

  it("Navigate to Message", () => {
    cy.get(".MuiDrawer-root")
      .get(".MuiList-root")
      .get(".MuiButtonBase-root")
      .eq(5)
      .click();
    cy.get("#message-send").type("Hi, this is a test!");
    cy.get("[data-cy=message-send]").click();
    cy.get("[data-cy=message]").last().contains("Hi, this is a test!");
  });
});
