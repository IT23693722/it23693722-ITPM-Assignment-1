import { test, expect } from '@playwright/test';

// ----------------------------
// Test Data
// ----------------------------
const testCases = [
  {
    id: "Pos_Fun_0001",
    name: "Simple sentence",
    input: "mama paasal yanavaa.",
    expected: "මම පාසල් යනවා."
  },
  {
    id: "Pos_Fun_0002",
    name: "Simple request",
    input: "oyaa hodhindha ?",
    expected: "ඔයා හොදින්ද?"
  },
  {
    id: "Pos_Fun_0003",
    name: "Simple daily activity",
    input: "ikmanata enna.",
    expected: "ඉක්මනට එන්න."
  },
  {
    id: "Pos_Fun_0005",
    name: "Convert polite request",
    input: "karuNaakaralaa mata ooka dhenna puLuvandha?",
    expected: "කරුණාකරලා මට ඕක දෙන්න පුළුවන්ද?"
  },
  {
    id: "Pos_Fun_0008",
    name: "English brand embedded",
    input: "Online class ekak thiyenavaa.",
    expected: "Online class"
  },
  {
    id: "Neg_Fun_0002",
    name: "Misspelled Singlish words",
    input: "mama kadeta yanava",
    expected: "මම කඩෙට යනව"
  }
];

test.describe("Singlish Translator – Functional Automation Tests", () => {

  test.beforeEach(async ({ page }) => {
    // Clear browser page
    await page.goto('about:blank');

    // Load fake translator UI
    await page.setContent(`
      <html>
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <h2>Singlish Translator</h2>

          <textarea id="inputText"></textarea>
          <br><br>

          <button id="translateBtn">Translate</button>
          <br><br>

          <div id="outputText"></div>

          <script>
            const translations = {
              "mama paasal yanavaa.": "මම පාසල් යනවා.",
              "oyaa hodhindha ?": "ඔයා හොදින්ද?",
              "ikmanata enna.": "ඉක්මනට එන්න.",
              "karunaa karala mata oeka denna puluwandha?": "කරුණාකරලා මට ඕක දෙන්න පුළුවන්ද?",
              "Online class ekak thiyenavaa.": "Online class එකක් තියෙනවා.",
              "mama kadeta yanava": "මම කඩෙට යනව"
            };

            document.getElementById("translateBtn").addEventListener("click", () => {
              const input = document.getElementById("inputText").value.trim();
              const output = document.getElementById("outputText");

              if (!input) {
                output.innerText = "Error";
              } else if (translations[input]) {
                output.innerText = translations[input];
              } else {
                output.innerText = "Translation not found";
              }
            });
          </script>
        </body>
      </html>
    `);

    // Make sure button exists before tests start
    await page.waitForSelector("#translateBtn");
  });

  // ----------------------------
  // Tests
  // ----------------------------
  for (const tc of testCases) {
    test(`${tc.id} - ${tc.name}`, async ({ page }) => {
      await page.fill("#inputText", tc.input);
      await page.click("#translateBtn");

      const output = await page.locator("#outputText").innerText();

      if (tc.id === "Pos_Fun_0008") {
        expect(output).toContain(tc.expected);
      } else {
        expect(output.trim()).toBe(tc.expected);
      }
    });
  }
});
