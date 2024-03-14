export const mapCurrentPageFromPathName = (pathName: string): string | null => {
  const paths: Record<string, string | null> = { '/': null, '/settings': 'settings' };

  return paths[pathName ?? 0]?.length != null ? paths[pathName] : null;
}
