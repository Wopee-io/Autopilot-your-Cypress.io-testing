/// <reference types="cypress" />

// const baseUrl = "https://dronjo.wopee.io/";
const baseUrl = "https://www.saucedemo.com/";

describe("AI Interaction demo", () => {
  it("Natural language instead of locators", () => {
    cy.visit(baseUrl, { failOnStatusCode: false });
    cy.wopeeAction("Navigate to login page");
  });

  it("More complex example", () => {
    cy.visit(baseUrl);
    cy.wopeeAction("Navigate to login page");
    cy.wopeeFillForm();
  });

  it("BDD Copilot Demo", () => {
    cy.wopeeGiven(`I am on the homepage, at ${baseUrl}`);
    cy.wopeeWhen("Navigate to login screen");
    cy.wopeeThen("I should see the signup form");
  });
});
