export type getter = () => HTMLElement[] | HTMLElement;

export const assertExistance = (...getters: Array<getter>) => {
  if (getters.length === 0) throw new Error("Should pass at least one getter");

  const elements = {} as Record<string, HTMLElement[] | HTMLElement>;

  getters.forEach((getter) => {
    elements[getter.name] = getter();
    expect(elements[getter.name]).toBeInTheDocument();
  });

  return elements;
};

export const assertAbsence = (...getters: Array<getter>) => {
  if (getters.length === 0) throw new Error("Should pass at least one getter");

  getters.forEach((getter) => expect(getter).toThrow());
};
