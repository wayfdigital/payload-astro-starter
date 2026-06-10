import * as migration_20260610_093439_init from './20260610_093439_init';

export const migrations = [
  {
    up: migration_20260610_093439_init.up,
    down: migration_20260610_093439_init.down,
    name: '20260610_093439_init'
  },
];
