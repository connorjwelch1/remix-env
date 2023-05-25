import { z } from 'zod';

declare global {
  // eslint-disable-next-line no-var
  var ENV: Record<string, unknown>;
  interface Window {
    ENV: Record<string, unknown>;
  }
}

export type KeyArray<Base> = (keyof Base)[];

export interface CreateRemixEnvArgs<Env, ClientExclude extends KeyArray<Env>> {
  schema: z.ZodSchema<Env>;
  clientExclude?: ClientExclude;
}

export interface RemixEnv<
  ServerEnv,
  ClientExclude extends (keyof ServerEnv)[],
  ClientEnv = Omit<ServerEnv, ClientExclude[number]>
> {
  getEnv: () => ServerEnv | ClientEnv;
  setEnv: () => void;
  getServerEnvVar: (key: keyof ServerEnv) => ServerEnv[keyof ServerEnv];
  getClientEnvVar: (key: keyof ClientEnv) => ClientEnv[keyof ClientEnv];
  envLoader: () => { env: ClientEnv };
  EnvironmentVars: () => JSX.Element;
}
