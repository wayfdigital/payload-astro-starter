import * as migration_20260608_103218_initial from './20260608_103218_initial';
import * as migration_20260609_093158_preview_drafts from './20260609_093158_preview_drafts';
import * as migration_20260609_130000_add_is_home_page from './20260609_130000_add_is_home_page';

export const migrations = [
  {
    up: migration_20260608_103218_initial.up,
    down: migration_20260608_103218_initial.down,
    name: '20260608_103218_initial',
  },
  {
    up: migration_20260609_093158_preview_drafts.up,
    down: migration_20260609_093158_preview_drafts.down,
    name: '20260609_093158_preview_drafts'
  },
  {
    up: migration_20260609_130000_add_is_home_page.up,
    down: migration_20260609_130000_add_is_home_page.down,
    name: '20260609_130000_add_is_home_page'
  },
];
