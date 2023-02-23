const axios = require("axios");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const { faker } = require("@faker-js/faker");

const testingURL = "https://www.stanleyblackanddecker.com";

console.log(`\n\n🤖 SBD.COM BOT TRAFFIC TESTING TOOL v0! 🤖\n\n`);

const fetchData = async (url) => {
  console.log(`Connecting to ${url}!\n`);
  let response = await axios(url).catch((err) => console.log(err));
  if (response.status !== 200) {
    console.log(`Error occured!`);
    return;
  }
  return response;
};

const postData = async (postURL, data) => {
  let response = await axios
    .post(postURL, data)
    .catch((err) => console.log(err));
  if (response.status !== 200) {
    console.log(`Error ocurred!`);
    return;
  }
  return response;
};

const generateTestData = () => {
  return {
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
    emailaddress: faker.internet.email(),
    country_of_residence: faker.address.countryCode(),
    years_of_work_experience: true,
    op: "Sign Up",
  };
};

const runBrowserTest = async (testingURL, dummyData) => {
  console.log(
    `\nAttempting to submit the form!\n Loading URL: "${testingURL}" in something more powerful!\n`
  );
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
  });

  const page = await browser.newPage();
  await page.goto(testingURL);

  // Accept Cookie
  await page.waitForSelector("#onetrust-accept-btn-handler");
  await page.click("#onetrust-accept-btn-handler");
  console.log(`\nClicked on the OneTrust Cookie Banner!`);

  // Click on Newsletter Button
  await page.waitForSelector(
    '[data-target="#media--modal-footer-newsletter-signup"]'
  );
  await page.click('[data-target="#media--modal-footer-newsletter-signup"]');
  console.log(
    `\nOpened the newsletter webform! Attempting to fill it now with dummy data: ${dummyData.firstname} ${dummyData.lastname} from ${dummyData.country_of_residence} with fake email: ${dummyData.emailaddress}`
  );

  await page.waitForSelector("form.webform-submission-newsletter-signup-form");

  // Update firstname
  await page.focus("input[name='firstname']");
  await page.type("input[name='firstname']", dummyData.firstname, {
    delay: 100,
  });
  await page.focus("input[name='firstname']");
  await page.type("input[name='firstname']", dummyData.firstname, {
    delay: 100,
  });

  // Update lastname
  await page.focus("input[name='lastname']");
  await page.type("input[name='lastname']", dummyData.lastname, { delay: 100 });

  // Update emailaddress
  await page.focus("input[name='emailaddress']");
  await page.type("input[name='emailaddress']", dummyData.emailaddress, {
    delay: 100,
  });

  // Update CoR
  await page.select("select[name='country_of_residence']", "UnitedStates");

  console.log(`\nAttempting to submit the webform!`);

  // Submit Form
  const submitted = await page.$eval(
    "form.webform-submission-newsletter-signup-form",
    (form) => form.submit()
  );

  console.log(`\n 🟨 I (🤖) was able to submit the webform!!`);

  // await browser.close();
};

fetchData(testingURL).then(async (res) => {
  // Get the HTML
  const html = res.data;
  console.log(`Starting crawl...\n`);
  console.log(
    `HTML Crawled & Loaded! Should I (🤖) be able to be here and do this?\n`
  );
  const $ = cheerio.load(html);
  const newsletterSubscriptionForm = $(
    "form.webform-submission-newsletter-signup-form"
  );
  const webformSubmitButton = $('input[type="submit"]');
  const webformSubmitMethod = newsletterSubscriptionForm.attr("method");
  const webformSubmitActionURL = newsletterSubscriptionForm.attr("action");

  console.log(
    `🟨 Found the webform for Newsletter Subscriptions with METHOD: "${webformSubmitMethod}" and POST ACTION URL: "${webformSubmitActionURL}"!`
  );

  const dummyData = generateTestData();
  console.log(`\nGenerated the following dummy data!\n`, dummyData);

  console.log(
    `\nAttempting to POST request the action URL with a valid data payload!\n`
  );

  postData(webformSubmitActionURL, dummyData).then(async (res) => {
    if (res.status === 200) {
      console.log(
        `🟨 I (🤖) was able to POST request this resource ${webformSubmitActionURL}! Please protect this POST resource!\n`
      );
    } else {
      console.log(`🟩 I (🤖) was unable to complete the POST request! \n`);
    }

    const browserTestResults = await runBrowserTest(testingURL, dummyData);
  });
});
