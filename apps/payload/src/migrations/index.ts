import * as migration_20260610_093439_init from './20260610_093439_init';
import * as migration_20260610_101642_site_settings from './20260610_101642_site_settings';
import * as migration_20260610_130708_init_jobs_queue from './20260610_130708_init_jobs_queue';

export const migrations = [
  {
    up: migration_20260610_093439_init.up,
    down: migration_20260610_093439_init.down,
    name: '20260610_093439_init',
  },
  {
    up: migration_20260610_101642_site_settings.up,
    down: migration_20260610_101642_site_settings.down,
    name: '20260610_101642_site_settings',
  },
  {
    up: migration_20260610_130708_init_jobs_queue.up,
    down: migration_20260610_130708_init_jobs_queue.down,
    name: '20260610_130708_init_jobs_queue'
  },
];
