type MfaData = {
    secret: string; 
    attempts: number; 
  };
  
  const globalForMfa = globalThis as unknown as {
    mfaStore?: Record<string, MfaData>;
  };
  
  export const mfaStore =
    globalForMfa.mfaStore || (globalForMfa.mfaStore = {});
  