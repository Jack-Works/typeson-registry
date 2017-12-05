export default [
    {
        sparseArrays: {
            testPlainObjects: true,
            test (x) { return Array.isArray(x); },
            replace (a, stateObj) {
                stateObj.iterateUnsetNumeric = true;
                return a;
            }
        }
    },
    {
        sparseUndefined: {
            test (x, stateObj) {
                return typeof x === 'undefined' && stateObj.ownKeys === false;
            },
            replace (n) { return null; },
            revive (s) { return undefined; } // Will avoid adding anything
        }
    }
];
