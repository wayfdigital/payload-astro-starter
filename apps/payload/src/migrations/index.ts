import * as migration_20260610_093439_init from './20260610_093439_init';
import * as migration_20260610_101642_site_settings from './20260610_101642_site_settings';
import * as migration_20260610_134054_links_jobs from './20260610_134054_links_jobs';
import * as migration_20260610_134150_unify_cms_links from './20260610_134150_unify_cms_links';

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
    up: migration_20260610_134054_links_jobs.up,
    down: migration_20260610_134054_links_jobs.down,
    name: '20260610_134054_links_jobs',
  },
  {
    up: migration_20260610_134150_unify_cms_links.up,
    down: migration_20260610_134150_unify_cms_links.down,
    name: '20260610_134150_unify_cms_links'
  },
];
