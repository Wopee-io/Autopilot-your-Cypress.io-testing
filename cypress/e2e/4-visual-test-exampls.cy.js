/// <reference types="cypress" />
/// <reference types='@wopee-io/wopee.cy' />


const baseUrl = "https://b2b.kvelektro.cz/registrace";

before(() => {
  cy.wopeeStartSuite('cy-suite-030424/3');
});

describe("Wopee visual testing benefits", () => {
  it.skip("Long list of asserts", () => {
    cy.visit(baseUrl);
    cy.get("button").contains("Odeslat registraci").click();

    // Validate mandatory fields
    cy.get("#taxId").should("have.class", "input-validation-error");
    cy.get("#vatId").should("have.class", "input-validation-error");
    cy.get("#companyName").should("have.class", "input-validation-error");
    cy.get("#street").should("have.class", "input-validation-error");
    cy.get("#zip").should("have.class", "input-validation-error");
    cy.get("#city").should("have.class", "input-validation-error");
    cy.get("#firstName").should("have.class", "input-validation-error");
    cy.get("#lastName").should("have.class", "input-validation-error");
    cy.get("#phone").should("have.class", "input-validation-error");
    cy.get("#email").should("have.class", "input-validation-error");

    cy.get("#select-3-input").should("have.class", "input-validation-error");
    cy.get("#select-4-input").should("have.class", "input-validation-error");
  });

  it("Autonomous assert", () => {
    cy.visit(baseUrl);
    cy.get("button").contains("Odeslat registraci").click();

    // Validate mandatory fields
    cy.wopeeTrack("Check mandatory fields");
  });
});
