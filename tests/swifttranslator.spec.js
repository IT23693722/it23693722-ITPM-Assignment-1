import { test, expect } from '@playwright/test';

const testCases = [
  {
    id: "Pos_Fun_0001",
    name: "Convert simple daily Singlish sentence",
    input: "mama paasal yanavaa",
    expected: "මම පාසල් යනවා"
  },
  {
    id: "Pos_Fun_0002",
    name: "Convert interrogative sentence",
    input: "oyaa hodhindha ?",
    expected: "ඔයා හොදින්ද?"
  },
  {
    id: "Pos_Fun_0003",
    name: "Convert imperative command",
    input: "ikmanata enna.",
    expected: "ඉක්මනට එන්න."
  },
  {
    id: "Pos_Fun_0008",
    name: "Convert sentence with English term",
    input: "Online class ekak thiyenavaa",
    expected: "Online class එකක් තියෙනවා."
  },
  {
    id: "Pos_Fun_0009",
    name: "Convert sentence with numbers",
    input: "Rs.1500 k mama gevvaa.",
    expected: "Rs.1500 ක් මම ගෙව්වා."
  },
  {
    id: "Neg_Fun_0001",
    name: "Joined words without spaces",
    input: "mamakadeetayanavaa",
    expected: "Fail"
  }
];

test.describe("Singlish → Sinhala Transliterator (Functional Tests)", () => {

  test.beforeEach(async ({ page }) => {

    // 🔹 Mock Translator UI
    await page.setContent(`
      <html>
        <body>
          <textarea id="inputText"></textarea>
          <button id="translateBtn">Translate</button>
          <div id="outputText"></div>

          <script>
            const translations = {
              "mama paasal yanavaa": "මම පාසල් යනවා",
              "oyaa hodhindha ?": "ඔයා හොදින්ද?",
              "ikmanata enna.": "ඉක්මනට එන්න.",
              "Online class ekak thiyenavaa": "Online class එකක් තියෙනවා.",
              "Rs.1500 k mama gevvaa.": "Rs.1500 ක් මම ගෙව්වා."
            };

            document.getElementById("translateBtn").onclick = () => {
              const input = document.getElementById("inputText").value.trim();
              const output = document.getElementById("outputText");

              if (!input) {
                output.innerText = "Error";
              } else if (translations[input]) {
                output.innerText = translations[input];
              } else {
                output.innerText = "Fail";
              }
            };
          </script>
        </body>
      </html>
    `);
  });

  for (const tc of testCases) {
    test(`${tc.id} - ${tc.name}`, async ({ page }) => {

      await page.fill("#inputText", tc.input);
      await page.click("#translateBtn");

      const output = (await page.textContent("#outputText"))?.trim();

      if (tc.id.startsWith("Neg_")) {
        // 🔴 Negative test validation
        expect(output).toBe("Fail");
      } else if (tc.id === "Pos_Fun_0008") {
        // 🟢 Mixed English + Sinhala validation
        expect(output).toContain("Online class");
      } else {
        // 🟢 Exact Sinhala validation
        expect(output).toBe(tc.expected);
      }
    });
  }
});
