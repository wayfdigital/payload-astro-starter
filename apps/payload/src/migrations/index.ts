import * as migration_20260608_103218_initial from './20260608_103218_initial';

export const migrations = [
  {
    up: migration_20260608_103218_initial.up,
    down: migration_20260608_103218_initial.down,
    name: '20260608_103218_initial'
  },
];
