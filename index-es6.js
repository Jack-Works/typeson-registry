// This file is auto-generated from `build.js`
import Typeson from 'typeson';

// TYPES
import arraybuffer from './types/arraybuffer.js';
import blob from './types/blob.js';
import cloneable from './types/cloneable.js';
import dataview from './types/dataview.js';
import date from './types/date.js';
import error from './types/error.js';
import errors from './types/errors.js';
import file from './types/file.js';
import filelist from './types/filelist.js';
import imagebitmap from './types/imagebitmap.js';
import imagedata from './types/imagedata.js';
import infinity from './types/infinity.js';
import intlTypes from './types/intl-types.js';
import map from './types/map.js';
import nan from './types/nan.js';
import negativeInfinity from './types/negative-infinity.js';
import nonbuiltinIgnore from './types/nonbuiltin-ignore.js';
import primitiveObjects from './types/primitive-objects.js';
import regexp from './types/regexp.js';
import resurrectable from './types/resurrectable.js';
import set from './types/set.js';
import typedArraysSocketio from './types/typed-arrays-socketio.js';
import typedArrays from './types/typed-arrays.js';
import undef from './types/undef.js';
import userObject from './types/user-object.js';

// PRESETS
import builtin from './presets/builtin.js';
import postMessage from './presets/post-message.js';
import socketio from './presets/socketio.js';
import sparseUndefined from './presets/sparse-undefined.js';
import specialNumbers from './presets/special-numbers.js';
import structuredCloningThrowing from './presets/structured-cloning-throwing.js';
import structuredCloning from './presets/structured-cloning.js';
import undef2 from './presets/undef.js';
import universal from './presets/universal.js';

Typeson.types = {
    arraybuffer, blob, cloneable, dataview, date, error, errors, file, filelist,
    imagebitmap, imagedata, infinity, intlTypes, map, nan, negativeInfinity,
    nonbuiltinIgnore, primitiveObjects, regexp, resurrectable, set,
    typedArraysSocketio, typedArrays, undef, userObject
};
Typeson.presets = {
    builtin, postMessage, socketio, sparseUndefined, specialNumbers,
    structuredCloningThrowing, structuredCloning, undef: undef2, universal
};
export default Typeson;
