export {};

declare global {
  var mfaSecrets: Record<string, string> | undefined;
}