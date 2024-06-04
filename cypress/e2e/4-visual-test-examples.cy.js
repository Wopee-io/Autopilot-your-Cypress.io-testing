/// <reference types="cypress" />
/// <reference types='@wopee-io/wopee.cy' />

const baseUrl = "https://b2b.kvelektro.cz/registrace";

before(() => {
  cy.wopeeStartSuite("Wopee visual testing example");
});

describe("Wopee visual testing benefits", () => {
  it("Long list of asserts", () => {
    Cypress.on("uncaught:exception", (err, runnable) => {
      return false;
    });

    cy.visit(baseUrl);
    cy.get("button").contains("Odeslat registraci").click();

    const errorText = "Toto pole je povinné";
    // Validate mandatory fields
    cy.get("#taxId + div + span").should("contain.text", errorText);
    cy.get("#vatId + div + span").should("contain.text", errorText);
    cy.get("#companyName + div + span").should("contain.text", errorText);
    cy.get("#street + div + span").should("contain.text", errorText);
    cy.get("#zip + div + span").should("contain.text", errorText);
    cy.get("#City + div + span").should("contain.text", errorText);
    cy.get("#firstName + div + span").should("contain.text", errorText);
    cy.get("#lastName + div + span").should("contain.text", errorText);
    cy.get("#phone + div + span").should("contain.text", errorText);
    cy.get("#email + div + span").should("contain.text", errorText);

    // // These asserts will always fail as the id are generated dynamically
    // // ... of course, unless you improve locators ... or use AI to generate them
    // // Branch
    // cy.get(
    //   "#a78b0f0f-8519-43ce-8970-11366717caf1 ~ .css-rqtwkt + .css-184vw2j > span"
    // ).should("contain.text", errorText);
    // // Department
    // cy.get(
    //   "#b111f0a5-5c10-4c24-a5a6-c5dd29f4effa ~ .css-rqtwkt + .css-184vw2j span"
    // ).should("contain.text", errorText);
  });

  it("Autonomous assert", () => {
    cy.wopeeStartScenario("Autonomous assert");
    cy.visit(baseUrl);
    cy.get("button").contains("Odeslat registraci").click();

    // Validate mandatory fields
    cy.wopeeTrack("Check mandatory fields");
    cy.wopeeStopScenario();
  });
});
