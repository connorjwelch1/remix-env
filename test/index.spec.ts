import { createRemixEnv } from '../src';
import { z } from 'zod';

describe('createRemixEnv', () => {
  describe('setEnv', () => {
    it('should set parsed environment on server', () => {
      const { setEnv, getServerEnvVar } = createRemixEnv({
        schema: z.object({
          apiUrl: z.string().url(),
          secret: z.string(),
        }),
        clientExclude: ['secret'],
      });

      process.env.apiUrl = 'https://www.someurl.com';
      process.env.secret = 'TEST_SECRET';

      setEnv();

      expect(global.ENV).toEqual({
        apiUrl: 'https://www.someurl.com',
        secret: 'TEST_SECRET',
      });

      expect(getServerEnvVar('secret')).toEqual('TEST_SECRET');
    });
  });
});
