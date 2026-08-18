import { initArchive } from './archive';
import { initDialogs } from './dialogs';
import { initForms } from './forms';
import { initNavigation } from './navigation';
import { initPresentation } from './presentation';
import { initProgramFilters } from './programs';
import { initSearch } from './search';
import { initWorld } from './world';

initWorld();
initPresentation();
const navigation = initNavigation();
initProgramFilters();
initDialogs();
initSearch(navigation);
initForms();
initArchive();
document.documentElement.classList.add('app-ready');
