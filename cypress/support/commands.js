// Wopee.io - Cypress.io integration
import { addWopeeCommands } from "@wopee-io/wopee.cy";
addWopeeCommands();

import OpenAI from "openai";

const model = "gpt-3.5-turbo"; // latest gpt 3.5
// const model = "gpt-4-turbo-preview"; // latest gpt 4
// const model = "gpt-4o";

const openai = new OpenAI({
  apiKey: Cypress.env("openAIAPIKey"),
  dangerouslyAllowBrowser: true,
});

Cypress.Commands.add("wopeeAction", (action) => {
  cy.log("Action:", action);

  const templateFile = "steps.txt";

  cy.document().then((doc) => {
    const html = doc.documentElement.innerHTML;

    cy.readFile(`cypress/fixtures/prompts/${templateFile}`).then(
      (templateContent) => {
        const prompt = buildPrompt(templateContent, { html, action });
        cy.chatWithAI(prompt).then((response) => {
          const steps = getSteps(response || "");
          interactWithSteps(steps);
        });
      }
    );
  });
});

Cypress.Commands.add("wopeeFillForm", () => {
  cy.log("Action: Fill form");

  const templateFile = "fill-form.txt";

  cy.document().then((doc) => {
    const html = doc.documentElement.innerHTML;

    cy.readFile(`cypress/fixtures/prompts/${templateFile}`).then(
      (templateContent) => {
        const prompt = buildPrompt(templateContent, { html });

        cy.chatWithAI(prompt).then((response) => {
          const steps = getSteps(response || "");
          interactWithSteps(steps);
        });
      }
    );
  });
});

Cypress.Commands.addAll({
  wopeeGiven(step) {
    BDDStepWithAI(step, "Given");
  },
  wopeeWhen(step) {
    BDDStepWithAI(step, "When");
  },
  wopeeThen(step) {
    BDDStepWithAI(step, "Then");
  },
  wopeeAnd(step) {
    BDDStepWithAI(step, "And");
  },
});

Cypress.Commands.add("chatWithAI", (message) => {
  cy.wrap(
    openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model,
      response_format: { type: "json_object" },
    }),
    { timeout: 20000 }
  )
    .its("choices.0.message.content")
    .then((content) => {
      return content;
    });
});

function BDDStepWithAI(step, stepType) {
  cy.log("BDD Step:", stepType, step);

  const templateFile = "bdd.txt";

  cy.document().then((doc) => {
    const html = doc.documentElement.innerHTML;

    cy.readFile(`cypress/fixtures/prompts/${templateFile}`).then(
      (templateContent) => {
        const prompt = buildPrompt(templateContent, { html, step, stepType });

        cy.chatWithAI(prompt).then((response) => {
          const steps = getSteps(response || "");
          interactWithSteps(steps);
        });
      }
    );
  });
}

function interactWithSteps(steps) {
  if (!steps) return;

  steps.forEach((step) => {
    if (step.action === "visit") {
      // failOnStatusCode to ignore the status code check
      cy.visit(step.value, { failOnStatusCode: false });
    } else if (step.action === "click") {
      cy.get(step.locator).first().click();
    } else if (step.action === "fill") {
      cy.get(step.locator).first().type(step.value);
    } else {
      // TODO: Implement other actions & assertions
      cy.log("Invalid action");
    }
  });
}

function getSteps(response) {
  cy.log(response);
  return JSON.parse(response || "").actions?.map((stepData) => ({
    step: stepData.step,
    locator: stepData.locator,
    value: stepData.value,
    action: stepData.action,
  }));
}

function buildPrompt(templateContent, data) {
  return templateContent.replace(/{{\s*(\w+)\s*}}/g, (match, placeholder) => {
    return data[placeholder] || match;
  });
}
