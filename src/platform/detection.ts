export const deviceLocales = (): string[] => {
  const browserLocales = navigator.languages ?? [navigator.language];
  if (browserLocales === null) return [];

  return browserLocales.map(locale => {
    const trimmed = locale.trim();
    return trimmed.split(/-|_/)[0];
  });
}
