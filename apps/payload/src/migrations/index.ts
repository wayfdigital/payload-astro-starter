import * as migration_20260610_093439_init from './20260610_093439_init';
import * as migration_20260610_101642_site_settings from './20260610_101642_site_settings';

export const migrations = [
  {
    up: migration_20260610_093439_init.up,
    down: migration_20260610_093439_init.down,
    name: '20260610_093439_init',
  },
  {
    up: migration_20260610_101642_site_settings.up,
    down: migration_20260610_101642_site_settings.down,
    name: '20260610_101642_site_settings'
  },
];
