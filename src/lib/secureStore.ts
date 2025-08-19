type SecureWordValue = { secureWord: string; expiresAt: number };

declare global {
  var secureWordStore: Record<string, SecureWordValue> | undefined;
}

export const secureWordStore: Record<string, SecureWordValue> =
  globalThis.secureWordStore || (globalThis.secureWordStore = {});