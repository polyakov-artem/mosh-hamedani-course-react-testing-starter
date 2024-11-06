export type getter = () => HTMLElement[] | HTMLElement;

export const assertExistance = (...getters: Array<getter>) => {
  if (getters.length === 0) throw new Error("Should pass at least one getter");

  const elements = {} as Record<string, HTMLElement[] | HTMLElement>;

  getters.forEach((getter) => {
    if (!/^get\w/.test(getter.name)) {
      throw new Error("Getter function name should start with 'get'");
    }

    const name = getter.name.replace(/^get(\w)/, (_, firstLetter) => {
      return firstLetter.toLowerCase();
    });

    elements[name] = getter();
    expect(elements[name]).toBeInTheDocument();
  });

  return elements;
};

export const assertAbsence = (...getters: Array<getter>) => {
  if (getters.length === 0) throw new Error("Should pass at least one getter");

  getters.forEach((getter) => expect(getter).toThrow());
};

export const toRegExp = (text: string, flags: string = "i") =>
  new RegExp(text, flags);

export const delay = (time?: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("resolved");
    }, time);
  });
};
