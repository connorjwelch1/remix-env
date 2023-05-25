import React from 'react';
import { CreateRemixEnvArgs, KeyArray, RemixEnv } from './envTypes';
import { useRouteLoaderData } from '@remix-run/react';

export const createRemixEnv = <
  ServerEnv extends Record<string, unknown>,
  ClientExclude extends KeyArray<ServerEnv>
>({
  schema,
  clientExclude,
}: CreateRemixEnvArgs<ServerEnv, ClientExclude>): RemixEnv<
  ServerEnv,
  ClientExclude
> => {
  type ClientEnv = Omit<ServerEnv, ClientExclude[number]>;
  const getClientEnv = () => window.ENV as ClientEnv;
  const getServerEnv = () => global.ENV as ServerEnv;
  return {
    getEnv: () => {
      if (typeof window === 'undefined') {
        return getServerEnv();
      }
      return getClientEnv();
    },
    setEnv: () => {
      global.ENV = schema.parse(process.env);
    },
    getClientEnvVar: key => {
      return getClientEnv()[key];
    },
    getServerEnvVar: key => {
      return getServerEnv()[key];
    },
    envLoader: () => {
      const serverEnv = getServerEnv();
      const clientEnv = Object.entries(serverEnv).reduce((prev, [key, val]) => {
        if (clientExclude?.includes(key)) {
          return prev;
        }
        return {
          ...prev,
          [key]: val,
        };
      }, {} as ClientEnv);
      return {
        env: clientEnv,
      };
    },
    EnvironmentVars: () => {
      const { env } = useRouteLoaderData('root') as { env: ClientEnv };
      return (
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(env)}`,
          }}
        />
      );
    },
  };
};
