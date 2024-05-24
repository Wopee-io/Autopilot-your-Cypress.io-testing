/// <reference types="cypress" />

it("Crawls web page and validates status code 200", () => {
  const visited = new Set();
  const toVisit = [`${Cypress.config("baseUrl")}/`];
  const maxVisitedPages = 15;
  const urlsWithNon200Status = [];

  function crawlUrl() {
    if (toVisit.length === 0 || visited.size >= maxVisitedPages) {
      return;
    }

    const url = toVisit.shift();
    if (visited.has(url)) {
      return crawlUrl();
    }

    visited.add(url);

    // Check the page status before visiting
    cy.request({ url, failOnStatusCode: false }).then((response) => {
      if (response.status !== 200) {
        urlsWithNon200Status.push({ url, status: response.status });
      }

      cy.visit(url, { failOnStatusCode: false });
      findAndQueueLinks(url, visited, toVisit).then(crawlUrl);
    });
  }

  crawlUrl();
  returnTestResults(urlsWithNon200Status, visited);
});

function findAndQueueLinks(url, visited, toVisit) {
  return cy
    .get("a")
    .should(Cypress._.noop)
    .then(($links) => {
      const localUrls = $links
        .toArray()
        .map((link) => link.getAttribute("href"))
        .filter((href) => href !== null)
        .map((href) => {
          if (href.startsWith("/")) {
            return Cypress.config("baseUrl") + href;
          } else if (href.startsWith("#")) {
            return url.split("#")[0] + href;
          } else if (!href.startsWith("http")) {
            return Cypress.config("baseUrl") + "/" + href;
          } else {
            return href;
          }
        })
        .filter(
          (url) =>
            (url.startsWith(Cypress.config("baseUrl")) ||
              !url.startsWith("http")) &&
            !url.startsWith("//")
        )
        .filter((url) => !visited.has(url))
        .filter((url) => !toVisit.includes(url));

      cy.log(`found ${localUrls.length} new link(s) to visit`);
      toVisit.push(...localUrls);
    });
}

function returnTestResults(urlsWithNon200Status, visited) {
  cy.then(() => {
    cy.log(`Total URLs visited: ${visited.size}`);
    if (urlsWithNon200Status.length > 0) {
      cy.log(
        `Total URLs with non-200 status codes: ${urlsWithNon200Status.length}`
      );
      cy.log(`-----------------`);
      cy.log(`URLs with non-200 status codes:`);
      urlsWithNon200Status.forEach((item) => {
        cy.log(`${item.url}: ${item.status}`);
      });
      cy.log(`-----------------`);
    } else {
      cy.log(`All URLs returned status code 200.`);
    }
  });
}
