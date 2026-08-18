import { initArchive } from './archive.js';
import { initDialogs } from './dialogs.js';
import { initForms } from './forms.js';
import { initNavigation } from './navigation.js';
import { initPresentation } from './presentation.js';
import { initProgramFilters } from './programs.js';
import { initSearch } from './search.js';
import { initWorld } from './world.js';

initWorld();
initPresentation();
const navigation = initNavigation();
initProgramFilters();
initDialogs();
initSearch(navigation);
initForms();
initArchive();
