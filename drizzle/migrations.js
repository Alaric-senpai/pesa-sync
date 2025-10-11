// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_little_reavers.sql';
import m0001 from './0001_eminent_champions.sql';
import m0002 from './0002_bent_rogue.sql';
import m0003 from './0003_luxuriant_violations.sql';
import m0004 from './0004_acoustic_sphinx.sql';
import m0005 from './0005_nifty_quicksilver.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004,
m0005
    }
  }
  