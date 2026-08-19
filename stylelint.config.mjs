/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-recommended'],
  rules: {
    'declaration-block-no-duplicate-properties': true,
    'font-family-no-duplicate-names': true,
    'function-calc-no-unspaced-operator': true,
    'no-duplicate-selectors': true,
    // Files are grouped by component responsibility, so cross-component selector order is intentional.
    'no-descending-specificity': null,
  },
};
