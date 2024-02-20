export const subDays = (date: Date, days: number) => {
  return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
};

export const toTzDate = (d: Date): Date => {
  return new Date(
    d.toLocaleDateString("en-US", { timeZone: "America/Sao_Paulo" }),
  );
};
