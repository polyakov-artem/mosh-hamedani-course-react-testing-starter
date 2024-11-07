import { render, screen } from "@testing-library/react";
import Label from "../../src/components/Label";
import { Language } from "../../src/providers/language/type";
import { LanguageProvider } from "../../src/providers/language/LanguageProvider";
import { Theme } from "@radix-ui/themes";
import enDictionary from "./../../src/providers/language/data/en.json";
import esDictionary from "./../../src/providers/language/data/es.json";
import { toRegExp } from "../../src/mocks/testUtils";

describe("Label", () => {
  describe("when different languages and labelId provide", () => {
    const testCases = [
      ...getTestCases("en", enDictionary),
      ...getTestCases("es", esDictionary),
    ];

    test.each(testCases)(
      "with labelId = $labelId and language = $language should render $translation",
      ({ labelId, translation, language }) => {
        renderLabel(labelId, language);
        expect(getText(toRegExp(translation))).toBeInTheDocument();
      }
    );
  });

  describe("when invalud labelId provided", () => {
    test("should throw an error", () => {
      expect(() => renderLabel("!")).toThrow();
    });
  });
});

const getTestCases = (
  language: Language,
  dictionary: Record<string, string>,
  numOfLabels = 5
) => {
  const labelids = Object.keys(dictionary);
  if (labelids.length === 0) {
    throw new Error("Dictionary should not be empty");
  }

  return labelids.slice(0, numOfLabels).map((labelId) => ({
    labelId,
    translation: dictionary[labelId],
    language,
  }));
};

const renderLabel = (
  labelId: string = "welcome",
  language: Language = "en"
) => {
  return render(
    <LanguageProvider language={language}>
      <Theme>
        <Label labelId={labelId} />,
      </Theme>
    </LanguageProvider>
  );
};

const getText = (text: RegExp) => screen.getByText(text);
