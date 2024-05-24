/// <reference types="cypress" />

it("Check out - simple assert example", () => {
  cy.visit("https://dronjo.wopee.io/");
  cy.get(".btn-main-md").contains("Buy Now").click();

  cy.fixture("cards").then((cards) => {
    cy.get("#cardNumberFirstFour").type(cards.validCard.first);
    cy.get("#cardNumberSecondFour").type(cards.validCard.second);
    cy.get("#cardNumberThirdFour").type(cards.validCard.third);
    cy.get("#cardNumberLastFour").type(cards.validCard.last);

    cy.get("#cardHolderName").type(cards.validCard.name);

    cy.get("#expirationDate").type(cards.validCard.expDate);
    cy.get("#cvc").type(cards.validCard.cvc);
  });

  cy.get("button").contains("Purchase").click();

  cy.get(".confirmation").should("contain", "Thank you for your order!");
});
