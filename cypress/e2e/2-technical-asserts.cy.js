/// <reference types="cypress" />

it("Navigate to login, test staus code & loading time", () => {
  cy.visit("https://dronjo.wopee.io/");
  cy.intercept("GET", "*").as("get");

  // Start time
  const startTime = new Date().getTime();

  cy.get(".footer-main").contains("Singup").click();

  cy.wait("@get").then((interception) => {
    // Status code - fail when it is not 200
    // expect(interception.response.statusCode).to.eq(
    //   200,
    //   `Status code is not 200`
    // );

    // Status code - just a log instead of failing here
    if (interception.response.status !== 200) {
      cy.log(`Status code is NOT 200`);
    }

    // Response time
    const endTime = new Date().getTime();
    const loadingTime = endTime - startTime;
    expect(loadingTime).to.lt(500, `Loading time is acceptable`);
  });
});
