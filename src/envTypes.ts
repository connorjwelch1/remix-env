import { z } from 'zod';

declare global {
  // eslint-disable-next-line no-var
  var ENV: Record<string, unknown>;
  interface Window {
    ENV: Record<string, unknown>;
  }
}

export type KeyArray<Base> = (keyof Base)[];

export type EnvLoader<ClientEnv> = () => { env: ClientEnv };
export type VarGetter<Env, Key extends keyof Env = keyof Env> = (
  key: Key
) => Env[Key];

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
  getServerEnvVar: VarGetter<ServerEnv>;
  getClientEnvVar: VarGetter<ClientEnv>;
  envLoader: EnvLoader<ClientEnv>;
  EnvironmentVars: () => JSX.Element;
}
