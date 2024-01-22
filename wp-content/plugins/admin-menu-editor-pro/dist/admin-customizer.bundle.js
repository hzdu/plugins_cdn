"use strict";
(self["wsAmeWebpackChunk"] = self["wsAmeWebpackChunk"] || []).push([["admin-customizer"],{

/***/ "./extras/zod/lib/index.js":
/*!*********************************!*\
  !*** ./extras/zod/lib/index.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BRAND": () => (/* binding */ BRAND),
/* harmony export */   "DIRTY": () => (/* binding */ DIRTY),
/* harmony export */   "EMPTY_PATH": () => (/* binding */ EMPTY_PATH),
/* harmony export */   "INVALID": () => (/* binding */ INVALID),
/* harmony export */   "NEVER": () => (/* binding */ NEVER),
/* harmony export */   "OK": () => (/* binding */ OK),
/* harmony export */   "ParseStatus": () => (/* binding */ ParseStatus),
/* harmony export */   "Schema": () => (/* binding */ ZodType),
/* harmony export */   "ZodAny": () => (/* binding */ ZodAny),
/* harmony export */   "ZodArray": () => (/* binding */ ZodArray),
/* harmony export */   "ZodBigInt": () => (/* binding */ ZodBigInt),
/* harmony export */   "ZodBoolean": () => (/* binding */ ZodBoolean),
/* harmony export */   "ZodBranded": () => (/* binding */ ZodBranded),
/* harmony export */   "ZodCatch": () => (/* binding */ ZodCatch),
/* harmony export */   "ZodDate": () => (/* binding */ ZodDate),
/* harmony export */   "ZodDefault": () => (/* binding */ ZodDefault),
/* harmony export */   "ZodDiscriminatedUnion": () => (/* binding */ ZodDiscriminatedUnion),
/* harmony export */   "ZodEffects": () => (/* binding */ ZodEffects),
/* harmony export */   "ZodEnum": () => (/* binding */ ZodEnum),
/* harmony export */   "ZodError": () => (/* binding */ ZodError),
/* harmony export */   "ZodFirstPartyTypeKind": () => (/* binding */ ZodFirstPartyTypeKind),
/* harmony export */   "ZodFunction": () => (/* binding */ ZodFunction),
/* harmony export */   "ZodIntersection": () => (/* binding */ ZodIntersection),
/* harmony export */   "ZodIssueCode": () => (/* binding */ ZodIssueCode),
/* harmony export */   "ZodLazy": () => (/* binding */ ZodLazy),
/* harmony export */   "ZodLiteral": () => (/* binding */ ZodLiteral),
/* harmony export */   "ZodMap": () => (/* binding */ ZodMap),
/* harmony export */   "ZodNaN": () => (/* binding */ ZodNaN),
/* harmony export */   "ZodNativeEnum": () => (/* binding */ ZodNativeEnum),
/* harmony export */   "ZodNever": () => (/* binding */ ZodNever),
/* harmony export */   "ZodNull": () => (/* binding */ ZodNull),
/* harmony export */   "ZodNullable": () => (/* binding */ ZodNullable),
/* harmony export */   "ZodNumber": () => (/* binding */ ZodNumber),
/* harmony export */   "ZodObject": () => (/* binding */ ZodObject),
/* harmony export */   "ZodOptional": () => (/* binding */ ZodOptional),
/* harmony export */   "ZodParsedType": () => (/* binding */ ZodParsedType),
/* harmony export */   "ZodPipeline": () => (/* binding */ ZodPipeline),
/* harmony export */   "ZodPromise": () => (/* binding */ ZodPromise),
/* harmony export */   "ZodRecord": () => (/* binding */ ZodRecord),
/* harmony export */   "ZodSchema": () => (/* binding */ ZodType),
/* harmony export */   "ZodSet": () => (/* binding */ ZodSet),
/* harmony export */   "ZodString": () => (/* binding */ ZodString),
/* harmony export */   "ZodSymbol": () => (/* binding */ ZodSymbol),
/* harmony export */   "ZodTransformer": () => (/* binding */ ZodEffects),
/* harmony export */   "ZodTuple": () => (/* binding */ ZodTuple),
/* harmony export */   "ZodType": () => (/* binding */ ZodType),
/* harmony export */   "ZodUndefined": () => (/* binding */ ZodUndefined),
/* harmony export */   "ZodUnion": () => (/* binding */ ZodUnion),
/* harmony export */   "ZodUnknown": () => (/* binding */ ZodUnknown),
/* harmony export */   "ZodVoid": () => (/* binding */ ZodVoid),
/* harmony export */   "addIssueToContext": () => (/* binding */ addIssueToContext),
/* harmony export */   "any": () => (/* binding */ anyType),
/* harmony export */   "array": () => (/* binding */ arrayType),
/* harmony export */   "bigint": () => (/* binding */ bigIntType),
/* harmony export */   "boolean": () => (/* binding */ booleanType),
/* harmony export */   "coerce": () => (/* binding */ coerce),
/* harmony export */   "custom": () => (/* binding */ custom),
/* harmony export */   "date": () => (/* binding */ dateType),
/* harmony export */   "default": () => (/* binding */ z),
/* harmony export */   "defaultErrorMap": () => (/* binding */ errorMap),
/* harmony export */   "discriminatedUnion": () => (/* binding */ discriminatedUnionType),
/* harmony export */   "effect": () => (/* binding */ effectsType),
/* harmony export */   "enum": () => (/* binding */ enumType),
/* harmony export */   "function": () => (/* binding */ functionType),
/* harmony export */   "getErrorMap": () => (/* binding */ getErrorMap),
/* harmony export */   "getParsedType": () => (/* binding */ getParsedType),
/* harmony export */   "instanceof": () => (/* binding */ instanceOfType),
/* harmony export */   "intersection": () => (/* binding */ intersectionType),
/* harmony export */   "isAborted": () => (/* binding */ isAborted),
/* harmony export */   "isAsync": () => (/* binding */ isAsync),
/* harmony export */   "isDirty": () => (/* binding */ isDirty),
/* harmony export */   "isValid": () => (/* binding */ isValid),
/* harmony export */   "late": () => (/* binding */ late),
/* harmony export */   "lazy": () => (/* binding */ lazyType),
/* harmony export */   "literal": () => (/* binding */ literalType),
/* harmony export */   "makeIssue": () => (/* binding */ makeIssue),
/* harmony export */   "map": () => (/* binding */ mapType),
/* harmony export */   "nan": () => (/* binding */ nanType),
/* harmony export */   "nativeEnum": () => (/* binding */ nativeEnumType),
/* harmony export */   "never": () => (/* binding */ neverType),
/* harmony export */   "null": () => (/* binding */ nullType),
/* harmony export */   "nullable": () => (/* binding */ nullableType),
/* harmony export */   "number": () => (/* binding */ numberType),
/* harmony export */   "object": () => (/* binding */ objectType),
/* harmony export */   "objectUtil": () => (/* binding */ objectUtil),
/* harmony export */   "oboolean": () => (/* binding */ oboolean),
/* harmony export */   "onumber": () => (/* binding */ onumber),
/* harmony export */   "optional": () => (/* binding */ optionalType),
/* harmony export */   "ostring": () => (/* binding */ ostring),
/* harmony export */   "pipeline": () => (/* binding */ pipelineType),
/* harmony export */   "preprocess": () => (/* binding */ preprocessType),
/* harmony export */   "promise": () => (/* binding */ promiseType),
/* harmony export */   "quotelessJson": () => (/* binding */ quotelessJson),
/* harmony export */   "record": () => (/* binding */ recordType),
/* harmony export */   "set": () => (/* binding */ setType),
/* harmony export */   "setErrorMap": () => (/* binding */ setErrorMap),
/* harmony export */   "strictObject": () => (/* binding */ strictObjectType),
/* harmony export */   "string": () => (/* binding */ stringType),
/* harmony export */   "symbol": () => (/* binding */ symbolType),
/* harmony export */   "transformer": () => (/* binding */ effectsType),
/* harmony export */   "tuple": () => (/* binding */ tupleType),
/* harmony export */   "undefined": () => (/* binding */ undefinedType),
/* harmony export */   "union": () => (/* binding */ unionType),
/* harmony export */   "unknown": () => (/* binding */ unknownType),
/* harmony export */   "util": () => (/* binding */ util),
/* harmony export */   "void": () => (/* binding */ voidType),
/* harmony export */   "z": () => (/* binding */ z)
/* harmony export */ });
var util;
(function (util) {
    util.assertEqual = (val) => val;
    function assertIs(_arg) { }
    util.assertIs = assertIs;
    function assertNever(_x) {
        throw new Error();
    }
    util.assertNever = assertNever;
    util.arrayToEnum = (items) => {
        const obj = {};
        for (const item of items) {
            obj[item] = item;
        }
        return obj;
    };
    util.getValidEnumValues = (obj) => {
        const validKeys = util.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
        const filtered = {};
        for (const k of validKeys) {
            filtered[k] = obj[k];
        }
        return util.objectValues(filtered);
    };
    util.objectValues = (obj) => {
        return util.objectKeys(obj).map(function (e) {
            return obj[e];
        });
    };
    util.objectKeys = typeof Object.keys === "function" // eslint-disable-line ban/ban
        ? (obj) => Object.keys(obj) // eslint-disable-line ban/ban
        : (object) => {
            const keys = [];
            for (const key in object) {
                if (Object.prototype.hasOwnProperty.call(object, key)) {
                    keys.push(key);
                }
            }
            return keys;
        };
    util.find = (arr, checker) => {
        for (const item of arr) {
            if (checker(item))
                return item;
        }
        return undefined;
    };
    util.isInteger = typeof Number.isInteger === "function"
        ? (val) => Number.isInteger(val) // eslint-disable-line ban/ban
        : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
    function joinValues(array, separator = " | ") {
        return array
            .map((val) => (typeof val === "string" ? `'${val}'` : val))
            .join(separator);
    }
    util.joinValues = joinValues;
    util.jsonStringifyReplacer = (_, value) => {
        if (typeof value === "bigint") {
            return value.toString();
        }
        return value;
    };
})(util || (util = {}));
var objectUtil;
(function (objectUtil) {
    objectUtil.mergeShapes = (first, second) => {
        return {
            ...first,
            ...second, // second overwrites first
        };
    };
})(objectUtil || (objectUtil = {}));
const ZodParsedType = util.arrayToEnum([
    "string",
    "nan",
    "number",
    "integer",
    "float",
    "boolean",
    "date",
    "bigint",
    "symbol",
    "function",
    "undefined",
    "null",
    "array",
    "object",
    "unknown",
    "promise",
    "void",
    "never",
    "map",
    "set",
]);
const getParsedType = (data) => {
    const t = typeof data;
    switch (t) {
        case "undefined":
            return ZodParsedType.undefined;
        case "string":
            return ZodParsedType.string;
        case "number":
            return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
        case "boolean":
            return ZodParsedType.boolean;
        case "function":
            return ZodParsedType.function;
        case "bigint":
            return ZodParsedType.bigint;
        case "symbol":
            return ZodParsedType.symbol;
        case "object":
            if (Array.isArray(data)) {
                return ZodParsedType.array;
            }
            if (data === null) {
                return ZodParsedType.null;
            }
            if (data.then &&
                typeof data.then === "function" &&
                data.catch &&
                typeof data.catch === "function") {
                return ZodParsedType.promise;
            }
            if (typeof Map !== "undefined" && data instanceof Map) {
                return ZodParsedType.map;
            }
            if (typeof Set !== "undefined" && data instanceof Set) {
                return ZodParsedType.set;
            }
            if (typeof Date !== "undefined" && data instanceof Date) {
                return ZodParsedType.date;
            }
            return ZodParsedType.object;
        default:
            return ZodParsedType.unknown;
    }
};

const ZodIssueCode = util.arrayToEnum([
    "invalid_type",
    "invalid_literal",
    "custom",
    "invalid_union",
    "invalid_union_discriminator",
    "invalid_enum_value",
    "unrecognized_keys",
    "invalid_arguments",
    "invalid_return_type",
    "invalid_date",
    "invalid_string",
    "too_small",
    "too_big",
    "invalid_intersection_types",
    "not_multiple_of",
    "not_finite",
]);
const quotelessJson = (obj) => {
    const json = JSON.stringify(obj, null, 2);
    return json.replace(/"([^"]+)":/g, "$1:");
};
class ZodError extends Error {
    constructor(issues) {
        super();
        this.issues = [];
        this.addIssue = (sub) => {
            this.issues = [...this.issues, sub];
        };
        this.addIssues = (subs = []) => {
            this.issues = [...this.issues, ...subs];
        };
        const actualProto = new.target.prototype;
        if (Object.setPrototypeOf) {
            // eslint-disable-next-line ban/ban
            Object.setPrototypeOf(this, actualProto);
        }
        else {
            this.__proto__ = actualProto;
        }
        this.name = "ZodError";
        this.issues = issues;
    }
    get errors() {
        return this.issues;
    }
    format(_mapper) {
        const mapper = _mapper ||
            function (issue) {
                return issue.message;
            };
        const fieldErrors = { _errors: [] };
        const processError = (error) => {
            for (const issue of error.issues) {
                if (issue.code === "invalid_union") {
                    issue.unionErrors.map(processError);
                }
                else if (issue.code === "invalid_return_type") {
                    processError(issue.returnTypeError);
                }
                else if (issue.code === "invalid_arguments") {
                    processError(issue.argumentsError);
                }
                else if (issue.path.length === 0) {
                    fieldErrors._errors.push(mapper(issue));
                }
                else {
                    let curr = fieldErrors;
                    let i = 0;
                    while (i < issue.path.length) {
                        const el = issue.path[i];
                        const terminal = i === issue.path.length - 1;
                        if (!terminal) {
                            curr[el] = curr[el] || { _errors: [] };
                            // if (typeof el === "string") {
                            //   curr[el] = curr[el] || { _errors: [] };
                            // } else if (typeof el === "number") {
                            //   const errorArray: any = [];
                            //   errorArray._errors = [];
                            //   curr[el] = curr[el] || errorArray;
                            // }
                        }
                        else {
                            curr[el] = curr[el] || { _errors: [] };
                            curr[el]._errors.push(mapper(issue));
                        }
                        curr = curr[el];
                        i++;
                    }
                }
            }
        };
        processError(this);
        return fieldErrors;
    }
    toString() {
        return this.message;
    }
    get message() {
        return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
    }
    get isEmpty() {
        return this.issues.length === 0;
    }
    flatten(mapper = (issue) => issue.message) {
        const fieldErrors = {};
        const formErrors = [];
        for (const sub of this.issues) {
            if (sub.path.length > 0) {
                fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
                fieldErrors[sub.path[0]].push(mapper(sub));
            }
            else {
                formErrors.push(mapper(sub));
            }
        }
        return { formErrors, fieldErrors };
    }
    get formErrors() {
        return this.flatten();
    }
}
ZodError.create = (issues) => {
    const error = new ZodError(issues);
    return error;
};

const errorMap = (issue, _ctx) => {
    let message;
    switch (issue.code) {
        case ZodIssueCode.invalid_type:
            if (issue.received === ZodParsedType.undefined) {
                message = "Required";
            }
            else {
                message = `Expected ${issue.expected}, received ${issue.received}`;
            }
            break;
        case ZodIssueCode.invalid_literal:
            message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
            break;
        case ZodIssueCode.unrecognized_keys:
            message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
            break;
        case ZodIssueCode.invalid_union:
            message = `Invalid input`;
            break;
        case ZodIssueCode.invalid_union_discriminator:
            message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
            break;
        case ZodIssueCode.invalid_enum_value:
            message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
            break;
        case ZodIssueCode.invalid_arguments:
            message = `Invalid function arguments`;
            break;
        case ZodIssueCode.invalid_return_type:
            message = `Invalid function return type`;
            break;
        case ZodIssueCode.invalid_date:
            message = `Invalid date`;
            break;
        case ZodIssueCode.invalid_string:
            if (typeof issue.validation === "object") {
                if ("includes" in issue.validation) {
                    message = `Invalid input: must include "${issue.validation.includes}"`;
                    if (typeof issue.validation.position === "number") {
                        message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
                    }
                }
                else if ("startsWith" in issue.validation) {
                    message = `Invalid input: must start with "${issue.validation.startsWith}"`;
                }
                else if ("endsWith" in issue.validation) {
                    message = `Invalid input: must end with "${issue.validation.endsWith}"`;
                }
                else {
                    util.assertNever(issue.validation);
                }
            }
            else if (issue.validation !== "regex") {
                message = `Invalid ${issue.validation}`;
            }
            else {
                message = "Invalid";
            }
            break;
        case ZodIssueCode.too_small:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${issue.minimum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact
                    ? `exactly equal to `
                    : issue.inclusive
                        ? `greater than or equal to `
                        : `greater than `}${new Date(Number(issue.minimum))}`;
            else
                message = "Invalid input";
            break;
        case ZodIssueCode.too_big:
            if (issue.type === "array")
                message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
            else if (issue.type === "string")
                message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
            else if (issue.type === "number")
                message = `Number must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
            else if (issue.type === "bigint")
                message = `BigInt must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `less than or equal to`
                        : `less than`} ${issue.maximum}`;
            else if (issue.type === "date")
                message = `Date must be ${issue.exact
                    ? `exactly`
                    : issue.inclusive
                        ? `smaller than or equal to`
                        : `smaller than`} ${new Date(Number(issue.maximum))}`;
            else
                message = "Invalid input";
            break;
        case ZodIssueCode.custom:
            message = `Invalid input`;
            break;
        case ZodIssueCode.invalid_intersection_types:
            message = `Intersection results could not be merged`;
            break;
        case ZodIssueCode.not_multiple_of:
            message = `Number must be a multiple of ${issue.multipleOf}`;
            break;
        case ZodIssueCode.not_finite:
            message = "Number must be finite";
            break;
        default:
            message = _ctx.defaultError;
            util.assertNever(issue);
    }
    return { message };
};

let overrideErrorMap = errorMap;
function setErrorMap(map) {
    overrideErrorMap = map;
}
function getErrorMap() {
    return overrideErrorMap;
}

const makeIssue = (params) => {
    const { data, path, errorMaps, issueData } = params;
    const fullPath = [...path, ...(issueData.path || [])];
    const fullIssue = {
        ...issueData,
        path: fullPath,
    };
    let errorMessage = "";
    const maps = errorMaps
        .filter((m) => !!m)
        .slice()
        .reverse();
    for (const map of maps) {
        errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
    }
    return {
        ...issueData,
        path: fullPath,
        message: issueData.message || errorMessage,
    };
};
const EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
    const issue = makeIssue({
        issueData: issueData,
        data: ctx.data,
        path: ctx.path,
        errorMaps: [
            ctx.common.contextualErrorMap,
            ctx.schemaErrorMap,
            getErrorMap(),
            errorMap, // then global default map
        ].filter((x) => !!x),
    });
    ctx.common.issues.push(issue);
}
class ParseStatus {
    constructor() {
        this.value = "valid";
    }
    dirty() {
        if (this.value === "valid")
            this.value = "dirty";
    }
    abort() {
        if (this.value !== "aborted")
            this.value = "aborted";
    }
    static mergeArray(status, results) {
        const arrayValue = [];
        for (const s of results) {
            if (s.status === "aborted")
                return INVALID;
            if (s.status === "dirty")
                status.dirty();
            arrayValue.push(s.value);
        }
        return { status: status.value, value: arrayValue };
    }
    static async mergeObjectAsync(status, pairs) {
        const syncPairs = [];
        for (const pair of pairs) {
            syncPairs.push({
                key: await pair.key,
                value: await pair.value,
            });
        }
        return ParseStatus.mergeObjectSync(status, syncPairs);
    }
    static mergeObjectSync(status, pairs) {
        const finalObject = {};
        for (const pair of pairs) {
            const { key, value } = pair;
            if (key.status === "aborted")
                return INVALID;
            if (value.status === "aborted")
                return INVALID;
            if (key.status === "dirty")
                status.dirty();
            if (value.status === "dirty")
                status.dirty();
            if (typeof value.value !== "undefined" || pair.alwaysSet) {
                finalObject[key.value] = value.value;
            }
        }
        return { status: status.value, value: finalObject };
    }
}
const INVALID = Object.freeze({
    status: "aborted",
});
const DIRTY = (value) => ({ status: "dirty", value });
const OK = (value) => ({ status: "valid", value });
const isAborted = (x) => x.status === "aborted";
const isDirty = (x) => x.status === "dirty";
const isValid = (x) => x.status === "valid";
const isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

var errorUtil;
(function (errorUtil) {
    errorUtil.errToObj = (message) => typeof message === "string" ? { message } : message || {};
    errorUtil.toString = (message) => typeof message === "string" ? message : message === null || message === void 0 ? void 0 : message.message;
})(errorUtil || (errorUtil = {}));

class ParseInputLazyPath {
    constructor(parent, value, path, key) {
        this._cachedPath = [];
        this.parent = parent;
        this.data = value;
        this._path = path;
        this._key = key;
    }
    get path() {
        if (!this._cachedPath.length) {
            if (this._key instanceof Array) {
                this._cachedPath.push(...this._path, ...this._key);
            }
            else {
                this._cachedPath.push(...this._path, this._key);
            }
        }
        return this._cachedPath;
    }
}
const handleResult = (ctx, result) => {
    if (isValid(result)) {
        return { success: true, data: result.value };
    }
    else {
        if (!ctx.common.issues.length) {
            throw new Error("Validation failed but no issues detected.");
        }
        return {
            success: false,
            get error() {
                if (this._error)
                    return this._error;
                const error = new ZodError(ctx.common.issues);
                this._error = error;
                return this._error;
            },
        };
    }
};
function processCreateParams(params) {
    if (!params)
        return {};
    const { errorMap, invalid_type_error, required_error, description } = params;
    if (errorMap && (invalid_type_error || required_error)) {
        throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
    }
    if (errorMap)
        return { errorMap: errorMap, description };
    const customMap = (iss, ctx) => {
        if (iss.code !== "invalid_type")
            return { message: ctx.defaultError };
        if (typeof ctx.data === "undefined") {
            return { message: required_error !== null && required_error !== void 0 ? required_error : ctx.defaultError };
        }
        return { message: invalid_type_error !== null && invalid_type_error !== void 0 ? invalid_type_error : ctx.defaultError };
    };
    return { errorMap: customMap, description };
}
class ZodType {
    constructor(def) {
        /** Alias of safeParseAsync */
        this.spa = this.safeParseAsync;
        this._def = def;
        this.parse = this.parse.bind(this);
        this.safeParse = this.safeParse.bind(this);
        this.parseAsync = this.parseAsync.bind(this);
        this.safeParseAsync = this.safeParseAsync.bind(this);
        this.spa = this.spa.bind(this);
        this.refine = this.refine.bind(this);
        this.refinement = this.refinement.bind(this);
        this.superRefine = this.superRefine.bind(this);
        this.optional = this.optional.bind(this);
        this.nullable = this.nullable.bind(this);
        this.nullish = this.nullish.bind(this);
        this.array = this.array.bind(this);
        this.promise = this.promise.bind(this);
        this.or = this.or.bind(this);
        this.and = this.and.bind(this);
        this.transform = this.transform.bind(this);
        this.brand = this.brand.bind(this);
        this.default = this.default.bind(this);
        this.catch = this.catch.bind(this);
        this.describe = this.describe.bind(this);
        this.pipe = this.pipe.bind(this);
        this.isNullable = this.isNullable.bind(this);
        this.isOptional = this.isOptional.bind(this);
    }
    get description() {
        return this._def.description;
    }
    _getType(input) {
        return getParsedType(input.data);
    }
    _getOrReturnCtx(input, ctx) {
        return (ctx || {
            common: input.parent.common,
            data: input.data,
            parsedType: getParsedType(input.data),
            schemaErrorMap: this._def.errorMap,
            path: input.path,
            parent: input.parent,
        });
    }
    _processInputParams(input) {
        return {
            status: new ParseStatus(),
            ctx: {
                common: input.parent.common,
                data: input.data,
                parsedType: getParsedType(input.data),
                schemaErrorMap: this._def.errorMap,
                path: input.path,
                parent: input.parent,
            },
        };
    }
    _parseSync(input) {
        const result = this._parse(input);
        if (isAsync(result)) {
            throw new Error("Synchronous parse encountered promise.");
        }
        return result;
    }
    _parseAsync(input) {
        const result = this._parse(input);
        return Promise.resolve(result);
    }
    parse(data, params) {
        const result = this.safeParse(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    safeParse(data, params) {
        var _a;
        const ctx = {
            common: {
                issues: [],
                async: (_a = params === null || params === void 0 ? void 0 : params.async) !== null && _a !== void 0 ? _a : false,
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data),
        };
        const result = this._parseSync({ data, path: ctx.path, parent: ctx });
        return handleResult(ctx, result);
    }
    async parseAsync(data, params) {
        const result = await this.safeParseAsync(data, params);
        if (result.success)
            return result.data;
        throw result.error;
    }
    async safeParseAsync(data, params) {
        const ctx = {
            common: {
                issues: [],
                contextualErrorMap: params === null || params === void 0 ? void 0 : params.errorMap,
                async: true,
            },
            path: (params === null || params === void 0 ? void 0 : params.path) || [],
            schemaErrorMap: this._def.errorMap,
            parent: null,
            data,
            parsedType: getParsedType(data),
        };
        const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
        const result = await (isAsync(maybeAsyncResult)
            ? maybeAsyncResult
            : Promise.resolve(maybeAsyncResult));
        return handleResult(ctx, result);
    }
    refine(check, message) {
        const getIssueProperties = (val) => {
            if (typeof message === "string" || typeof message === "undefined") {
                return { message };
            }
            else if (typeof message === "function") {
                return message(val);
            }
            else {
                return message;
            }
        };
        return this._refinement((val, ctx) => {
            const result = check(val);
            const setError = () => ctx.addIssue({
                code: ZodIssueCode.custom,
                ...getIssueProperties(val),
            });
            if (typeof Promise !== "undefined" && result instanceof Promise) {
                return result.then((data) => {
                    if (!data) {
                        setError();
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }
            if (!result) {
                setError();
                return false;
            }
            else {
                return true;
            }
        });
    }
    refinement(check, refinementData) {
        return this._refinement((val, ctx) => {
            if (!check(val)) {
                ctx.addIssue(typeof refinementData === "function"
                    ? refinementData(val, ctx)
                    : refinementData);
                return false;
            }
            else {
                return true;
            }
        });
    }
    _refinement(refinement) {
        return new ZodEffects({
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "refinement", refinement },
        });
    }
    superRefine(refinement) {
        return this._refinement(refinement);
    }
    optional() {
        return ZodOptional.create(this, this._def);
    }
    nullable() {
        return ZodNullable.create(this, this._def);
    }
    nullish() {
        return this.nullable().optional();
    }
    array() {
        return ZodArray.create(this, this._def);
    }
    promise() {
        return ZodPromise.create(this, this._def);
    }
    or(option) {
        return ZodUnion.create([this, option], this._def);
    }
    and(incoming) {
        return ZodIntersection.create(this, incoming, this._def);
    }
    transform(transform) {
        return new ZodEffects({
            ...processCreateParams(this._def),
            schema: this,
            typeName: ZodFirstPartyTypeKind.ZodEffects,
            effect: { type: "transform", transform },
        });
    }
    default(def) {
        const defaultValueFunc = typeof def === "function" ? def : () => def;
        return new ZodDefault({
            ...processCreateParams(this._def),
            innerType: this,
            defaultValue: defaultValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodDefault,
        });
    }
    brand() {
        return new ZodBranded({
            typeName: ZodFirstPartyTypeKind.ZodBranded,
            type: this,
            ...processCreateParams(this._def),
        });
    }
    catch(def) {
        const catchValueFunc = typeof def === "function" ? def : () => def;
        return new ZodCatch({
            ...processCreateParams(this._def),
            innerType: this,
            catchValue: catchValueFunc,
            typeName: ZodFirstPartyTypeKind.ZodCatch,
        });
    }
    describe(description) {
        const This = this.constructor;
        return new This({
            ...this._def,
            description,
        });
    }
    pipe(target) {
        return ZodPipeline.create(this, target);
    }
    isOptional() {
        return this.safeParse(undefined).success;
    }
    isNullable() {
        return this.safeParse(null).success;
    }
}
const cuidRegex = /^c[^\s-]{8,}$/i;
const cuid2Regex = /^[a-z][a-z0-9]*$/;
const ulidRegex = /[0-9A-HJKMNP-TV-Z]{26}/;
const uuidRegex = /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;
// from https://stackoverflow.com/a/46181/1550155
// old version: too slow, didn't support unicode
// const emailRegex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
//old email regex
// const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((?!-)([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{1,})[^-<>()[\].,;:\s@"]$/i;
// eslint-disable-next-line
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\])|(\[IPv6:(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))\])|([A-Za-z0-9]([A-Za-z0-9-]*[A-Za-z0-9])*(\.[A-Za-z]{2,})+))$/;
// from https://thekevinscott.com/emojis-in-javascript/#writing-a-regular-expression
const emojiRegex = /^(\p{Extended_Pictographic}|\p{Emoji_Component})+$/u;
const ipv4Regex = /^(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))$/;
const ipv6Regex = /^(([a-f0-9]{1,4}:){7}|::([a-f0-9]{1,4}:){0,6}|([a-f0-9]{1,4}:){1}:([a-f0-9]{1,4}:){0,5}|([a-f0-9]{1,4}:){2}:([a-f0-9]{1,4}:){0,4}|([a-f0-9]{1,4}:){3}:([a-f0-9]{1,4}:){0,3}|([a-f0-9]{1,4}:){4}:([a-f0-9]{1,4}:){0,2}|([a-f0-9]{1,4}:){5}:([a-f0-9]{1,4}:){0,1})([a-f0-9]{1,4}|(((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2}))\.){3}((25[0-5])|(2[0-4][0-9])|(1[0-9]{2})|([0-9]{1,2})))$/;
// Adapted from https://stackoverflow.com/a/3143231
const datetimeRegex = (args) => {
    if (args.precision) {
        if (args.offset) {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
        }
        else {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{${args.precision}}Z$`);
        }
    }
    else if (args.precision === 0) {
        if (args.offset) {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
        }
        else {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}Z$`);
        }
    }
    else {
        if (args.offset) {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?(([+-]\\d{2}(:?\\d{2})?)|Z)$`);
        }
        else {
            return new RegExp(`^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}(\\.\\d+)?Z$`);
        }
    }
};
function isValidIP(ip, version) {
    if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
        return true;
    }
    if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
        return true;
    }
    return false;
}
class ZodString extends ZodType {
    constructor() {
        super(...arguments);
        this._regex = (regex, validation, message) => this.refinement((data) => regex.test(data), {
            validation,
            code: ZodIssueCode.invalid_string,
            ...errorUtil.errToObj(message),
        });
        /**
         * @deprecated Use z.string().min(1) instead.
         * @see {@link ZodString.min}
         */
        this.nonempty = (message) => this.min(1, errorUtil.errToObj(message));
        this.trim = () => new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "trim" }],
        });
        this.toLowerCase = () => new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toLowerCase" }],
        });
        this.toUpperCase = () => new ZodString({
            ...this._def,
            checks: [...this._def.checks, { kind: "toUpperCase" }],
        });
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = String(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.string) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.string,
                received: ctx.parsedType,
            }
            //
            );
            return INVALID;
        }
        const status = new ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.length < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.length > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "string",
                        inclusive: true,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "length") {
                const tooBig = input.data.length > check.value;
                const tooSmall = input.data.length < check.value;
                if (tooBig || tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    if (tooBig) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_big,
                            maximum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    else if (tooSmall) {
                        addIssueToContext(ctx, {
                            code: ZodIssueCode.too_small,
                            minimum: check.value,
                            type: "string",
                            inclusive: true,
                            exact: true,
                            message: check.message,
                        });
                    }
                    status.dirty();
                }
            }
            else if (check.kind === "email") {
                if (!emailRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "email",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "emoji") {
                if (!emojiRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "emoji",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "uuid") {
                if (!uuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "uuid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid") {
                if (!cuidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "cuid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "cuid2") {
                if (!cuid2Regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "cuid2",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ulid") {
                if (!ulidRegex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "ulid",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "url") {
                try {
                    new URL(input.data);
                }
                catch (_a) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "url",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "regex") {
                check.regex.lastIndex = 0;
                const testResult = check.regex.test(input.data);
                if (!testResult) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "regex",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "trim") {
                input.data = input.data.trim();
            }
            else if (check.kind === "includes") {
                if (!input.data.includes(check.value, check.position)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { includes: check.value, position: check.position },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "toLowerCase") {
                input.data = input.data.toLowerCase();
            }
            else if (check.kind === "toUpperCase") {
                input.data = input.data.toUpperCase();
            }
            else if (check.kind === "startsWith") {
                if (!input.data.startsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { startsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "endsWith") {
                if (!input.data.endsWith(check.value)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: { endsWith: check.value },
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "datetime") {
                const regex = datetimeRegex(check);
                if (!regex.test(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_string,
                        validation: "datetime",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "ip") {
                if (!isValidIP(input.data, check.version)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        validation: "ip",
                        code: ZodIssueCode.invalid_string,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    _addCheck(check) {
        return new ZodString({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    email(message) {
        return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
    }
    url(message) {
        return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
    }
    emoji(message) {
        return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
    }
    uuid(message) {
        return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
    }
    cuid(message) {
        return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
    }
    cuid2(message) {
        return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
    }
    ulid(message) {
        return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
    }
    ip(options) {
        return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
    }
    datetime(options) {
        var _a;
        if (typeof options === "string") {
            return this._addCheck({
                kind: "datetime",
                precision: null,
                offset: false,
                message: options,
            });
        }
        return this._addCheck({
            kind: "datetime",
            precision: typeof (options === null || options === void 0 ? void 0 : options.precision) === "undefined" ? null : options === null || options === void 0 ? void 0 : options.precision,
            offset: (_a = options === null || options === void 0 ? void 0 : options.offset) !== null && _a !== void 0 ? _a : false,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    regex(regex, message) {
        return this._addCheck({
            kind: "regex",
            regex: regex,
            ...errorUtil.errToObj(message),
        });
    }
    includes(value, options) {
        return this._addCheck({
            kind: "includes",
            value: value,
            position: options === null || options === void 0 ? void 0 : options.position,
            ...errorUtil.errToObj(options === null || options === void 0 ? void 0 : options.message),
        });
    }
    startsWith(value, message) {
        return this._addCheck({
            kind: "startsWith",
            value: value,
            ...errorUtil.errToObj(message),
        });
    }
    endsWith(value, message) {
        return this._addCheck({
            kind: "endsWith",
            value: value,
            ...errorUtil.errToObj(message),
        });
    }
    min(minLength, message) {
        return this._addCheck({
            kind: "min",
            value: minLength,
            ...errorUtil.errToObj(message),
        });
    }
    max(maxLength, message) {
        return this._addCheck({
            kind: "max",
            value: maxLength,
            ...errorUtil.errToObj(message),
        });
    }
    length(len, message) {
        return this._addCheck({
            kind: "length",
            value: len,
            ...errorUtil.errToObj(message),
        });
    }
    get isDatetime() {
        return !!this._def.checks.find((ch) => ch.kind === "datetime");
    }
    get isEmail() {
        return !!this._def.checks.find((ch) => ch.kind === "email");
    }
    get isURL() {
        return !!this._def.checks.find((ch) => ch.kind === "url");
    }
    get isEmoji() {
        return !!this._def.checks.find((ch) => ch.kind === "emoji");
    }
    get isUUID() {
        return !!this._def.checks.find((ch) => ch.kind === "uuid");
    }
    get isCUID() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid");
    }
    get isCUID2() {
        return !!this._def.checks.find((ch) => ch.kind === "cuid2");
    }
    get isULID() {
        return !!this._def.checks.find((ch) => ch.kind === "ulid");
    }
    get isIP() {
        return !!this._def.checks.find((ch) => ch.kind === "ip");
    }
    get minLength() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxLength() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodString.create = (params) => {
    var _a;
    return new ZodString({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodString,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params),
    });
};
// https://stackoverflow.com/questions/3966484/why-does-modulus-operator-return-fractional-number-in-javascript/31711034#31711034
function floatSafeRemainder(val, step) {
    const valDecCount = (val.toString().split(".")[1] || "").length;
    const stepDecCount = (step.toString().split(".")[1] || "").length;
    const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
    const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
    const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
    return (valInt % stepInt) / Math.pow(10, decCount);
}
class ZodNumber extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
        this.step = this.multipleOf;
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = Number(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.number) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.number,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        let ctx = undefined;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "int") {
                if (!util.isInteger(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.invalid_type,
                        expected: "integer",
                        received: "float",
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "min") {
                const tooSmall = check.inclusive
                    ? input.data < check.value
                    : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        minimum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive
                    ? input.data > check.value
                    : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        maximum: check.value,
                        type: "number",
                        inclusive: check.inclusive,
                        exact: false,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (floatSafeRemainder(input.data, check.value) !== 0) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "finite") {
                if (!Number.isFinite(input.data)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_finite,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodNumber({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodNumber({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    int(message) {
        return this._addCheck({
            kind: "int",
            message: errorUtil.toString(message),
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: 0,
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value: value,
            message: errorUtil.toString(message),
        });
    }
    finite(message) {
        return this._addCheck({
            kind: "finite",
            message: errorUtil.toString(message),
        });
    }
    safe(message) {
        return this._addCheck({
            kind: "min",
            inclusive: true,
            value: Number.MIN_SAFE_INTEGER,
            message: errorUtil.toString(message),
        })._addCheck({
            kind: "max",
            inclusive: true,
            value: Number.MAX_SAFE_INTEGER,
            message: errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
    get isInt() {
        return !!this._def.checks.find((ch) => ch.kind === "int" ||
            (ch.kind === "multipleOf" && util.isInteger(ch.value)));
    }
    get isFinite() {
        let max = null, min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "finite" ||
                ch.kind === "int" ||
                ch.kind === "multipleOf") {
                return true;
            }
            else if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
            else if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return Number.isFinite(min) && Number.isFinite(max);
    }
}
ZodNumber.create = (params) => {
    return new ZodNumber({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodNumber,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params),
    });
};
class ZodBigInt extends ZodType {
    constructor() {
        super(...arguments);
        this.min = this.gte;
        this.max = this.lte;
    }
    _parse(input) {
        if (this._def.coerce) {
            input.data = BigInt(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.bigint) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.bigint,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        let ctx = undefined;
        const status = new ParseStatus();
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                const tooSmall = check.inclusive
                    ? input.data < check.value
                    : input.data <= check.value;
                if (tooSmall) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        type: "bigint",
                        minimum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                const tooBig = check.inclusive
                    ? input.data > check.value
                    : input.data >= check.value;
                if (tooBig) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        type: "bigint",
                        maximum: check.value,
                        inclusive: check.inclusive,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "multipleOf") {
                if (input.data % check.value !== BigInt(0)) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.not_multiple_of,
                        multipleOf: check.value,
                        message: check.message,
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return { status: status.value, value: input.data };
    }
    gte(value, message) {
        return this.setLimit("min", value, true, errorUtil.toString(message));
    }
    gt(value, message) {
        return this.setLimit("min", value, false, errorUtil.toString(message));
    }
    lte(value, message) {
        return this.setLimit("max", value, true, errorUtil.toString(message));
    }
    lt(value, message) {
        return this.setLimit("max", value, false, errorUtil.toString(message));
    }
    setLimit(kind, value, inclusive, message) {
        return new ZodBigInt({
            ...this._def,
            checks: [
                ...this._def.checks,
                {
                    kind,
                    value,
                    inclusive,
                    message: errorUtil.toString(message),
                },
            ],
        });
    }
    _addCheck(check) {
        return new ZodBigInt({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    positive(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    negative(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: false,
            message: errorUtil.toString(message),
        });
    }
    nonpositive(message) {
        return this._addCheck({
            kind: "max",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    nonnegative(message) {
        return this._addCheck({
            kind: "min",
            value: BigInt(0),
            inclusive: true,
            message: errorUtil.toString(message),
        });
    }
    multipleOf(value, message) {
        return this._addCheck({
            kind: "multipleOf",
            value,
            message: errorUtil.toString(message),
        });
    }
    get minValue() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min;
    }
    get maxValue() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max;
    }
}
ZodBigInt.create = (params) => {
    var _a;
    return new ZodBigInt({
        checks: [],
        typeName: ZodFirstPartyTypeKind.ZodBigInt,
        coerce: (_a = params === null || params === void 0 ? void 0 : params.coerce) !== null && _a !== void 0 ? _a : false,
        ...processCreateParams(params),
    });
};
class ZodBoolean extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = Boolean(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.boolean) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.boolean,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodBoolean.create = (params) => {
    return new ZodBoolean({
        typeName: ZodFirstPartyTypeKind.ZodBoolean,
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        ...processCreateParams(params),
    });
};
class ZodDate extends ZodType {
    _parse(input) {
        if (this._def.coerce) {
            input.data = new Date(input.data);
        }
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.date) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.date,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        if (isNaN(input.data.getTime())) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_date,
            });
            return INVALID;
        }
        const status = new ParseStatus();
        let ctx = undefined;
        for (const check of this._def.checks) {
            if (check.kind === "min") {
                if (input.data.getTime() < check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_small,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        minimum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else if (check.kind === "max") {
                if (input.data.getTime() > check.value) {
                    ctx = this._getOrReturnCtx(input, ctx);
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.too_big,
                        message: check.message,
                        inclusive: true,
                        exact: false,
                        maximum: check.value,
                        type: "date",
                    });
                    status.dirty();
                }
            }
            else {
                util.assertNever(check);
            }
        }
        return {
            status: status.value,
            value: new Date(input.data.getTime()),
        };
    }
    _addCheck(check) {
        return new ZodDate({
            ...this._def,
            checks: [...this._def.checks, check],
        });
    }
    min(minDate, message) {
        return this._addCheck({
            kind: "min",
            value: minDate.getTime(),
            message: errorUtil.toString(message),
        });
    }
    max(maxDate, message) {
        return this._addCheck({
            kind: "max",
            value: maxDate.getTime(),
            message: errorUtil.toString(message),
        });
    }
    get minDate() {
        let min = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "min") {
                if (min === null || ch.value > min)
                    min = ch.value;
            }
        }
        return min != null ? new Date(min) : null;
    }
    get maxDate() {
        let max = null;
        for (const ch of this._def.checks) {
            if (ch.kind === "max") {
                if (max === null || ch.value < max)
                    max = ch.value;
            }
        }
        return max != null ? new Date(max) : null;
    }
}
ZodDate.create = (params) => {
    return new ZodDate({
        checks: [],
        coerce: (params === null || params === void 0 ? void 0 : params.coerce) || false,
        typeName: ZodFirstPartyTypeKind.ZodDate,
        ...processCreateParams(params),
    });
};
class ZodSymbol extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.symbol) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.symbol,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodSymbol.create = (params) => {
    return new ZodSymbol({
        typeName: ZodFirstPartyTypeKind.ZodSymbol,
        ...processCreateParams(params),
    });
};
class ZodUndefined extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.undefined,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodUndefined.create = (params) => {
    return new ZodUndefined({
        typeName: ZodFirstPartyTypeKind.ZodUndefined,
        ...processCreateParams(params),
    });
};
class ZodNull extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.null) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.null,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodNull.create = (params) => {
    return new ZodNull({
        typeName: ZodFirstPartyTypeKind.ZodNull,
        ...processCreateParams(params),
    });
};
class ZodAny extends ZodType {
    constructor() {
        super(...arguments);
        // to prevent instances of other classes from extending ZodAny. this causes issues with catchall in ZodObject.
        this._any = true;
    }
    _parse(input) {
        return OK(input.data);
    }
}
ZodAny.create = (params) => {
    return new ZodAny({
        typeName: ZodFirstPartyTypeKind.ZodAny,
        ...processCreateParams(params),
    });
};
class ZodUnknown extends ZodType {
    constructor() {
        super(...arguments);
        // required
        this._unknown = true;
    }
    _parse(input) {
        return OK(input.data);
    }
}
ZodUnknown.create = (params) => {
    return new ZodUnknown({
        typeName: ZodFirstPartyTypeKind.ZodUnknown,
        ...processCreateParams(params),
    });
};
class ZodNever extends ZodType {
    _parse(input) {
        const ctx = this._getOrReturnCtx(input);
        addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: ZodParsedType.never,
            received: ctx.parsedType,
        });
        return INVALID;
    }
}
ZodNever.create = (params) => {
    return new ZodNever({
        typeName: ZodFirstPartyTypeKind.ZodNever,
        ...processCreateParams(params),
    });
};
class ZodVoid extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.undefined) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.void,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return OK(input.data);
    }
}
ZodVoid.create = (params) => {
    return new ZodVoid({
        typeName: ZodFirstPartyTypeKind.ZodVoid,
        ...processCreateParams(params),
    });
};
class ZodArray extends ZodType {
    _parse(input) {
        const { ctx, status } = this._processInputParams(input);
        const def = this._def;
        if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.array,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        if (def.exactLength !== null) {
            const tooBig = ctx.data.length > def.exactLength.value;
            const tooSmall = ctx.data.length < def.exactLength.value;
            if (tooBig || tooSmall) {
                addIssueToContext(ctx, {
                    code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
                    minimum: (tooSmall ? def.exactLength.value : undefined),
                    maximum: (tooBig ? def.exactLength.value : undefined),
                    type: "array",
                    inclusive: true,
                    exact: true,
                    message: def.exactLength.message,
                });
                status.dirty();
            }
        }
        if (def.minLength !== null) {
            if (ctx.data.length < def.minLength.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: def.minLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.minLength.message,
                });
                status.dirty();
            }
        }
        if (def.maxLength !== null) {
            if (ctx.data.length > def.maxLength.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: def.maxLength.value,
                    type: "array",
                    inclusive: true,
                    exact: false,
                    message: def.maxLength.message,
                });
                status.dirty();
            }
        }
        if (ctx.common.async) {
            return Promise.all([...ctx.data].map((item, i) => {
                return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
            })).then((result) => {
                return ParseStatus.mergeArray(status, result);
            });
        }
        const result = [...ctx.data].map((item, i) => {
            return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
        });
        return ParseStatus.mergeArray(status, result);
    }
    get element() {
        return this._def.type;
    }
    min(minLength, message) {
        return new ZodArray({
            ...this._def,
            minLength: { value: minLength, message: errorUtil.toString(message) },
        });
    }
    max(maxLength, message) {
        return new ZodArray({
            ...this._def,
            maxLength: { value: maxLength, message: errorUtil.toString(message) },
        });
    }
    length(len, message) {
        return new ZodArray({
            ...this._def,
            exactLength: { value: len, message: errorUtil.toString(message) },
        });
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodArray.create = (schema, params) => {
    return new ZodArray({
        type: schema,
        minLength: null,
        maxLength: null,
        exactLength: null,
        typeName: ZodFirstPartyTypeKind.ZodArray,
        ...processCreateParams(params),
    });
};
function deepPartialify(schema) {
    if (schema instanceof ZodObject) {
        const newShape = {};
        for (const key in schema.shape) {
            const fieldSchema = schema.shape[key];
            newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
        }
        return new ZodObject({
            ...schema._def,
            shape: () => newShape,
        });
    }
    else if (schema instanceof ZodArray) {
        return new ZodArray({
            ...schema._def,
            type: deepPartialify(schema.element),
        });
    }
    else if (schema instanceof ZodOptional) {
        return ZodOptional.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodNullable) {
        return ZodNullable.create(deepPartialify(schema.unwrap()));
    }
    else if (schema instanceof ZodTuple) {
        return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
    }
    else {
        return schema;
    }
}
class ZodObject extends ZodType {
    constructor() {
        super(...arguments);
        this._cached = null;
        /**
         * @deprecated In most cases, this is no longer needed - unknown properties are now silently stripped.
         * If you want to pass through unknown properties, use `.passthrough()` instead.
         */
        this.nonstrict = this.passthrough;
        // extend<
        //   Augmentation extends ZodRawShape,
        //   NewOutput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
        //       ? Augmentation[k]["_output"]
        //       : k extends keyof Output
        //       ? Output[k]
        //       : never;
        //   }>,
        //   NewInput extends util.flatten<{
        //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
        //       ? Augmentation[k]["_input"]
        //       : k extends keyof Input
        //       ? Input[k]
        //       : never;
        //   }>
        // >(
        //   augmentation: Augmentation
        // ): ZodObject<
        //   extendShape<T, Augmentation>,
        //   UnknownKeys,
        //   Catchall,
        //   NewOutput,
        //   NewInput
        // > {
        //   return new ZodObject({
        //     ...this._def,
        //     shape: () => ({
        //       ...this._def.shape(),
        //       ...augmentation,
        //     }),
        //   }) as any;
        // }
        /**
         * @deprecated Use `.extend` instead
         *  */
        this.augment = this.extend;
    }
    _getCached() {
        if (this._cached !== null)
            return this._cached;
        const shape = this._def.shape();
        const keys = util.objectKeys(shape);
        return (this._cached = { shape, keys });
    }
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.object) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const { status, ctx } = this._processInputParams(input);
        const { shape, keys: shapeKeys } = this._getCached();
        const extraKeys = [];
        if (!(this._def.catchall instanceof ZodNever &&
            this._def.unknownKeys === "strip")) {
            for (const key in ctx.data) {
                if (!shapeKeys.includes(key)) {
                    extraKeys.push(key);
                }
            }
        }
        const pairs = [];
        for (const key of shapeKeys) {
            const keyValidator = shape[key];
            const value = ctx.data[key];
            pairs.push({
                key: { status: "valid", value: key },
                value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
                alwaysSet: key in ctx.data,
            });
        }
        if (this._def.catchall instanceof ZodNever) {
            const unknownKeys = this._def.unknownKeys;
            if (unknownKeys === "passthrough") {
                for (const key of extraKeys) {
                    pairs.push({
                        key: { status: "valid", value: key },
                        value: { status: "valid", value: ctx.data[key] },
                    });
                }
            }
            else if (unknownKeys === "strict") {
                if (extraKeys.length > 0) {
                    addIssueToContext(ctx, {
                        code: ZodIssueCode.unrecognized_keys,
                        keys: extraKeys,
                    });
                    status.dirty();
                }
            }
            else if (unknownKeys === "strip") ;
            else {
                throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
            }
        }
        else {
            // run catchall validation
            const catchall = this._def.catchall;
            for (const key of extraKeys) {
                const value = ctx.data[key];
                pairs.push({
                    key: { status: "valid", value: key },
                    value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key) //, ctx.child(key), value, getParsedType(value)
                    ),
                    alwaysSet: key in ctx.data,
                });
            }
        }
        if (ctx.common.async) {
            return Promise.resolve()
                .then(async () => {
                const syncPairs = [];
                for (const pair of pairs) {
                    const key = await pair.key;
                    syncPairs.push({
                        key,
                        value: await pair.value,
                        alwaysSet: pair.alwaysSet,
                    });
                }
                return syncPairs;
            })
                .then((syncPairs) => {
                return ParseStatus.mergeObjectSync(status, syncPairs);
            });
        }
        else {
            return ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get shape() {
        return this._def.shape();
    }
    strict(message) {
        errorUtil.errToObj;
        return new ZodObject({
            ...this._def,
            unknownKeys: "strict",
            ...(message !== undefined
                ? {
                    errorMap: (issue, ctx) => {
                        var _a, _b, _c, _d;
                        const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === void 0 ? void 0 : _b.call(_a, issue, ctx).message) !== null && _c !== void 0 ? _c : ctx.defaultError;
                        if (issue.code === "unrecognized_keys")
                            return {
                                message: (_d = errorUtil.errToObj(message).message) !== null && _d !== void 0 ? _d : defaultError,
                            };
                        return {
                            message: defaultError,
                        };
                    },
                }
                : {}),
        });
    }
    strip() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "strip",
        });
    }
    passthrough() {
        return new ZodObject({
            ...this._def,
            unknownKeys: "passthrough",
        });
    }
    // const AugmentFactory =
    //   <Def extends ZodObjectDef>(def: Def) =>
    //   <Augmentation extends ZodRawShape>(
    //     augmentation: Augmentation
    //   ): ZodObject<
    //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
    //     Def["unknownKeys"],
    //     Def["catchall"]
    //   > => {
    //     return new ZodObject({
    //       ...def,
    //       shape: () => ({
    //         ...def.shape(),
    //         ...augmentation,
    //       }),
    //     }) as any;
    //   };
    extend(augmentation) {
        return new ZodObject({
            ...this._def,
            shape: () => ({
                ...this._def.shape(),
                ...augmentation,
            }),
        });
    }
    /**
     * Prior to zod@1.0.12 there was a bug in the
     * inferred type of merged objects. Please
     * upgrade if you are experiencing issues.
     */
    merge(merging) {
        const merged = new ZodObject({
            unknownKeys: merging._def.unknownKeys,
            catchall: merging._def.catchall,
            shape: () => ({
                ...this._def.shape(),
                ...merging._def.shape(),
            }),
            typeName: ZodFirstPartyTypeKind.ZodObject,
        });
        return merged;
    }
    // merge<
    //   Incoming extends AnyZodObject,
    //   Augmentation extends Incoming["shape"],
    //   NewOutput extends {
    //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
    //       ? Augmentation[k]["_output"]
    //       : k extends keyof Output
    //       ? Output[k]
    //       : never;
    //   },
    //   NewInput extends {
    //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
    //       ? Augmentation[k]["_input"]
    //       : k extends keyof Input
    //       ? Input[k]
    //       : never;
    //   }
    // >(
    //   merging: Incoming
    // ): ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"],
    //   NewOutput,
    //   NewInput
    // > {
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    setKey(key, schema) {
        return this.augment({ [key]: schema });
    }
    // merge<Incoming extends AnyZodObject>(
    //   merging: Incoming
    // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
    // ZodObject<
    //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
    //   Incoming["_def"]["unknownKeys"],
    //   Incoming["_def"]["catchall"]
    // > {
    //   // const mergedShape = objectUtil.mergeShapes(
    //   //   this._def.shape(),
    //   //   merging._def.shape()
    //   // );
    //   const merged: any = new ZodObject({
    //     unknownKeys: merging._def.unknownKeys,
    //     catchall: merging._def.catchall,
    //     shape: () =>
    //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
    //     typeName: ZodFirstPartyTypeKind.ZodObject,
    //   }) as any;
    //   return merged;
    // }
    catchall(index) {
        return new ZodObject({
            ...this._def,
            catchall: index,
        });
    }
    pick(mask) {
        const shape = {};
        util.objectKeys(mask).forEach((key) => {
            if (mask[key] && this.shape[key]) {
                shape[key] = this.shape[key];
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    omit(mask) {
        const shape = {};
        util.objectKeys(this.shape).forEach((key) => {
            if (!mask[key]) {
                shape[key] = this.shape[key];
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => shape,
        });
    }
    /**
     * @deprecated
     */
    deepPartial() {
        return deepPartialify(this);
    }
    partial(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
            const fieldSchema = this.shape[key];
            if (mask && !mask[key]) {
                newShape[key] = fieldSchema;
            }
            else {
                newShape[key] = fieldSchema.optional();
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    required(mask) {
        const newShape = {};
        util.objectKeys(this.shape).forEach((key) => {
            if (mask && !mask[key]) {
                newShape[key] = this.shape[key];
            }
            else {
                const fieldSchema = this.shape[key];
                let newField = fieldSchema;
                while (newField instanceof ZodOptional) {
                    newField = newField._def.innerType;
                }
                newShape[key] = newField;
            }
        });
        return new ZodObject({
            ...this._def,
            shape: () => newShape,
        });
    }
    keyof() {
        return createZodEnum(util.objectKeys(this.shape));
    }
}
ZodObject.create = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.strictCreate = (shape, params) => {
    return new ZodObject({
        shape: () => shape,
        unknownKeys: "strict",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
ZodObject.lazycreate = (shape, params) => {
    return new ZodObject({
        shape,
        unknownKeys: "strip",
        catchall: ZodNever.create(),
        typeName: ZodFirstPartyTypeKind.ZodObject,
        ...processCreateParams(params),
    });
};
class ZodUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const options = this._def.options;
        function handleResults(results) {
            // return first issue-free validation if it exists
            for (const result of results) {
                if (result.result.status === "valid") {
                    return result.result;
                }
            }
            for (const result of results) {
                if (result.result.status === "dirty") {
                    // add issues from dirty option
                    ctx.common.issues.push(...result.ctx.common.issues);
                    return result.result;
                }
            }
            // return invalid
            const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union,
                unionErrors,
            });
            return INVALID;
        }
        if (ctx.common.async) {
            return Promise.all(options.map(async (option) => {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                return {
                    result: await option._parseAsync({
                        data: ctx.data,
                        path: ctx.path,
                        parent: childCtx,
                    }),
                    ctx: childCtx,
                };
            })).then(handleResults);
        }
        else {
            let dirty = undefined;
            const issues = [];
            for (const option of options) {
                const childCtx = {
                    ...ctx,
                    common: {
                        ...ctx.common,
                        issues: [],
                    },
                    parent: null,
                };
                const result = option._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: childCtx,
                });
                if (result.status === "valid") {
                    return result;
                }
                else if (result.status === "dirty" && !dirty) {
                    dirty = { result, ctx: childCtx };
                }
                if (childCtx.common.issues.length) {
                    issues.push(childCtx.common.issues);
                }
            }
            if (dirty) {
                ctx.common.issues.push(...dirty.ctx.common.issues);
                return dirty.result;
            }
            const unionErrors = issues.map((issues) => new ZodError(issues));
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union,
                unionErrors,
            });
            return INVALID;
        }
    }
    get options() {
        return this._def.options;
    }
}
ZodUnion.create = (types, params) => {
    return new ZodUnion({
        options: types,
        typeName: ZodFirstPartyTypeKind.ZodUnion,
        ...processCreateParams(params),
    });
};
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
//////////                                 //////////
//////////      ZodDiscriminatedUnion      //////////
//////////                                 //////////
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////
const getDiscriminator = (type) => {
    if (type instanceof ZodLazy) {
        return getDiscriminator(type.schema);
    }
    else if (type instanceof ZodEffects) {
        return getDiscriminator(type.innerType());
    }
    else if (type instanceof ZodLiteral) {
        return [type.value];
    }
    else if (type instanceof ZodEnum) {
        return type.options;
    }
    else if (type instanceof ZodNativeEnum) {
        // eslint-disable-next-line ban/ban
        return Object.keys(type.enum);
    }
    else if (type instanceof ZodDefault) {
        return getDiscriminator(type._def.innerType);
    }
    else if (type instanceof ZodUndefined) {
        return [undefined];
    }
    else if (type instanceof ZodNull) {
        return [null];
    }
    else {
        return null;
    }
};
class ZodDiscriminatedUnion extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const discriminator = this.discriminator;
        const discriminatorValue = ctx.data[discriminator];
        const option = this.optionsMap.get(discriminatorValue);
        if (!option) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_union_discriminator,
                options: Array.from(this.optionsMap.keys()),
                path: [discriminator],
            });
            return INVALID;
        }
        if (ctx.common.async) {
            return option._parseAsync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
        else {
            return option._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
        }
    }
    get discriminator() {
        return this._def.discriminator;
    }
    get options() {
        return this._def.options;
    }
    get optionsMap() {
        return this._def.optionsMap;
    }
    /**
     * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
     * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
     * have a different value for each object in the union.
     * @param discriminator the name of the discriminator property
     * @param types an array of object schemas
     * @param params
     */
    static create(discriminator, options, params) {
        // Get all the valid discriminator values
        const optionsMap = new Map();
        // try {
        for (const type of options) {
            const discriminatorValues = getDiscriminator(type.shape[discriminator]);
            if (!discriminatorValues) {
                throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
            }
            for (const value of discriminatorValues) {
                if (optionsMap.has(value)) {
                    throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
                }
                optionsMap.set(value, type);
            }
        }
        return new ZodDiscriminatedUnion({
            typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
            discriminator,
            options,
            optionsMap,
            ...processCreateParams(params),
        });
    }
}
function mergeValues(a, b) {
    const aType = getParsedType(a);
    const bType = getParsedType(b);
    if (a === b) {
        return { valid: true, data: a };
    }
    else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
        const bKeys = util.objectKeys(b);
        const sharedKeys = util
            .objectKeys(a)
            .filter((key) => bKeys.indexOf(key) !== -1);
        const newObj = { ...a, ...b };
        for (const key of sharedKeys) {
            const sharedValue = mergeValues(a[key], b[key]);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newObj[key] = sharedValue.data;
        }
        return { valid: true, data: newObj };
    }
    else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
        if (a.length !== b.length) {
            return { valid: false };
        }
        const newArray = [];
        for (let index = 0; index < a.length; index++) {
            const itemA = a[index];
            const itemB = b[index];
            const sharedValue = mergeValues(itemA, itemB);
            if (!sharedValue.valid) {
                return { valid: false };
            }
            newArray.push(sharedValue.data);
        }
        return { valid: true, data: newArray };
    }
    else if (aType === ZodParsedType.date &&
        bType === ZodParsedType.date &&
        +a === +b) {
        return { valid: true, data: a };
    }
    else {
        return { valid: false };
    }
}
class ZodIntersection extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const handleParsed = (parsedLeft, parsedRight) => {
            if (isAborted(parsedLeft) || isAborted(parsedRight)) {
                return INVALID;
            }
            const merged = mergeValues(parsedLeft.value, parsedRight.value);
            if (!merged.valid) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.invalid_intersection_types,
                });
                return INVALID;
            }
            if (isDirty(parsedLeft) || isDirty(parsedRight)) {
                status.dirty();
            }
            return { status: status.value, value: merged.data };
        };
        if (ctx.common.async) {
            return Promise.all([
                this._def.left._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
                this._def.right._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                }),
            ]).then(([left, right]) => handleParsed(left, right));
        }
        else {
            return handleParsed(this._def.left._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }), this._def.right._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            }));
        }
    }
}
ZodIntersection.create = (left, right, params) => {
    return new ZodIntersection({
        left: left,
        right: right,
        typeName: ZodFirstPartyTypeKind.ZodIntersection,
        ...processCreateParams(params),
    });
};
class ZodTuple extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.array) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.array,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        if (ctx.data.length < this._def.items.length) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.too_small,
                minimum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            return INVALID;
        }
        const rest = this._def.rest;
        if (!rest && ctx.data.length > this._def.items.length) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.too_big,
                maximum: this._def.items.length,
                inclusive: true,
                exact: false,
                type: "array",
            });
            status.dirty();
        }
        const items = [...ctx.data]
            .map((item, itemIndex) => {
            const schema = this._def.items[itemIndex] || this._def.rest;
            if (!schema)
                return null;
            return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
        })
            .filter((x) => !!x); // filter nulls
        if (ctx.common.async) {
            return Promise.all(items).then((results) => {
                return ParseStatus.mergeArray(status, results);
            });
        }
        else {
            return ParseStatus.mergeArray(status, items);
        }
    }
    get items() {
        return this._def.items;
    }
    rest(rest) {
        return new ZodTuple({
            ...this._def,
            rest,
        });
    }
}
ZodTuple.create = (schemas, params) => {
    if (!Array.isArray(schemas)) {
        throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
    }
    return new ZodTuple({
        items: schemas,
        typeName: ZodFirstPartyTypeKind.ZodTuple,
        rest: null,
        ...processCreateParams(params),
    });
};
class ZodRecord extends ZodType {
    get keySchema() {
        return this._def.keyType;
    }
    get valueSchema() {
        return this._def.valueType;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.object) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.object,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const pairs = [];
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        for (const key in ctx.data) {
            pairs.push({
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
                value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
            });
        }
        if (ctx.common.async) {
            return ParseStatus.mergeObjectAsync(status, pairs);
        }
        else {
            return ParseStatus.mergeObjectSync(status, pairs);
        }
    }
    get element() {
        return this._def.valueType;
    }
    static create(first, second, third) {
        if (second instanceof ZodType) {
            return new ZodRecord({
                keyType: first,
                valueType: second,
                typeName: ZodFirstPartyTypeKind.ZodRecord,
                ...processCreateParams(third),
            });
        }
        return new ZodRecord({
            keyType: ZodString.create(),
            valueType: first,
            typeName: ZodFirstPartyTypeKind.ZodRecord,
            ...processCreateParams(second),
        });
    }
}
class ZodMap extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.map) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.map,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const keyType = this._def.keyType;
        const valueType = this._def.valueType;
        const pairs = [...ctx.data.entries()].map(([key, value], index) => {
            return {
                key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
                value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"])),
            };
        });
        if (ctx.common.async) {
            const finalMap = new Map();
            return Promise.resolve().then(async () => {
                for (const pair of pairs) {
                    const key = await pair.key;
                    const value = await pair.value;
                    if (key.status === "aborted" || value.status === "aborted") {
                        return INVALID;
                    }
                    if (key.status === "dirty" || value.status === "dirty") {
                        status.dirty();
                    }
                    finalMap.set(key.value, value.value);
                }
                return { status: status.value, value: finalMap };
            });
        }
        else {
            const finalMap = new Map();
            for (const pair of pairs) {
                const key = pair.key;
                const value = pair.value;
                if (key.status === "aborted" || value.status === "aborted") {
                    return INVALID;
                }
                if (key.status === "dirty" || value.status === "dirty") {
                    status.dirty();
                }
                finalMap.set(key.value, value.value);
            }
            return { status: status.value, value: finalMap };
        }
    }
}
ZodMap.create = (keyType, valueType, params) => {
    return new ZodMap({
        valueType,
        keyType,
        typeName: ZodFirstPartyTypeKind.ZodMap,
        ...processCreateParams(params),
    });
};
class ZodSet extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.set) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.set,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const def = this._def;
        if (def.minSize !== null) {
            if (ctx.data.size < def.minSize.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_small,
                    minimum: def.minSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.minSize.message,
                });
                status.dirty();
            }
        }
        if (def.maxSize !== null) {
            if (ctx.data.size > def.maxSize.value) {
                addIssueToContext(ctx, {
                    code: ZodIssueCode.too_big,
                    maximum: def.maxSize.value,
                    type: "set",
                    inclusive: true,
                    exact: false,
                    message: def.maxSize.message,
                });
                status.dirty();
            }
        }
        const valueType = this._def.valueType;
        function finalizeSet(elements) {
            const parsedSet = new Set();
            for (const element of elements) {
                if (element.status === "aborted")
                    return INVALID;
                if (element.status === "dirty")
                    status.dirty();
                parsedSet.add(element.value);
            }
            return { status: status.value, value: parsedSet };
        }
        const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
        if (ctx.common.async) {
            return Promise.all(elements).then((elements) => finalizeSet(elements));
        }
        else {
            return finalizeSet(elements);
        }
    }
    min(minSize, message) {
        return new ZodSet({
            ...this._def,
            minSize: { value: minSize, message: errorUtil.toString(message) },
        });
    }
    max(maxSize, message) {
        return new ZodSet({
            ...this._def,
            maxSize: { value: maxSize, message: errorUtil.toString(message) },
        });
    }
    size(size, message) {
        return this.min(size, message).max(size, message);
    }
    nonempty(message) {
        return this.min(1, message);
    }
}
ZodSet.create = (valueType, params) => {
    return new ZodSet({
        valueType,
        minSize: null,
        maxSize: null,
        typeName: ZodFirstPartyTypeKind.ZodSet,
        ...processCreateParams(params),
    });
};
class ZodFunction extends ZodType {
    constructor() {
        super(...arguments);
        this.validate = this.implement;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.function) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.function,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        function makeArgsIssue(args, error) {
            return makeIssue({
                data: args,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    getErrorMap(),
                    errorMap,
                ].filter((x) => !!x),
                issueData: {
                    code: ZodIssueCode.invalid_arguments,
                    argumentsError: error,
                },
            });
        }
        function makeReturnsIssue(returns, error) {
            return makeIssue({
                data: returns,
                path: ctx.path,
                errorMaps: [
                    ctx.common.contextualErrorMap,
                    ctx.schemaErrorMap,
                    getErrorMap(),
                    errorMap,
                ].filter((x) => !!x),
                issueData: {
                    code: ZodIssueCode.invalid_return_type,
                    returnTypeError: error,
                },
            });
        }
        const params = { errorMap: ctx.common.contextualErrorMap };
        const fn = ctx.data;
        if (this._def.returns instanceof ZodPromise) {
            return OK(async (...args) => {
                const error = new ZodError([]);
                const parsedArgs = await this._def.args
                    .parseAsync(args, params)
                    .catch((e) => {
                    error.addIssue(makeArgsIssue(args, e));
                    throw error;
                });
                const result = await fn(...parsedArgs);
                const parsedReturns = await this._def.returns._def.type
                    .parseAsync(result, params)
                    .catch((e) => {
                    error.addIssue(makeReturnsIssue(result, e));
                    throw error;
                });
                return parsedReturns;
            });
        }
        else {
            return OK((...args) => {
                const parsedArgs = this._def.args.safeParse(args, params);
                if (!parsedArgs.success) {
                    throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
                }
                const result = fn(...parsedArgs.data);
                const parsedReturns = this._def.returns.safeParse(result, params);
                if (!parsedReturns.success) {
                    throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
                }
                return parsedReturns.data;
            });
        }
    }
    parameters() {
        return this._def.args;
    }
    returnType() {
        return this._def.returns;
    }
    args(...items) {
        return new ZodFunction({
            ...this._def,
            args: ZodTuple.create(items).rest(ZodUnknown.create()),
        });
    }
    returns(returnType) {
        return new ZodFunction({
            ...this._def,
            returns: returnType,
        });
    }
    implement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    strictImplement(func) {
        const validatedFunc = this.parse(func);
        return validatedFunc;
    }
    static create(args, returns, params) {
        return new ZodFunction({
            args: (args
                ? args
                : ZodTuple.create([]).rest(ZodUnknown.create())),
            returns: returns || ZodUnknown.create(),
            typeName: ZodFirstPartyTypeKind.ZodFunction,
            ...processCreateParams(params),
        });
    }
}
class ZodLazy extends ZodType {
    get schema() {
        return this._def.getter();
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const lazySchema = this._def.getter();
        return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
    }
}
ZodLazy.create = (getter, params) => {
    return new ZodLazy({
        getter: getter,
        typeName: ZodFirstPartyTypeKind.ZodLazy,
        ...processCreateParams(params),
    });
};
class ZodLiteral extends ZodType {
    _parse(input) {
        if (input.data !== this._def.value) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_literal,
                expected: this._def.value,
            });
            return INVALID;
        }
        return { status: "valid", value: input.data };
    }
    get value() {
        return this._def.value;
    }
}
ZodLiteral.create = (value, params) => {
    return new ZodLiteral({
        value: value,
        typeName: ZodFirstPartyTypeKind.ZodLiteral,
        ...processCreateParams(params),
    });
};
function createZodEnum(values, params) {
    return new ZodEnum({
        values: values,
        typeName: ZodFirstPartyTypeKind.ZodEnum,
        ...processCreateParams(params),
    });
}
class ZodEnum extends ZodType {
    _parse(input) {
        if (typeof input.data !== "string") {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
                expected: util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodIssueCode.invalid_type,
            });
            return INVALID;
        }
        if (this._def.values.indexOf(input.data) === -1) {
            const ctx = this._getOrReturnCtx(input);
            const expectedValues = this._def.values;
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return INVALID;
        }
        return OK(input.data);
    }
    get options() {
        return this._def.values;
    }
    get enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Values() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    get Enum() {
        const enumValues = {};
        for (const val of this._def.values) {
            enumValues[val] = val;
        }
        return enumValues;
    }
    extract(values) {
        return ZodEnum.create(values);
    }
    exclude(values) {
        return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)));
    }
}
ZodEnum.create = createZodEnum;
class ZodNativeEnum extends ZodType {
    _parse(input) {
        const nativeEnumValues = util.getValidEnumValues(this._def.values);
        const ctx = this._getOrReturnCtx(input);
        if (ctx.parsedType !== ZodParsedType.string &&
            ctx.parsedType !== ZodParsedType.number) {
            const expectedValues = util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
                expected: util.joinValues(expectedValues),
                received: ctx.parsedType,
                code: ZodIssueCode.invalid_type,
            });
            return INVALID;
        }
        if (nativeEnumValues.indexOf(input.data) === -1) {
            const expectedValues = util.objectValues(nativeEnumValues);
            addIssueToContext(ctx, {
                received: ctx.data,
                code: ZodIssueCode.invalid_enum_value,
                options: expectedValues,
            });
            return INVALID;
        }
        return OK(input.data);
    }
    get enum() {
        return this._def.values;
    }
}
ZodNativeEnum.create = (values, params) => {
    return new ZodNativeEnum({
        values: values,
        typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
        ...processCreateParams(params),
    });
};
class ZodPromise extends ZodType {
    unwrap() {
        return this._def.type;
    }
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        if (ctx.parsedType !== ZodParsedType.promise &&
            ctx.common.async === false) {
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.promise,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        const promisified = ctx.parsedType === ZodParsedType.promise
            ? ctx.data
            : Promise.resolve(ctx.data);
        return OK(promisified.then((data) => {
            return this._def.type.parseAsync(data, {
                path: ctx.path,
                errorMap: ctx.common.contextualErrorMap,
            });
        }));
    }
}
ZodPromise.create = (schema, params) => {
    return new ZodPromise({
        type: schema,
        typeName: ZodFirstPartyTypeKind.ZodPromise,
        ...processCreateParams(params),
    });
};
class ZodEffects extends ZodType {
    innerType() {
        return this._def.schema;
    }
    sourceType() {
        return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects
            ? this._def.schema.sourceType()
            : this._def.schema;
    }
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        const effect = this._def.effect || null;
        if (effect.type === "preprocess") {
            const processed = effect.transform(ctx.data);
            if (ctx.common.async) {
                return Promise.resolve(processed).then((processed) => {
                    return this._def.schema._parseAsync({
                        data: processed,
                        path: ctx.path,
                        parent: ctx,
                    });
                });
            }
            else {
                return this._def.schema._parseSync({
                    data: processed,
                    path: ctx.path,
                    parent: ctx,
                });
            }
        }
        const checkCtx = {
            addIssue: (arg) => {
                addIssueToContext(ctx, arg);
                if (arg.fatal) {
                    status.abort();
                }
                else {
                    status.dirty();
                }
            },
            get path() {
                return ctx.path;
            },
        };
        checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
        if (effect.type === "refinement") {
            const executeRefinement = (acc
            // effect: RefinementEffect<any>
            ) => {
                const result = effect.refinement(acc, checkCtx);
                if (ctx.common.async) {
                    return Promise.resolve(result);
                }
                if (result instanceof Promise) {
                    throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
                }
                return acc;
            };
            if (ctx.common.async === false) {
                const inner = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inner.status === "aborted")
                    return INVALID;
                if (inner.status === "dirty")
                    status.dirty();
                // return value is ignored
                executeRefinement(inner.value);
                return { status: status.value, value: inner.value };
            }
            else {
                return this._def.schema
                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                    .then((inner) => {
                    if (inner.status === "aborted")
                        return INVALID;
                    if (inner.status === "dirty")
                        status.dirty();
                    return executeRefinement(inner.value).then(() => {
                        return { status: status.value, value: inner.value };
                    });
                });
            }
        }
        if (effect.type === "transform") {
            if (ctx.common.async === false) {
                const base = this._def.schema._parseSync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (!isValid(base))
                    return base;
                const result = effect.transform(base.value, checkCtx);
                if (result instanceof Promise) {
                    throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
                }
                return { status: status.value, value: result };
            }
            else {
                return this._def.schema
                    ._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx })
                    .then((base) => {
                    if (!isValid(base))
                        return base;
                    return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
                });
            }
        }
        util.assertNever(effect);
    }
}
ZodEffects.create = (schema, effect, params) => {
    return new ZodEffects({
        schema,
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        effect,
        ...processCreateParams(params),
    });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
    return new ZodEffects({
        schema,
        effect: { type: "preprocess", transform: preprocess },
        typeName: ZodFirstPartyTypeKind.ZodEffects,
        ...processCreateParams(params),
    });
};
class ZodOptional extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.undefined) {
            return OK(undefined);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodOptional.create = (type, params) => {
    return new ZodOptional({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodOptional,
        ...processCreateParams(params),
    });
};
class ZodNullable extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType === ZodParsedType.null) {
            return OK(null);
        }
        return this._def.innerType._parse(input);
    }
    unwrap() {
        return this._def.innerType;
    }
}
ZodNullable.create = (type, params) => {
    return new ZodNullable({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodNullable,
        ...processCreateParams(params),
    });
};
class ZodDefault extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        let data = ctx.data;
        if (ctx.parsedType === ZodParsedType.undefined) {
            data = this._def.defaultValue();
        }
        return this._def.innerType._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    removeDefault() {
        return this._def.innerType;
    }
}
ZodDefault.create = (type, params) => {
    return new ZodDefault({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodDefault,
        defaultValue: typeof params.default === "function"
            ? params.default
            : () => params.default,
        ...processCreateParams(params),
    });
};
class ZodCatch extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        // newCtx is used to not collect issues from inner types in ctx
        const newCtx = {
            ...ctx,
            common: {
                ...ctx.common,
                issues: [],
            },
        };
        const result = this._def.innerType._parse({
            data: newCtx.data,
            path: newCtx.path,
            parent: {
                ...newCtx,
            },
        });
        if (isAsync(result)) {
            return result.then((result) => {
                return {
                    status: "valid",
                    value: result.status === "valid"
                        ? result.value
                        : this._def.catchValue({
                            get error() {
                                return new ZodError(newCtx.common.issues);
                            },
                            input: newCtx.data,
                        }),
                };
            });
        }
        else {
            return {
                status: "valid",
                value: result.status === "valid"
                    ? result.value
                    : this._def.catchValue({
                        get error() {
                            return new ZodError(newCtx.common.issues);
                        },
                        input: newCtx.data,
                    }),
            };
        }
    }
    removeCatch() {
        return this._def.innerType;
    }
}
ZodCatch.create = (type, params) => {
    return new ZodCatch({
        innerType: type,
        typeName: ZodFirstPartyTypeKind.ZodCatch,
        catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
        ...processCreateParams(params),
    });
};
class ZodNaN extends ZodType {
    _parse(input) {
        const parsedType = this._getType(input);
        if (parsedType !== ZodParsedType.nan) {
            const ctx = this._getOrReturnCtx(input);
            addIssueToContext(ctx, {
                code: ZodIssueCode.invalid_type,
                expected: ZodParsedType.nan,
                received: ctx.parsedType,
            });
            return INVALID;
        }
        return { status: "valid", value: input.data };
    }
}
ZodNaN.create = (params) => {
    return new ZodNaN({
        typeName: ZodFirstPartyTypeKind.ZodNaN,
        ...processCreateParams(params),
    });
};
const BRAND = Symbol("zod_brand");
class ZodBranded extends ZodType {
    _parse(input) {
        const { ctx } = this._processInputParams(input);
        const data = ctx.data;
        return this._def.type._parse({
            data,
            path: ctx.path,
            parent: ctx,
        });
    }
    unwrap() {
        return this._def.type;
    }
}
class ZodPipeline extends ZodType {
    _parse(input) {
        const { status, ctx } = this._processInputParams(input);
        if (ctx.common.async) {
            const handleAsync = async () => {
                const inResult = await this._def.in._parseAsync({
                    data: ctx.data,
                    path: ctx.path,
                    parent: ctx,
                });
                if (inResult.status === "aborted")
                    return INVALID;
                if (inResult.status === "dirty") {
                    status.dirty();
                    return DIRTY(inResult.value);
                }
                else {
                    return this._def.out._parseAsync({
                        data: inResult.value,
                        path: ctx.path,
                        parent: ctx,
                    });
                }
            };
            return handleAsync();
        }
        else {
            const inResult = this._def.in._parseSync({
                data: ctx.data,
                path: ctx.path,
                parent: ctx,
            });
            if (inResult.status === "aborted")
                return INVALID;
            if (inResult.status === "dirty") {
                status.dirty();
                return {
                    status: "dirty",
                    value: inResult.value,
                };
            }
            else {
                return this._def.out._parseSync({
                    data: inResult.value,
                    path: ctx.path,
                    parent: ctx,
                });
            }
        }
    }
    static create(a, b) {
        return new ZodPipeline({
            in: a,
            out: b,
            typeName: ZodFirstPartyTypeKind.ZodPipeline,
        });
    }
}
const custom = (check, params = {}, 
/*
 * @deprecated
 *
 * Pass `fatal` into the params object instead:
 *
 * ```ts
 * z.string().custom((val) => val.length > 5, { fatal: false })
 * ```
 *
 */
fatal) => {
    if (check)
        return ZodAny.create().superRefine((data, ctx) => {
            var _a, _b;
            if (!check(data)) {
                const p = typeof params === "function"
                    ? params(data)
                    : typeof params === "string"
                        ? { message: params }
                        : params;
                const _fatal = (_b = (_a = p.fatal) !== null && _a !== void 0 ? _a : fatal) !== null && _b !== void 0 ? _b : true;
                const p2 = typeof p === "string" ? { message: p } : p;
                ctx.addIssue({ code: "custom", ...p2, fatal: _fatal });
            }
        });
    return ZodAny.create();
};
const late = {
    object: ZodObject.lazycreate,
};
var ZodFirstPartyTypeKind;
(function (ZodFirstPartyTypeKind) {
    ZodFirstPartyTypeKind["ZodString"] = "ZodString";
    ZodFirstPartyTypeKind["ZodNumber"] = "ZodNumber";
    ZodFirstPartyTypeKind["ZodNaN"] = "ZodNaN";
    ZodFirstPartyTypeKind["ZodBigInt"] = "ZodBigInt";
    ZodFirstPartyTypeKind["ZodBoolean"] = "ZodBoolean";
    ZodFirstPartyTypeKind["ZodDate"] = "ZodDate";
    ZodFirstPartyTypeKind["ZodSymbol"] = "ZodSymbol";
    ZodFirstPartyTypeKind["ZodUndefined"] = "ZodUndefined";
    ZodFirstPartyTypeKind["ZodNull"] = "ZodNull";
    ZodFirstPartyTypeKind["ZodAny"] = "ZodAny";
    ZodFirstPartyTypeKind["ZodUnknown"] = "ZodUnknown";
    ZodFirstPartyTypeKind["ZodNever"] = "ZodNever";
    ZodFirstPartyTypeKind["ZodVoid"] = "ZodVoid";
    ZodFirstPartyTypeKind["ZodArray"] = "ZodArray";
    ZodFirstPartyTypeKind["ZodObject"] = "ZodObject";
    ZodFirstPartyTypeKind["ZodUnion"] = "ZodUnion";
    ZodFirstPartyTypeKind["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
    ZodFirstPartyTypeKind["ZodIntersection"] = "ZodIntersection";
    ZodFirstPartyTypeKind["ZodTuple"] = "ZodTuple";
    ZodFirstPartyTypeKind["ZodRecord"] = "ZodRecord";
    ZodFirstPartyTypeKind["ZodMap"] = "ZodMap";
    ZodFirstPartyTypeKind["ZodSet"] = "ZodSet";
    ZodFirstPartyTypeKind["ZodFunction"] = "ZodFunction";
    ZodFirstPartyTypeKind["ZodLazy"] = "ZodLazy";
    ZodFirstPartyTypeKind["ZodLiteral"] = "ZodLiteral";
    ZodFirstPartyTypeKind["ZodEnum"] = "ZodEnum";
    ZodFirstPartyTypeKind["ZodEffects"] = "ZodEffects";
    ZodFirstPartyTypeKind["ZodNativeEnum"] = "ZodNativeEnum";
    ZodFirstPartyTypeKind["ZodOptional"] = "ZodOptional";
    ZodFirstPartyTypeKind["ZodNullable"] = "ZodNullable";
    ZodFirstPartyTypeKind["ZodDefault"] = "ZodDefault";
    ZodFirstPartyTypeKind["ZodCatch"] = "ZodCatch";
    ZodFirstPartyTypeKind["ZodPromise"] = "ZodPromise";
    ZodFirstPartyTypeKind["ZodBranded"] = "ZodBranded";
    ZodFirstPartyTypeKind["ZodPipeline"] = "ZodPipeline";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
const instanceOfType = (
// const instanceOfType = <T extends new (...args: any[]) => any>(
cls, params = {
    message: `Input not instance of ${cls.name}`,
}) => custom((data) => data instanceof cls, params);
const stringType = ZodString.create;
const numberType = ZodNumber.create;
const nanType = ZodNaN.create;
const bigIntType = ZodBigInt.create;
const booleanType = ZodBoolean.create;
const dateType = ZodDate.create;
const symbolType = ZodSymbol.create;
const undefinedType = ZodUndefined.create;
const nullType = ZodNull.create;
const anyType = ZodAny.create;
const unknownType = ZodUnknown.create;
const neverType = ZodNever.create;
const voidType = ZodVoid.create;
const arrayType = ZodArray.create;
const objectType = ZodObject.create;
const strictObjectType = ZodObject.strictCreate;
const unionType = ZodUnion.create;
const discriminatedUnionType = ZodDiscriminatedUnion.create;
const intersectionType = ZodIntersection.create;
const tupleType = ZodTuple.create;
const recordType = ZodRecord.create;
const mapType = ZodMap.create;
const setType = ZodSet.create;
const functionType = ZodFunction.create;
const lazyType = ZodLazy.create;
const literalType = ZodLiteral.create;
const enumType = ZodEnum.create;
const nativeEnumType = ZodNativeEnum.create;
const promiseType = ZodPromise.create;
const effectsType = ZodEffects.create;
const optionalType = ZodOptional.create;
const nullableType = ZodNullable.create;
const preprocessType = ZodEffects.createWithPreprocess;
const pipelineType = ZodPipeline.create;
const ostring = () => stringType().optional();
const onumber = () => numberType().optional();
const oboolean = () => booleanType().optional();
const coerce = {
    string: ((arg) => ZodString.create({ ...arg, coerce: true })),
    number: ((arg) => ZodNumber.create({ ...arg, coerce: true })),
    boolean: ((arg) => ZodBoolean.create({
        ...arg,
        coerce: true,
    })),
    bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
    date: ((arg) => ZodDate.create({ ...arg, coerce: true })),
};
const NEVER = INVALID;

var z = /*#__PURE__*/Object.freeze({
    __proto__: null,
    defaultErrorMap: errorMap,
    setErrorMap: setErrorMap,
    getErrorMap: getErrorMap,
    makeIssue: makeIssue,
    EMPTY_PATH: EMPTY_PATH,
    addIssueToContext: addIssueToContext,
    ParseStatus: ParseStatus,
    INVALID: INVALID,
    DIRTY: DIRTY,
    OK: OK,
    isAborted: isAborted,
    isDirty: isDirty,
    isValid: isValid,
    isAsync: isAsync,
    get util () { return util; },
    get objectUtil () { return objectUtil; },
    ZodParsedType: ZodParsedType,
    getParsedType: getParsedType,
    ZodType: ZodType,
    ZodString: ZodString,
    ZodNumber: ZodNumber,
    ZodBigInt: ZodBigInt,
    ZodBoolean: ZodBoolean,
    ZodDate: ZodDate,
    ZodSymbol: ZodSymbol,
    ZodUndefined: ZodUndefined,
    ZodNull: ZodNull,
    ZodAny: ZodAny,
    ZodUnknown: ZodUnknown,
    ZodNever: ZodNever,
    ZodVoid: ZodVoid,
    ZodArray: ZodArray,
    ZodObject: ZodObject,
    ZodUnion: ZodUnion,
    ZodDiscriminatedUnion: ZodDiscriminatedUnion,
    ZodIntersection: ZodIntersection,
    ZodTuple: ZodTuple,
    ZodRecord: ZodRecord,
    ZodMap: ZodMap,
    ZodSet: ZodSet,
    ZodFunction: ZodFunction,
    ZodLazy: ZodLazy,
    ZodLiteral: ZodLiteral,
    ZodEnum: ZodEnum,
    ZodNativeEnum: ZodNativeEnum,
    ZodPromise: ZodPromise,
    ZodEffects: ZodEffects,
    ZodTransformer: ZodEffects,
    ZodOptional: ZodOptional,
    ZodNullable: ZodNullable,
    ZodDefault: ZodDefault,
    ZodCatch: ZodCatch,
    ZodNaN: ZodNaN,
    BRAND: BRAND,
    ZodBranded: ZodBranded,
    ZodPipeline: ZodPipeline,
    custom: custom,
    Schema: ZodType,
    ZodSchema: ZodType,
    late: late,
    get ZodFirstPartyTypeKind () { return ZodFirstPartyTypeKind; },
    coerce: coerce,
    any: anyType,
    array: arrayType,
    bigint: bigIntType,
    boolean: booleanType,
    date: dateType,
    discriminatedUnion: discriminatedUnionType,
    effect: effectsType,
    'enum': enumType,
    'function': functionType,
    'instanceof': instanceOfType,
    intersection: intersectionType,
    lazy: lazyType,
    literal: literalType,
    map: mapType,
    nan: nanType,
    nativeEnum: nativeEnumType,
    never: neverType,
    'null': nullType,
    nullable: nullableType,
    number: numberType,
    object: objectType,
    oboolean: oboolean,
    onumber: onumber,
    optional: optionalType,
    ostring: ostring,
    pipeline: pipelineType,
    preprocess: preprocessType,
    promise: promiseType,
    record: recordType,
    set: setType,
    strictObject: strictObjectType,
    string: stringType,
    symbol: symbolType,
    transformer: effectsType,
    tuple: tupleType,
    'undefined': undefinedType,
    union: unionType,
    unknown: unknownType,
    'void': voidType,
    NEVER: NEVER,
    ZodIssueCode: ZodIssueCode,
    quotelessJson: quotelessJson,
    ZodError: ZodError
});




/***/ }),

/***/ "./extras/modules/admin-customizer/admin-customizer.ts":
/*!*************************************************************!*\
  !*** ./extras/modules/admin-customizer/admin-customizer.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmeAdminCustomizer": () => (/* binding */ AmeAdminCustomizer)
/* harmony export */ });
/* harmony import */ var _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../pro-customizables/assets/customizable.js */ "./extras/pro-customizables/assets/customizable.js");
/* harmony import */ var _pro_customizables_ko_components_ame_components_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../pro-customizables/ko-components/ame-components.js */ "./extras/pro-customizables/ko-components/ame-components.js");
/* harmony import */ var _ko_components_ame_ac_structure_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ko-components/ame-ac-structure.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-structure.js");
/* harmony import */ var _ko_components_ame_ac_section_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ko-components/ame-ac-section.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-section.js");
/* harmony import */ var _ko_components_ame_ac_section_link_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ko-components/ame-ac-section-link.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-section-link.js");
/* harmony import */ var _ko_components_ame_ac_control_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ko-components/ame-ac-control.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-control.js");
/* harmony import */ var _ko_components_ame_ac_control_group_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ko-components/ame-ac-control-group.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-control-group.js");
/* harmony import */ var _ko_components_ame_ac_content_section_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ko-components/ame-ac-content-section.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-content-section.js");
/* harmony import */ var _admin_customizer_base_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./admin-customizer-base.js */ "./extras/modules/admin-customizer/admin-customizer-base.js");
/* harmony import */ var _ko_components_ame_ac_separator_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ko-components/ame-ac-separator.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-separator.js");
/* harmony import */ var _ko_components_ame_ac_validation_errors_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ko-components/ame-ac-validation-errors.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-validation-errors.js");
/* harmony import */ var _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../zod/lib/index.js */ "./extras/zod/lib/index.js");

/// <reference path="../../../js/common.d.ts" />
/// <reference types="@types/lodash" />
/// <reference path="../../jszip/jszip.d.ts" />












var AmeAdminCustomizer;
(function (AmeAdminCustomizer) {
    var SettingCollection = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_0__.AmeCustomizable.SettingCollection;
    var unserializeUiElement = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_0__.AmeCustomizable.unserializeUiElement;
    var unserializeSetting = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_0__.AmeCustomizable.unserializeSetting;
    const $ = jQuery;
    const _ = wsAmeLodash;
    (0,_pro_customizables_ko_components_ame_components_js__WEBPACK_IMPORTED_MODULE_1__.registerBaseComponents)();
    ko.components.register('ame-ac-structure', _ko_components_ame_ac_structure_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
    ko.components.register('ame-ac-section', _ko_components_ame_ac_section_js__WEBPACK_IMPORTED_MODULE_3__["default"]);
    ko.components.register('ame-ac-section-link', _ko_components_ame_ac_section_link_js__WEBPACK_IMPORTED_MODULE_4__["default"]);
    ko.components.register('ame-ac-content-section', _ko_components_ame_ac_content_section_js__WEBPACK_IMPORTED_MODULE_7__["default"]);
    ko.components.register('ame-ac-control-group', _ko_components_ame_ac_control_group_js__WEBPACK_IMPORTED_MODULE_6__["default"]);
    ko.components.register('ame-ac-control', _ko_components_ame_ac_control_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
    ko.components.register('ame-ac-separator', _ko_components_ame_ac_separator_js__WEBPACK_IMPORTED_MODULE_9__["default"]);
    ko.components.register('ame-ac-validation-errors', _ko_components_ame_ac_validation_errors_js__WEBPACK_IMPORTED_MODULE_10__["default"]);
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery && reducedMotionQuery.matches;
    reducedMotionQuery.addEventListener('change', () => {
        prefersReducedMotion = reducedMotionQuery.matches;
    });
    class CustomizerSettingsCollection extends SettingCollection {
        constructor(ajaxUrl, saveChangesetNonce, trashChangesetNonce, changesetName, changesetItemCount = 0, changesetStatus = null) {
            super();
            this.ajaxUrl = ajaxUrl;
            this.saveChangesetNonce = saveChangesetNonce;
            this.trashChangesetNonce = trashChangesetNonce;
            /**
             * Settings that have changed since the last save attempt.
             */
            this.pendingSettings = {};
            /**
             * Settings that in the process of being sent to the server to be saved.
             * They might not be saved yet.
             */
            this.sentSettings = {};
            this.currentChangesetRequest = null;
            this.saveTriggerTimeoutId = null;
            this.underlyingMetadata = ko.observable(null);
            this.metadataHasChanged = ko.observable(false);
            this.exclusiveOperation = ko.observable(false);
            const self = this;
            this.currentChangeset = ko.observable(new Changeset(changesetName, changesetItemCount, changesetStatus));
            this.changesetName = ko.pureComputed(() => {
                var _a;
                return ((_a = self.currentChangeset()) === null || _a === void 0 ? void 0 : _a.name()) || '';
            });
            this.adminThemeMetadata = ko.computed({
                read: () => this.underlyingMetadata(),
                write: (newValue) => {
                    const oldValue = this.underlyingMetadata.peek();
                    if (!_.isEqual(newValue, oldValue)) {
                        this.underlyingMetadata(newValue);
                        this.metadataHasChanged(true);
                    }
                }
            });
            //Automatically save the changeset when any settings change.
            const totalChangeCount = ko.pureComputed(() => {
                const changeset = self.currentChangeset();
                return (changeset ? changeset.currentSessionChanges() : 0);
            });
            const debouncedSaveTrigger = _.debounce(() => {
                //Only save if there are changes. This may look like a duplicate check,
                //but it's not: the totalChangeCount() may change between the time
                //the debounced function is called and the time this code is executed.
                //
                //Also save if the metadata has changed, but only if the changeset
                //is not empty. Saving a changeset with only metadata is not useful.
                if ((totalChangeCount() > 0)
                    || (this.metadataHasChanged() && this.currentChangeset().isNonEmpty())) {
                    self.queueChangesetUpdate();
                }
            }, 3000, { leading: true, trailing: true });
            totalChangeCount.subscribe((counter) => {
                if (counter > 0) {
                    debouncedSaveTrigger();
                }
            });
            //Also save when theme metadata changes.
            this.metadataHasChanged.subscribe((hasChanged) => {
                if (hasChanged) {
                    debouncedSaveTrigger();
                }
            });
            this.isExclusiveOperationInProgress = ko.pureComputed(() => {
                return self.exclusiveOperation();
            });
            //Keep track of unsaved changes and changesets.
            this.addChangeListener((setting) => {
                this.pendingSettings[setting.id] = setting;
                let changeset = this.currentChangeset();
                //If the current changeset cannot be modified, create a new one
                //for the changed setting(s).
                if (!(changeset === null || changeset === void 0 ? void 0 : changeset.canBeModified())) {
                    changeset = new Changeset();
                    this.currentChangeset(changeset);
                }
                //Track the number of changes in the current session.
                changeset.currentSessionChanges(changeset.currentSessionChanges() + 1);
            });
        }
        queueChangesetUpdate(delay = 0) {
            if (delay > 0) {
                if (this.saveTriggerTimeoutId !== null) {
                    //Replace the existing timeout with a new one.
                    clearTimeout(this.saveTriggerTimeoutId);
                }
                this.saveTriggerTimeoutId = setTimeout(() => {
                    this.saveTriggerTimeoutId = null;
                    this.queueChangesetUpdate(0);
                }, delay);
                return;
            }
            if (this.saveTriggerTimeoutId !== null) {
                return; //Another timeout is already waiting.
            }
            if (this.currentChangesetRequest !== null) {
                //There's an in-progress request, so wait until it's done.
                this.currentChangesetRequest.always(() => {
                    //Wait a bit to avoid hammering the server.
                    this.queueChangesetUpdate(1000);
                });
                return;
            }
            this.saveChangeset();
        }
        saveChangeset(status = null) {
            var _a;
            //Do nothing if there are no changes.
            if (_.isEmpty(this.pendingSettings) && (status === null) && !this.metadataHasChanged()) {
                return $.Deferred().reject(new Error('There are no changes to save.')).promise();
            }
            if (this.isExclusiveOperationInProgress()) {
                return $.Deferred().reject(new Error('Another exclusive changeset operation is in progress.')).promise();
            }
            let isExclusiveRequest = (status === 'publish') || (status === 'trash');
            if (isExclusiveRequest) {
                this.exclusiveOperation(true);
            }
            const savedChangeset = this.currentChangeset();
            //Keep a local copy of the settings in case something changes instance
            //properties while the request is in progress (should never happen).
            const settingsToSend = this.pendingSettings;
            this.sentSettings = settingsToSend;
            this.pendingSettings = {};
            const modifiedSettings = _.mapValues(settingsToSend, setting => setting.value());
            const requestData = {
                action: 'ws_ame_ac_save_changeset',
                _ajax_nonce: this.saveChangesetNonce,
                changeset: (_a = (savedChangeset === null || savedChangeset === void 0 ? void 0 : savedChangeset.name())) !== null && _a !== void 0 ? _a : '',
                modified: JSON.stringify(modifiedSettings),
            };
            if (status !== null) {
                requestData['status'] = status;
            }
            //If the changeset doesn't have a name, it is new.
            if (!(savedChangeset === null || savedChangeset === void 0 ? void 0 : savedChangeset.hasName())) {
                requestData['createNew'] = 1;
            }
            //Also send the metadata if it has changed.
            const metadataWasChanged = this.metadataHasChanged();
            if (metadataWasChanged) {
                const metadata = this.adminThemeMetadata();
                requestData['adminThemeMetadata'] = JSON.stringify(metadata);
            }
            this.metadataHasChanged(false);
            const request = $.ajax({
                url: this.ajaxUrl,
                method: 'POST',
                data: requestData,
                dataType: 'json',
                timeout: 20000,
            });
            this.currentChangesetRequest = request;
            const self = this;
            function storeValidationResultsFrom(serverResponse) {
                const results = _.get(serverResponse, ['data', 'validationResults']);
                if (typeof results !== 'object') {
                    return;
                }
                for (const settingId in results) {
                    const setting = self.get(settingId);
                    if (!setting.isDefined()) {
                        continue;
                    }
                    if (!modifiedSettings.hasOwnProperty(settingId)) {
                        continue;
                    }
                    const sentValue = modifiedSettings[settingId];
                    const state = results[settingId];
                    if (state.isValid) {
                        setting.get().clearValidationErrorsForValue(sentValue);
                    }
                    else {
                        //Since the server response is not fully validated, some typeof checks
                        //are still useful.
                        // noinspection SuspiciousTypeOfGuard
                        setting.get().addValidationErrorsForValue(sentValue, _.filter(state.errors, error => (typeof error.message === 'string')));
                    }
                }
            }
            function storeChangesetDetailsFrom(serverResponse) {
                if (!savedChangeset) {
                    return;
                }
                //Store the returned changeset name in case a new changeset was created
                //or an existing changeset was forked due to permissions.
                const newName = _.get(serverResponse, ['data', 'changeset']);
                if (!savedChangeset.hasName() || (newName !== savedChangeset.name())) {
                    if (typeof newName === 'string') {
                        savedChangeset.name(newName);
                    }
                }
                //Store the changeset status.
                const newStatus = _.get(serverResponse, ['data', 'changesetStatus']);
                if (typeof newStatus === 'string') {
                    savedChangeset.status(newStatus);
                }
                //Store the number of changes in the changeset.
                const newChangeCount = _.get(serverResponse, ['data', 'changesetItemCount']);
                if (typeof newChangeCount === 'number') {
                    savedChangeset.knownItemCount(newChangeCount);
                }
                //Was the changeset published? Because changesets are typically moved
                //to trash after publishing, "status" might be "trash" instead of "publish",
                //but we still want to know if it was successfully published.
                const wasPublished = _.get(serverResponse, ['data', 'changesetWasPublished'], null);
                if (wasPublished) {
                    savedChangeset.wasPublished(wasPublished);
                }
            }
            request.done(function (response) {
                storeChangesetDetailsFrom(response);
                storeValidationResultsFrom(response);
                //After successfully publishing a changeset, it has no more
                //unsaved changes.
                const isPublished = (savedChangeset.status() === 'publish')
                    || (savedChangeset.status() === 'future')
                    || (savedChangeset.wasPublished());
                if (isPublished) {
                    savedChangeset.currentSessionChanges(0);
                }
                //After a changeset is published or trashed, it can no longer
                //be edited. We may be able to replace it with a new changeset
                //that was created on the server.
                if (!self.currentChangeset().canBeModified()) {
                    const nextChangeset = _.get(response, ['data', 'nextChangeset']);
                    if ((typeof nextChangeset === 'string') && (nextChangeset !== '')) {
                        self.currentChangeset(new Changeset(nextChangeset));
                    }
                }
            });
            request.fail((requestObject) => {
                if (typeof requestObject.responseJSON === 'object') {
                    storeValidationResultsFrom(requestObject.responseJSON);
                    storeChangesetDetailsFrom(requestObject.responseJSON);
                }
                //Add the unsaved settings back to the pending list.
                for (const id in settingsToSend) {
                    //Keep only settings that still exist.
                    if (this.get(id).isDefined()) {
                        this.pendingSettings[id] = settingsToSend[id];
                    }
                }
                //We don't automatically retry because the problem might be something
                //that doesn't get better on its own, like missing permissions.
            });
            request.always(() => {
                this.currentChangesetRequest = null;
                this.sentSettings = {};
                if (isExclusiveRequest) {
                    this.exclusiveOperation(false);
                }
            });
            return request;
        }
        savePendingSettings(timeout = 20) {
            if (this.isExclusiveOperationInProgress()) {
                //Wait for the exclusive operation to finish.
                const deferred = $.Deferred();
                const result = deferred.then(() => this.doSavePendingSettings());
                const startTime = Date.now();
                const timer = setInterval(() => {
                    if (!this.isExclusiveOperationInProgress()) {
                        clearInterval(timer);
                        deferred.resolve();
                    }
                    else if ((Date.now() - startTime) > timeout) {
                        clearInterval(timer);
                        deferred.reject(new Error('Exclusive operation timed out.'));
                    }
                }, 200);
                return result;
            }
            return this.doSavePendingSettings();
        }
        doSavePendingSettings() {
            //If there are no changes, we don't need to do anything.
            if (_.isEmpty(this.pendingSettings)) {
                return $.Deferred().resolve().promise();
            }
            return this.saveChangeset();
        }
        getCurrentChangeset() {
            return this.currentChangeset();
        }
        /**
         * Get any unsaved setting changes.
         *
         * @returns Object An object mapping setting IDs to their modified values.
         */
        get unsavedChanges() {
            //Include both pending settings and sent settings. Sent settings
            //might not be saved yet.
            let unsavedSettings = {};
            _.defaults(unsavedSettings, this.pendingSettings, this.sentSettings);
            return _.mapValues(unsavedSettings, setting => setting.value());
        }
        publishChangeset() {
            if (this.isExclusiveOperationInProgress()) {
                return $.Deferred()
                    .reject(new Error('Another exclusive changeset operation is already in progress.'))
                    .promise();
            }
            return this.saveChangeset('publish');
        }
        trashChangeset() {
            if (this.isExclusiveOperationInProgress()) {
                return $.Deferred()
                    .reject(new Error('Another exclusive changeset operation is already in progress.'))
                    .promise();
            }
            const changeset = this.currentChangeset();
            if (!changeset.hasName()) {
                //The changeset hasn't been saved yet, so we can just mark it as trashed.
                changeset.status('trash');
                changeset.currentSessionChanges(0);
                //It's a success of sorts.
                return $.Deferred().resolve(true).promise();
            }
            this.exclusiveOperation(true);
            const requestData = {
                action: 'ws_ame_ac_trash_changeset',
                _ajax_nonce: this.trashChangesetNonce,
                changeset: changeset.name
            };
            const request = $.ajax({
                url: this.ajaxUrl,
                method: 'POST',
                data: requestData,
                dataType: 'json',
                timeout: 20000,
            });
            this.currentChangesetRequest = request;
            request.done(function () {
                changeset.status('trash');
                changeset.currentSessionChanges(0);
            });
            //Unfortunately, jQuery doesn't seem to allow us to create a custom
            //error object and pass it to other handlers, so code that uses this
            //method will have to parse the error response itself.
            request.always(() => {
                this.currentChangesetRequest = null;
                this.exclusiveOperation(false);
            });
            return request;
        }
        addInitialThemeMetadata(metadata) {
            this.underlyingMetadata(metadata);
            this.metadataHasChanged(false);
        }
    }
    class Changeset {
        constructor(name = '', knownItemCount = 0, initialStatus = '') {
            /**
             * The number of times settings have been changed in this changeset
             * during the current customizer session.
             *
             * Note that this is not the same as the number settings in the changeset:
             * if the same setting is changed X times, this counter will increase by X,
             * but the changeset will still only have one entry for that setting.
             */
            this.currentSessionChanges = ko.observable(0);
            /**
             * Once a changeset has been published or deleted, its contents can't be modified any more.
             * @private
             */
            this.fixedContentStatuses = { 'publish': true, 'trash': true, 'future': true };
            this.wasPublished = ko.observable(false);
            this.name = ko.observable(name);
            this.name.subscribe((newName) => {
                //In theory, the type system should ensure that the name is always a string,
                //but that only works on the TS side. I've previously run into a bug where
                //a null value was sent from the server. Let's add a check here to make it
                //easier to spot bugs like that in the future.
                if ((typeof newName !== 'string')) {
                    throw new Error('Changeset name must always be a string, found ' + (typeof newName));
                }
            });
            this.knownItemCount = ko.observable(knownItemCount);
            this.status = ko.observable(initialStatus !== null && initialStatus !== void 0 ? initialStatus : '');
        }
        hasName() {
            const name = this.name();
            return (name !== '');
        }
        canBeModified() {
            return !this.fixedContentStatuses.hasOwnProperty(this.status());
        }
        isNonEmpty() {
            return (this.currentSessionChanges() > 0) || (this.knownItemCount() > 0);
        }
    }
    const TemporaryChangesetName = 'temporary000'; //Note: Must match the value used in PHP.
    //region Admin theme
    const UrlOrEmpty = _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].union([
        _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().url().max(1000),
        _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].literal('')
    ]);
    const AdminThemeMetadata = _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].object({
        pluginName: _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().max(100),
        shortDescription: _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().max(500),
        pluginSlug: _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().max(64).toLowerCase().default('')
            .refine(function (input) {
            //Only allow alphanumeric characters, underscores, and dashes.
            //Empty string is allowed.
            return /^[a-z0-9_-]*$/.test(input);
        }, { message: 'The slug can only contain letters (a-z), numbers, underscores, and dashes.' }),
        identifierPrefix: _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().max(20).optional(),
        pluginVersion: _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().default('1.0').optional(),
        pluginUrl: UrlOrEmpty.optional(),
        authorName: _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().max(100).optional(),
        authorUrl: UrlOrEmpty.optional(),
        requiredWpVersion: _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().max(30).default('4.7').optional(),
        testedWpVersion: _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().max(30).optional(),
        wasEverConfirmed: _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].boolean().default(false).optional(),
    });
    const AdminThemeSettings = _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].record(
    //Key type
    _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].string().min(1), 
    //Value type
    _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__["default"].any());
    class AdminThemeImportReport {
        constructor(fileName, metadata) {
            this.fileName = fileName;
            this.metadata = metadata;
            this.totalSettings = 0;
            this.importedSettings = 0;
            this.invalidSettings = 0;
            this.skippedSettings = 0;
            this.differentImportedSettings = 0;
            this.pluginName = metadata.pluginName || '(Unnamed)';
        }
    }
    function observableWithZodValidation(value, schema) {
        const underlyingObservable = ko.observable(value);
        const observable = ko.pureComputed({
            read: underlyingObservable,
            write: (newValue) => {
                const validationResult = schema.safeParse(newValue);
                if (validationResult.success) {
                    underlyingObservable(validationResult.data);
                    observable.ameZodValidationError(null);
                    observable.ameValidationErrors([]);
                }
                else {
                    observable.ameZodValidationError(validationResult.error);
                    //Convert Zod issues to ObservableValidationErrors.
                    observable.ameValidationErrors(validationResult.error.issues.map(issue => {
                        return {
                            code: issue.code,
                            message: issue.message
                        };
                    }));
                }
            }
        });
        observable.ameZodValidationError = ko.observable(null);
        observable.ameValidationErrors = ko.observable([]);
        observable.ameIsValid = ko.pureComputed(() => {
            const errors = observable.ameValidationErrors();
            return !errors || errors.length === 0;
        });
        return observable;
    }
    class ObservableThemeMetadata {
        constructor(metadata) {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j;
            this.pluginName = observableWithZodValidation(metadata.pluginName, AdminThemeMetadata.shape.pluginName);
            this.shortDescription = observableWithZodValidation(metadata.shortDescription, AdminThemeMetadata.shape.shortDescription);
            this.pluginSlug = observableWithZodValidation((_a = metadata.pluginSlug) !== null && _a !== void 0 ? _a : '', AdminThemeMetadata.shape.pluginSlug);
            this.identifierPrefix = observableWithZodValidation((_b = metadata.identifierPrefix) !== null && _b !== void 0 ? _b : '', AdminThemeMetadata.shape.identifierPrefix);
            this.pluginVersion = observableWithZodValidation((_c = metadata.pluginVersion) !== null && _c !== void 0 ? _c : '', AdminThemeMetadata.shape.pluginVersion);
            this.pluginUrl = observableWithZodValidation((_d = metadata.pluginUrl) !== null && _d !== void 0 ? _d : '', AdminThemeMetadata.shape.pluginUrl);
            this.authorName = observableWithZodValidation((_e = metadata.authorName) !== null && _e !== void 0 ? _e : '', AdminThemeMetadata.shape.authorName);
            this.authorUrl = observableWithZodValidation((_f = metadata.authorUrl) !== null && _f !== void 0 ? _f : '', AdminThemeMetadata.shape.authorUrl);
            this.requiredWpVersion = observableWithZodValidation((_g = metadata.requiredWpVersion) !== null && _g !== void 0 ? _g : '', AdminThemeMetadata.shape.requiredWpVersion);
            this.testedWpVersion = observableWithZodValidation((_h = metadata.testedWpVersion) !== null && _h !== void 0 ? _h : '', AdminThemeMetadata.shape.testedWpVersion);
            this.wasEverConfirmed = observableWithZodValidation((_j = metadata.wasEverConfirmed) !== null && _j !== void 0 ? _j : false, AdminThemeMetadata.shape.wasEverConfirmed);
        }
        toObject() {
            return {
                pluginName: this.pluginName(),
                shortDescription: this.shortDescription(),
                pluginSlug: this.pluginSlug(),
                identifierPrefix: this.identifierPrefix(),
                pluginVersion: this.pluginVersion(),
                pluginUrl: this.pluginUrl(),
                authorName: this.authorName(),
                authorUrl: this.authorUrl(),
                requiredWpVersion: this.requiredWpVersion(),
                testedWpVersion: this.testedWpVersion(),
                wasEverConfirmed: this.wasEverConfirmed()
            };
        }
        isValid() {
            //This seems really inelegant, but I can't think of a better way to do it.
            return this.pluginName.ameIsValid()
                && this.shortDescription.ameIsValid()
                && this.pluginSlug.ameIsValid()
                && this.identifierPrefix.ameIsValid()
                && this.pluginVersion.ameIsValid()
                && this.pluginUrl.ameIsValid()
                && this.authorName.ameIsValid()
                && this.authorUrl.ameIsValid()
                && this.requiredWpVersion.ameIsValid()
                && this.testedWpVersion.ameIsValid()
                && this.wasEverConfirmed.ameIsValid();
        }
    }
    let MetadataDialogMode;
    (function (MetadataDialogMode) {
        MetadataDialogMode[MetadataDialogMode["Download"] = 0] = "Download";
        MetadataDialogMode[MetadataDialogMode["Edit"] = 1] = "Edit";
    })(MetadataDialogMode || (MetadataDialogMode = {}));
    class DownloadThemeDialog extends AmeBaseKnockoutDialog {
        constructor(getChangesetName, savePendingChangesetData, metadataObservable, customAdminThemeTexts) {
            super();
            this.getChangesetName = getChangesetName;
            this.savePendingChangesetData = savePendingChangesetData;
            this.metadataObservable = metadataObservable;
            this.isOperationInProgress = ko.observable(false);
            this.mode = ko.observable(MetadataDialogMode.Download);
            this.autoCancelButton = true;
            this.advancedOptionsVisible = ko.observable(false);
            this.helpVisible = ko.observable(false);
            this.changesetName = ko.observable('');
            this.metadataJson = ko.observable('');
            this.downloadCookieName = ko.observable('');
            this.cleanupCurrentDownload = () => {
            };
            this.options.minWidth = 400;
            this.adminThemeTexts = Object.assign({
                generatorCreditPhrase: 'generated using the Admin Menu Editor Pro plugin.',
                standalonePluginNote: 'The result is a standalone plugin that you can use without Admin Menu Editor Pro.',
            }, customAdminThemeTexts);
            let initialMetadata = metadataObservable();
            if (initialMetadata === null) {
                initialMetadata = this.getSampleMetadata();
            }
            this.meta = ko.observable(new ObservableThemeMetadata(initialMetadata));
            this.confirmButtonLabel = ko.computed(() => {
                if (this.mode() === MetadataDialogMode.Download) {
                    return 'Download Admin Theme';
                }
                return 'OK';
            });
            this.isConfirmButtonEnabled = ko.computed(() => {
                if (this.isOperationInProgress()) {
                    return false;
                }
                if (getChangesetName() === '') {
                    //To generate an admin theme, the changeset must have already been saved.
                    return false;
                }
                return this.meta().isValid();
            });
            this.areFieldsEditable = ko.computed(() => {
                return !this.isOperationInProgress();
            });
            this.advancedOptionsToggleLabel = ko.pureComputed(() => {
                return this.advancedOptionsVisible() ? 'Fewer options' : 'More options';
            });
            this.helpToggleLabel = ko.pureComputed(() => {
                return this.helpVisible() ? 'Hide info' : 'How it works';
            });
            //Hide the help container in download mode.
            this.helpContainerVisible = ko.pureComputed(() => {
                return this.mode() === MetadataDialogMode.Download;
            });
            this.mode.subscribe((newMode) => {
                if (newMode === MetadataDialogMode.Download) {
                    this.title('Generate admin theme');
                }
                else if (newMode === MetadataDialogMode.Edit) {
                    this.title('Edit admin theme properties');
                }
            });
        }
        getSampleMetadata() {
            return AdminThemeMetadata.parse({
                pluginName: 'Custom Admin Theme',
                shortDescription: 'A custom admin theme ' + this.adminThemeTexts.generatorCreditPhrase,
                pluginVersion: '1.0',
            });
        }
        onOpen(event, ui) {
            let latestMetadata = this.metadataObservable();
            if (latestMetadata === null) {
                latestMetadata = this.getSampleMetadata();
            }
            this.meta(new ObservableThemeMetadata(latestMetadata));
        }
        toggleAdvancedOptions() {
            this.advancedOptionsVisible(!this.advancedOptionsVisible());
        }
        toggleHelp() {
            this.helpVisible(!this.helpVisible());
        }
        onConfirm(event) {
            if (!this.meta().isValid()) {
                //This should never happen because the confirm button is disabled
                //when the metadata is invalid.
                alert('Error: The admin theme details are not valid.');
                return;
            }
            const metadata = this.meta().toObject();
            metadata.wasEverConfirmed = true;
            this.metadataObservable(metadata);
            if (this.mode() === MetadataDialogMode.Edit) {
                //That's all we need to do in edit mode.
                this.isOpen(false);
                return;
            }
            this.triggerDownloadWithErrorReporting(metadata);
        }
        triggerDownloadWithErrorReporting(metadata) {
            if (this.isOperationInProgress()) {
                alert('Error: Another operation is already in progress.');
                return;
            }
            this.triggerDownload(metadata)
                .fail((error) => {
                if (error !== '') {
                    alert('Error: ' + error);
                }
            });
        }
        triggerDownload(metadata) {
            const deferred = $.Deferred();
            //Sanity checks.
            //Download mode still requires a saved changeset.
            const changesetName = this.getChangesetName();
            if (changesetName === '') {
                return deferred.reject('The changeset has not been saved yet (name is empty).').promise();
            }
            this.isOperationInProgress(true);
            const $form = $('#ame-ac-theme-download-request-form');
            const $frame = $('#ame-ac-theme-download-frame');
            //Cancel the operation and re-enable buttons if the request takes too long.
            let isCancelledOrDone = false;
            const requestTimeoutMs = 30000;
            const requestStartTime = (new Date()).getTime();
            let statusCheckInterval = null;
            const cleanup = this.cleanupCurrentDownload = () => {
                isCancelledOrDone = true;
                $frame.off('load.ameAcDownloadAdminTheme');
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }
                if (statusCheckInterval) {
                    clearInterval(statusCheckInterval);
                }
                $frame.attr('src', 'about:blank');
                this.isOperationInProgress(false);
                if (this.cleanupCurrentDownload === cleanup) {
                    this.cleanupCurrentDownload = () => {
                    };
                }
            };
            const timeoutTimer = setTimeout(() => {
                deferred.reject('The download operation timed out.');
                cleanup();
            }, requestTimeoutMs);
            this.savePendingChangesetData().then(() => {
                if (isCancelledOrDone) {
                    return;
                }
                this.changesetName(changesetName);
                this.metadataJson(JSON.stringify(metadata));
                //The server will set a cookie with a unique name that can be used
                //to check if the download has been initiated. Note that the user
                //can still cancel the download.
                const cookieName = ('ameAcFileDownload_'
                    + new Date().getTime()
                    + '_'
                    + Math.round(Math.random() * 10000) //No dots allowed in these cookie names.
                );
                this.downloadCookieName(cookieName);
                //Clear the frame to prevent the old response from being read.
                $frame.attr('src', 'about:blank');
                try {
                    $frame.contents().find('body').html('');
                }
                catch (e) {
                    //Ignore but log cross-origin errors. These should not happen in practice.
                    if (console && console.error) {
                        console.error(e);
                    }
                }
                statusCheckInterval = setInterval(() => {
                    const cookieValue = $.cookie(cookieName);
                    if (cookieValue) {
                        cleanup();
                        $.removeCookie(cookieName);
                        //Close the dialog when the download starts.
                        this.isOpen(false);
                        deferred.resolve();
                        return;
                    }
                    if ((new Date()).getTime() - requestStartTime > requestTimeoutMs) {
                        cleanup();
                        deferred.reject('The download operation timed out.');
                    }
                }, 1000);
                $frame.on('load.ameAcDownloadAdminTheme', () => {
                    //Get the response from the frame. It should be JSON displayed as text.
                    const responseText = String($frame.contents().text()).trim();
                    const response = JSON.parse(responseText);
                    cleanup();
                    if ((response === null) || (typeof response !== 'object')) {
                        deferred.reject('Received an invalid response from the server.');
                    }
                    else {
                        if (!response.success) {
                            let errorMessage;
                            if (response.data.message) {
                                errorMessage = response.data.message;
                            }
                            else {
                                errorMessage = 'An unknown error occurred on the server.';
                            }
                            deferred.reject(errorMessage);
                        }
                        else {
                            //This should never happen in practice.
                            deferred.reject('The server did not start the download correctly.');
                        }
                    }
                });
                $form.trigger('submit');
            }, () => {
                if (isCancelledOrDone) {
                    if (deferred.state() === 'pending') {
                        deferred.reject(''); //No error message; the user probably cancelled the operation.
                    }
                    return;
                }
                cleanup();
                deferred.reject('Could not save the changeset data before generating an admin theme.');
            });
            return deferred.promise();
        }
        onClose(event, ui) {
            this.cleanupCurrentDownload();
        }
    }
    //endregion
    class SectionNavigation {
        constructor() {
            this.sectionNavStack = ko.observableArray([]);
            this.$sectionList = $('#ame-ac-container-collection');
            this.$sectionList.on('click', '.ame-ac-section-link', (event) => {
                event.preventDefault();
                if (event.currentTarget === null) {
                    return; //Shouldn't happen in practice, but let's satisfy the type checker.
                }
                const targetId = $(event.currentTarget).data('target-id');
                if (targetId) {
                    this.navigateToSection(targetId);
                }
            });
            this.$sectionList.on('click', '.ame-ac-section-back-button', (event) => {
                event.preventDefault();
                this.navigateBack();
            });
            this.breadcrumbs = ko.pureComputed(() => {
                return this.sectionNavStack()
                    .map((sectionId) => $('#' + sectionId))
                    .filter(($section) => $section.length > 0)
                    .map(($section) => {
                    return {
                        title: $section.find('.ame-ac-section-title .ame-ac-section-own-title')
                            .first().text()
                    };
                });
            });
        }
        navigateToSection(sectionElementId) {
            const $section = $('#' + sectionElementId);
            if ($section.length === 0) {
                return;
            }
            if ($section.hasClass('ame-ac-current-section')) {
                return; //Already on this section.
            }
            //If the requested section is in the navigation stack, navigate back
            //to it instead of putting more sections on the stack.
            const stackIndex = this.sectionNavStack.indexOf(sectionElementId);
            if (stackIndex !== -1) {
                while (this.sectionNavStack().length > stackIndex) {
                    this.navigateBack();
                }
                return;
            }
            const $previousSection = this.$sectionList.find('.ame-ac-current-section');
            if ($previousSection.length > 0) {
                this.expectTransition($previousSection, '.ame-ac-section');
                $previousSection
                    .removeClass('ame-ac-current-section')
                    .addClass('ame-ac-previous-section');
                this.sectionNavStack.push($previousSection.attr('id'));
                $previousSection.trigger('adminMenuEditor:leaveSection');
            }
            this.expectTransition($section, '.ame-ac-section');
            $section.addClass('ame-ac-current-section');
            $section.trigger('adminMenuEditor:enterSection');
        }
        navigateBack() {
            if (this.sectionNavStack().length < 1) {
                return;
            }
            const $newCurrentSection = $('#' + this.sectionNavStack.pop());
            if ($newCurrentSection.length === 0) {
                return;
            }
            const $oldCurrentSection = this.$sectionList.find('.ame-ac-current-section');
            this.expectTransition($oldCurrentSection, '.ame-ac-section');
            $oldCurrentSection.removeClass('ame-ac-current-section ame-ac-previous-section');
            $oldCurrentSection.trigger('adminMenuEditor:leaveSection');
            const $oldPreviousSection = this.$sectionList.find('.ame-ac-previous-section');
            $oldPreviousSection.removeClass('ame-ac-previous-section');
            //Show the new current section.
            this.expectTransition($newCurrentSection, '.ame-ac-section');
            $newCurrentSection.addClass('ame-ac-current-section');
            $newCurrentSection.trigger('adminMenuEditor:enterSection');
            //The next section in the stack becomes the previous section.
            if (this.sectionNavStack().length > 0) {
                this.$sectionList.find('#' + this.sectionNavStack()[this.sectionNavStack().length - 1])
                    .addClass('ame-ac-previous-section');
            }
        }
        //Add a special class to sections when they have an active CSS transition.
        //This is used to keep both sections visible while the previous section
        //slides out and the next section slides in.
        expectTransition($element, requiredSelector) {
            if (prefersReducedMotion) {
                return;
            }
            if ($element.data('ameHasTransitionEvents')) {
                return; //Event handler(s) already added.
            }
            const transitionEvents = 'transitionend transitioncancel';
            $element.addClass('ame-ac-transitioning');
            function transitionEndCallback(event) {
                //Ignore events that bubble from child elements.
                if (!$(event.target).is(requiredSelector)) {
                    return;
                }
                $element
                    .off(transitionEvents, transitionEndCallback)
                    .data('ameHasTransitionEvents', null)
                    .removeClass('ame-ac-transitioning');
            }
            $element.data('ameHasTransitionEvents', true);
            $element.on(transitionEvents, transitionEndCallback);
        }
    }
    /**
     * Whether to ask for confirmation when the user tries to exit the customizer.
     */
    let ExitPromptMode;
    (function (ExitPromptMode) {
        /**
         * Ask if there are unsaved changes.
         */
        ExitPromptMode[ExitPromptMode["UnsavedChanges"] = 1] = "UnsavedChanges";
        /**
         * Ask if the current changeset hasn't been published yet.
         */
        ExitPromptMode[ExitPromptMode["UnpublishedChanges"] = 2] = "UnpublishedChanges";
    })(ExitPromptMode || (ExitPromptMode = {}));
    class AdminCustomizer extends _admin_customizer_base_js__WEBPACK_IMPORTED_MODULE_8__.AmeAdminCustomizerBase.AdminCustomizerBase {
        constructor(scriptData) {
            super(scriptData);
            this.exitPromptMessage = 'Unsaved changes will be lost if you navigate away from this page.';
            //Admin themes generated by this plugin should be fairly small.
            this.maxImportFileSize = 500 * 1024;
            /**
             * Preview frame URL.
             */
            this.currentPreviewUrl = null;
            this.previewConnection = null;
            this.$extraActionMenu = null;
            this.$extraActionButton = null;
            this.$importFileInput = null;
            this.isImporting = ko.observable(false);
            this.lastImportReport = ko.observable(null);
            this.isImportReportVisible = ko.observable(true);
            this.isDiscardingChanges = ko.observable(false);
            this._isFrameLoading = false;
            this.frameLoadingTimeoutId = null;
            this.lastPreviewLoadTimestamp = new Date(0);
            this.reloadWaitTimeoutId = null;
            this.hasPendingPreviewReload = false;
            this.settings = new CustomizerSettingsCollection(scriptData.ajaxUrl, scriptData.saveChangesetNonce, scriptData.trashChangesetNonce, scriptData.changesetName, scriptData.changesetItemCount, scriptData.changesetStatus);
            _.forOwn(scriptData.settings, (data, id) => {
                if (typeof id === 'string') {
                    this.settings.add(unserializeSetting(id, data));
                }
            });
            if (scriptData.changesetThemeMetadata) {
                this.settings.addInitialThemeMetadata(scriptData.changesetThemeMetadata);
            }
            this.customBasePath = scriptData.customBasePath || null;
            this.consoleLoggingEnabled = scriptData.isWpDebugEnabled || false;
            if ((typeof scriptData.exitPromptMode === 'number') && (scriptData.exitPromptMode in ExitPromptMode)) {
                this.exitPromptMode = scriptData.exitPromptMode;
            }
            else {
                this.exitPromptMode = ExitPromptMode.UnpublishedChanges;
            }
            let sectionIdCounter = 0;
            this.interfaceStructure = unserializeUiElement(scriptData.interfaceStructure, this.settings.get.bind(this.settings), (data) => {
                switch (data.t) {
                    case 'section':
                        data.component = 'ame-ac-section';
                        //All sections must have unique IDs for navigation to work.
                        if (!data.id) {
                            data.id = 'autoID-' + (++sectionIdCounter);
                        }
                        break;
                    case 'control-group':
                        data.component = 'ame-ac-control-group';
                        break;
                    case 'control':
                        //Tell controls that use number inputs to position the popup
                        //slider within the customizer sidebar.
                        if ((data.component === 'ame-number-input')
                            || (data.component === 'ame-box-dimensions')) {
                            data.params = data.params || {};
                            data.params.popupSliderWithin = '#ame-ac-sidebar-content';
                        }
                        //Replace regular separators with AC-specific ones.
                        if (data.component === 'ame-horizontal-separator') {
                            data.component = 'ame-ac-separator';
                        }
                }
            });
            //Remove the reload parameter from the URL. It is only used to avoid
            //caching issues, and is not needed otherwise.
            const currentUrl = new URL(window.location.href);
            if (currentUrl.searchParams.get('_ame-ac-reload') !== null) {
                currentUrl.searchParams.delete('_ame-ac-reload');
                window.history.replaceState({}, '', currentUrl.href);
            }
            //Also remove the "request new changeset" parameter.
            if (currentUrl.searchParams.get('_ame-ac-new-changeset') !== null) {
                currentUrl.searchParams.delete('_ame-ac-new-changeset');
                window.history.replaceState({}, '', currentUrl.href);
            }
            const changesetPathTemplate = scriptData.changesetPathTemplate;
            const changesetPlaceholder = '{changeset}';
            function addChangesetToUrl(currentUrl, changesetName) {
                const url = new URL(currentUrl);
                if (changesetPathTemplate) {
                    url.pathname = changesetPathTemplate.replace(changesetPlaceholder, changesetName);
                    //With a custom path, the "page" parameter that points to the AC
                    //admin page is not necessary and would be confusing.
                    url.searchParams.delete('page');
                    //When the changeset name is stored in the path, the "ame-ac-changeset"
                    //parameter is no longer needed, and could be out of sync with the path.
                    url.searchParams.delete('ame-ac-changeset');
                }
                else {
                    url.searchParams.set('ame-ac-changeset', changesetName);
                }
                return url;
            }
            function getChangesetFromUrl(url) {
                var _a;
                const parsedUrl = new URL(url);
                if (changesetPathTemplate) {
                    function escapeRegExp(input) {
                        return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    }
                    const placeholderStart = changesetPathTemplate.indexOf(changesetPlaceholder);
                    const placeholderEnd = placeholderStart + changesetPlaceholder.length;
                    const changesetPathTemplateRegex = new RegExp('^' + escapeRegExp(changesetPathTemplate.slice(0, placeholderStart))
                        + '([^a-zA-Z0-9]+)'
                        + escapeRegExp(changesetPathTemplate.slice(placeholderEnd)));
                    const match = parsedUrl.pathname.match(changesetPathTemplateRegex);
                    return match ? match[1] : '';
                }
                else {
                    return (_a = parsedUrl.searchParams.get('ame-ac-changeset')) !== null && _a !== void 0 ? _a : '';
                }
            }
            //Add the changeset name to the URL (if not already present).
            if (getChangesetFromUrl(window.location.href) !== this.settings.changesetName()) {
                const newUrl = addChangesetToUrl(window.location.href, this.settings.changesetName());
                window.history.replaceState({}, '', newUrl.href);
            }
            //When the changeset name changes, also change the URL.
            this.settings.changesetName.subscribe((changesetName) => {
                const url = addChangesetToUrl(window.location.href, changesetName);
                if (scriptData.changesetPushStateEnabled) {
                    window.history.pushState({}, '', url.href);
                }
                else {
                    window.history.replaceState({}, '', url.href);
                }
            });
            this.$saveButton = $('#ame-ac-apply-changes');
            //The save button should be enabled when:
            // - There are non-zero changes in the current changeset.
            // - All settings are valid.
            // - The changeset is not in the process of being published, deleted, etc.
            // - The contents of the changeset can be modified (e.g. not already published).
            const isSaveButtonEnabled = ko.pureComputed(() => {
                const changeset = this.settings.getCurrentChangeset();
                return (changeset.isNonEmpty()
                    && changeset.canBeModified()
                    && !this.settings.isExclusiveOperationInProgress()
                    && !this.settings.hasValidationErrors());
            });
            //Update button state when the customizer loads.
            this.$saveButton.prop('disabled', !isSaveButtonEnabled());
            //And also on changes.
            isSaveButtonEnabled.subscribe((isEnabled) => {
                var _a;
                this.$saveButton.prop('disabled', !isEnabled);
                //Change the text back to the default when the button is enabled.
                if (isEnabled) {
                    this.$saveButton.val((_a = this.$saveButton.data('default-text')) !== null && _a !== void 0 ? _a : 'Save Changes');
                }
            });
            //Handle the "Save Changes" button.
            this.$saveButton.on('click', () => {
                //Show the spinner.
                const $spinner = $('#ame-ac-primary-actions .spinner');
                $spinner.css('visibility', 'visible').show();
                const publishFailNoticeId = 'ame-ac-publish-failed-notice';
                //Remove the previous error notification, if any.
                $('#' + publishFailNoticeId).remove();
                const promise = this.settings.publishChangeset();
                promise.fail((error) => {
                    //Show a dismissible error notification.
                    let message = 'An unexpected error occurred while saving changes.';
                    if (typeof error === 'string') {
                        message = error;
                    }
                    else if (error instanceof Error) {
                        message = error.message;
                    }
                    else if (typeof error.responseJSON === 'object') {
                        message = _.get(error.responseJSON, ['data', 'message'], message);
                    }
                    const $notice = $('<div>')
                        .attr('id', publishFailNoticeId)
                        .addClass('notice notice-error is-dismissible')
                        .text(message);
                    //WordPress won't automatically add the dismiss button to a dynamically
                    //generated notice like this, so we have to do it.
                    $notice.append($('<button type="button" class="notice-dismiss"></button>')
                        .append('<span class="screen-reader-text">Dismiss this notice</span>')
                        .on('click', (event) => {
                        event.preventDefault();
                        $notice.remove(); //Not as fancy as WP does it.
                    }));
                    const $container = $('#ame-ac-global-notification-area');
                    $container.append($notice);
                });
                promise.done(() => {
                    var _a;
                    this.$saveButton.val((_a = this.$saveButton.data('published-text')) !== null && _a !== void 0 ? _a : 'Saved');
                    //The preview could be stale. For example, the color scheme module
                    //switches between "actual" and "preview" color schemes dynamically,
                    //but the "actual" scheme could change after applying new settings.
                    //Let's reload the preview frame to make sure it's up-to-date.
                    this.queuePreviewFrameReload();
                });
                promise.always(() => {
                    $spinner.css('visibility', 'hidden');
                });
            });
            //Prevent the user from interacting with settings while the changeset is being modified.
            this.settings.isExclusiveOperationInProgress.subscribe((isInProgress) => {
                $('#ame-ac-sidebar-blocker-overlay').toggle(isInProgress);
            });
            //Show a general overlay with a progress spinner while something is happening.
            this.isGeneralOverlayVisible = ko.pureComputed(() => {
                return this.isImporting() || this.isDiscardingChanges();
            });
            //Initialize the "download admin theme" dialog.
            this.downloadThemeDialog = new DownloadThemeDialog(() => this.settings.getCurrentChangeset().name(), () => this.settings.savePendingSettings(), this.settings.adminThemeMetadata, scriptData);
            //Toggle available extra actions based on changeset status.
            this.importActionEnabled = ko.pureComputed(() => {
                const changeset = this.settings.getCurrentChangeset();
                return changeset && changeset.canBeModified()
                    && !this.settings.isExclusiveOperationInProgress();
            });
            this.importActionEnabled.subscribe((isEnabled) => {
                if (this.$extraActionMenu) {
                    this.$extraActionMenu.find('.ame-ac-import-theme-action')
                        .toggleClass('ui-state-disabled', !isEnabled);
                }
            });
            this.discardChangesActionEnabled = ko.pureComputed(() => {
                const changeset = this.settings.getCurrentChangeset();
                return changeset && changeset.isNonEmpty() && changeset.canBeModified()
                    && !this.settings.isExclusiveOperationInProgress();
            });
            this.discardChangesActionEnabled.subscribe((isEnabled) => {
                if (this.$extraActionMenu) {
                    this.$extraActionMenu.find('.ame-ac-discard-changes-action')
                        .toggleClass('ui-state-disabled', !isEnabled);
                }
            });
            this.downloadThemeActionEnabled = ko.pureComputed(() => {
                return (!this.settings.isExclusiveOperationInProgress()
                    && !this.downloadThemeDialog.isOperationInProgress()
                    //The changeset must already be saved for the download to work,
                    //which means it should have a name.
                    && (this.settings.getCurrentChangeset().name() !== '')
                    //The changeset should probably be non-empty.
                    && this.settings.getCurrentChangeset().isNonEmpty());
            });
            this.downloadThemeActionEnabled.subscribe((isEnabled) => {
                if (this.$extraActionMenu) {
                    this.$extraActionMenu.find('.ame-ac-download-theme-action')
                        .toggleClass('ui-state-disabled', !isEnabled);
                }
            });
            this.sectionNavigation = new SectionNavigation();
            //Set up the preview frame.
            this.$previewFrame = $('iframe#ame-ac-preview');
            this.initialPreviewUrl = scriptData.initialPreviewUrl;
            this.refreshPreviewNonce = scriptData.refreshPreviewNonce;
            this.$previewFrame.on('load', () => {
                var _a;
                this.isFrameLoading = false;
                //The URL that was actually loaded might not match the one that
                //was requested (e.g. because there was a redirect).
                this.currentPreviewUrl = null;
                //Close the previous postMessage connection.
                if (this.previewConnection) {
                    this.previewConnection.disconnect();
                    this.previewConnection = null;
                }
                const frame = this.$previewFrame.get(0);
                if (!frame || !(frame instanceof HTMLIFrameElement)) {
                    return;
                }
                //Try to get the preview URL from the iframe.
                try {
                    const url = (_a = frame.contentWindow) === null || _a === void 0 ? void 0 : _a.location.href;
                    if (url) {
                        this.currentPreviewUrl = url;
                    }
                }
                catch (e) {
                    //We can't get the URL directly, probably because it's a cross-origin iframe.
                }
                this.previewConnection = AmeAcCommunicator.connectToChild(frame, {
                    'setPreviewUrl': (url) => {
                        if (this.isPreviewableUrl(url)) {
                            this.previewUrl = url;
                        }
                    },
                    'notifyPreviewUrlChanged': (url) => {
                        this.currentPreviewUrl = url;
                    }
                }, this.allowedCommOrigins, scriptData.isWpDebugEnabled);
                this.previewConnection.promise.then((connection) => {
                    if (typeof connection === 'undefined') {
                        //This should never happen, but the type checker doesn't know that.
                        throw new Error('Unexpected error: Connection apparently succeeded, but the connection object is undefined');
                    }
                    connection.execute('getCurrentUrl').then((url) => {
                        if (url && (typeof url === 'string')) {
                            this.currentPreviewUrl = url;
                        }
                    });
                    //Notify other scripts that the preview frame is loaded and
                    //the postMessage connection is ready for use.
                    $('body').trigger('adminMenuEditor:acPreviewConnectionReady');
                });
            });
            this.previewUrl = this.initialPreviewUrl;
            //Notify other scripts. This lets them register custom controls and so on.
            $('#ame-ac-admin-customizer').trigger('adminMenuEditor:acRegister', [this]);
            const throttledReloadPreview = _.throttle(() => {
                this.queuePreviewFrameReload();
            }, 1000, //The reload method does its own throttling, so we use a low wait time here.
            { leading: true, trailing: true });
            //Refresh the preview when any setting changes.
            this.settings.addChangeListener((setting, newValue) => {
                if (setting.supportsPostMessage
                    && this.previewConnection
                    && this.previewConnection.isConnected) {
                    this.previewConnection.execute('previewSetting', setting.id, newValue);
                }
                else {
                    let reason = 'Unknown';
                    if (!setting.supportsPostMessage) {
                        reason = 'Setting "' + setting.id + '" does not support postMessage';
                    }
                    else if (!this.previewConnection) {
                        reason = 'No preview connection';
                    }
                    else if (!this.previewConnection.isConnected) {
                        reason = 'Preview connection is not connected';
                    }
                    this.log('Reloading the preview frame because: ' + reason);
                    throttledReloadPreview();
                }
            });
            const registerUnloadPrompt = () => {
                //Ask for confirmation when the user tries to leave the page and the changeset
                //has unpublished/unsaved changes.
                $(window).on('beforeunload.ame-ac-exit-confirm', (event) => {
                    if (this.isExitPromptNeeded()) {
                        event.preventDefault();
                        //Note: The confirmation prompt will only be displayed if the user
                        //has interacted with the page (e.g. clicked something).
                        //As of this writing, MDN says that some browsers still don't support triggering
                        //an "unsaved changes" prompt with event.preventDefault(). You need to set
                        //event.returnValue to a string or return a string from the event handler.
                        //Modern browsers will ignore the content and display their own generic message.
                        return this.exitPromptMessage;
                    }
                });
            };
            /*
             Allegedly, registering a beforeunload handler can cause the browser to
             disable some optimizations, so let's only do it when the user changes
             something or the changeset already contains some changes.
             */
            if (this.settings.getCurrentChangeset().isNonEmpty()) {
                registerUnloadPrompt();
            }
            else {
                const listenerId = this.settings.addChangeListener(() => {
                    //Remove the listener after it has been triggered once.
                    this.settings.removeChangeListener(listenerId);
                    registerUnloadPrompt();
                });
            }
        }
        getSettingObservable(settingId, defaultValue) {
            //Let's just implement this temporarily while working on refactoring this
            //stuff to use KO components.
            return this.settings
                .get(settingId)
                .map(setting => setting.value)
                .getOrElse(ko.observable(defaultValue));
        }
        getAllSettingValues() {
            throw new Error('Method not implemented.');
        }
        get previewUrl() {
            return this.currentPreviewUrl;
        }
        set previewUrl(url) {
            if (url === this.currentPreviewUrl) {
                return;
            }
            //The URL starts out as null, but it cannot be set to NULL again after
            //the preview frame has been loaded.
            if (url === null) {
                throw new Error('Cannot directly set preview URL to null');
            }
            if (this.isPreviewableUrl(url)) {
                this.navigatePreviewFrame(url);
            }
        }
        navigatePreviewFrame(url = null, forceReload = false) {
            const oldUrl = this.previewUrl;
            if (url === null) {
                url = oldUrl !== null && oldUrl !== void 0 ? oldUrl : this.initialPreviewUrl;
            }
            const isSameUrl = (oldUrl === url);
            if (isSameUrl && !forceReload) {
                return;
            }
            //If there are any unsaved changes, let's include them in the preview by simulating
            //a form submission and sending the changes as form data. The server-side component
            //will merge these changes with existing changeset data.
            const unsavedChanges = this.settings.unsavedChanges;
            const simulateFormSubmission = !_.isEmpty(unsavedChanges);
            const parsedUrl = new URL(url);
            //If we're not using form submission, add a special parameter
            //to the URL to force a refresh.
            const refreshParam = '_ame-ac-refresh-trigger';
            if (isSameUrl && !simulateFormSubmission) {
                parsedUrl.searchParams.set(refreshParam, Date.now() + '_' + Math.random());
            }
            else {
                //Otherwise, remove the parameter just to be safe.
                parsedUrl.searchParams.delete(refreshParam);
            }
            //Ensure that the changeset used in the preview matches the current
            //changeset and preview is enabled. This is just a precaution. Normally,
            //the preview script automatically changes link URLs.
            let changesetName = this.settings.changesetName();
            if (changesetName === '') {
                //Use a special value if the changeset hasn't been saved yet.
                changesetName = TemporaryChangesetName;
            }
            parsedUrl.searchParams.set('ame-ac-changeset', changesetName);
            parsedUrl.searchParams.set('ame-ac-preview', '1');
            this.hasPendingPreviewReload = false; //Reloading now, so no longer pending.
            this.isFrameLoading = true;
            //console.info('navigatePreviewFrame: Navigating to ' + parsedUrl.href);
            if (simulateFormSubmission) {
                const formData = {
                    action: 'ws_ame_ac_refresh_preview_frame',
                    "ame-ac-changeset": changesetName,
                    modified: JSON.stringify(unsavedChanges),
                    nonce: this.refreshPreviewNonce
                };
                const $form = $('<form>')
                    .attr('method', 'post')
                    .attr('action', parsedUrl.href)
                    .attr('target', 'ame-ac-preview-frame')
                    .appendTo('body');
                let key;
                for (key in formData) {
                    const value = formData[key];
                    $('<input>')
                        .attr('type', 'hidden')
                        .attr('name', key)
                        .val(value)
                        .appendTo($form);
                }
                this.currentPreviewUrl = parsedUrl.href;
                $form.trigger('submit');
                $form.remove();
            }
            else {
                this.currentPreviewUrl = parsedUrl.href;
                this.$previewFrame.attr('src', this.currentPreviewUrl);
            }
        }
        set isFrameLoading(isLoading) {
            const wasLoadingBefore = this._isFrameLoading;
            if (!isLoading && (isLoading === wasLoadingBefore)) {
                return;
            }
            //In some circumstances, we may start to load a new URL before
            //the previous one has finished loading. This is valid and should
            //reset the load timeout.
            $('#ame-ac-preview-refresh-indicator').toggleClass('ame-ac-show-indicator', isLoading);
            if (this.frameLoadingTimeoutId) {
                clearTimeout(this.frameLoadingTimeoutId);
                this.frameLoadingTimeoutId = null;
            }
            if (isLoading) {
                //As a precaution, we'll assume that if the frame doesn't load in a reasonable
                //time, it will never finish loading.
                this.frameLoadingTimeoutId = window.setTimeout(() => {
                    if (this.isFrameLoading) {
                        this.isFrameLoading = false;
                    }
                }, 20000);
            }
            this._isFrameLoading = isLoading;
            if (wasLoadingBefore && !isLoading) {
                this.lastPreviewLoadTimestamp = new Date();
            }
            //Once the frame is loaded, trigger any pending reload.
            if (!isLoading && this.hasPendingPreviewReload) {
                this.hasPendingPreviewReload = false;
                this.queuePreviewFrameReload();
            }
        }
        get isFrameLoading() {
            return this._isFrameLoading;
        }
        queuePreviewFrameReload() {
            if (this.reloadWaitTimeoutId) {
                return; //The frame will reload soon.
            }
            if (this.isFrameLoading) {
                this.hasPendingPreviewReload = true;
                return;
            }
            //To avoid stressing the server, wait at least X ms after the last
            //load completes before reloading the frame.
            const reloadWaitTime = 2000;
            const now = new Date();
            const timeSinceLastLoad = now.getTime() - this.lastPreviewLoadTimestamp.getTime();
            if (timeSinceLastLoad < reloadWaitTime) {
                this.reloadWaitTimeoutId = window.setTimeout(() => {
                    this.reloadWaitTimeoutId = null;
                    this.queuePreviewFrameReload();
                }, reloadWaitTime - timeSinceLastLoad);
                return;
            }
            //Actually reload the frame.
            this.navigatePreviewFrame(null, true);
        }
        onBindingsApplied(rootElement) {
            //Navigate to the root section. In the current implementation this can't happen
            //until bindings have been applied, so it's not part of the constructor.
            this.navigateToRootSection();
            //Initialize the action menu.
            this.$extraActionButton = jQuery('#ame-ac-extra-actions-trigger', rootElement);
            this.$extraActionMenu = jQuery('#ame-ac-extra-actions-menu', rootElement).menu();
            //Update menu states.
            this.importActionEnabled.notifySubscribers(this.importActionEnabled());
            this.discardChangesActionEnabled.notifySubscribers(this.discardChangesActionEnabled());
            this.downloadThemeActionEnabled.notifySubscribers(this.downloadThemeActionEnabled());
            //Get the file picker.
            this.$importFileInput = jQuery('#ame-ac-import-admin-theme-file', rootElement);
        }
        navigateToRootSection() {
            this.sectionNavigation.navigateToSection('ame-ac-section-structure-root');
        }
        // noinspection JSUnusedGlobalSymbols -- Used in at least one add-on.
        /**
         * Execute an RPC method in the preview frame.
         *
         * @param {string} methodName
         * @param {*} args
         */
        executeRpcMethod(methodName, ...args) {
            if (!this.previewConnection || !this.previewConnection.isConnected) {
                return $.Deferred().reject('The preview frame is not connected.').promise();
            }
            return this.previewConnection.execute(methodName, ...args);
        }
        confirmExit() {
            if (this.isExitPromptNeeded()) {
                if (window.confirm(this.exitPromptMessage)) {
                    //Remove the confirmation prompt that appears when leaving the page.
                    //We don't want to show two prompts.
                    $(window).off('beforeunload.ame-ac-exit-confirm');
                    return true;
                }
                return false;
            }
            return true;
        }
        isExitPromptNeeded() {
            const changeset = this.settings.getCurrentChangeset();
            //No need to save anything if the changeset is empty.
            if (!changeset.isNonEmpty()) {
                return false;
            }
            switch (this.exitPromptMode) {
                case ExitPromptMode.UnpublishedChanges:
                    return (!changeset.wasPublished()
                        && (changeset.status() !== 'trash') //Can't publish a trashed changeset.
                    );
                case ExitPromptMode.UnsavedChanges:
                    const unsavedChanges = this.settings.unsavedChanges;
                    return !_.isEmpty(unsavedChanges);
                default:
                    return false;
            }
        }
        // noinspection JSUnusedGlobalSymbols -- Used in the Knockout template.
        toggleExtraActionMenu() {
            if (!this.$extraActionMenu) {
                return;
            }
            this.$extraActionMenu.toggle();
            if (this.$extraActionMenu.is(':visible')) {
                //Position the menu below the button.
                const $button = $('#ame-ac-extra-actions-trigger');
                this.$extraActionMenu.position({
                    my: 'right top',
                    at: 'right bottom',
                    of: $button,
                    collision: 'flipfit'
                });
                //Hide the menu when the user clicks outside the menu or the button.
                $(document).on('mousedown.ameAcExtraMenuHide', this.handleClickOutsideActionMenu.bind(this));
            }
            else {
                //Remove the click listener if it's still active.
                $(document).off('mousedown.ameAcExtraMenuHide');
            }
        }
        handleClickOutsideActionMenu(event) {
            if (!this.$extraActionMenu
                || !this.$extraActionMenu.is(':visible')
                || !this.$extraActionButton) {
                //The event listener should not be active if the menu is not visible.
                $(document).off('mousedown.ameAcExtraMenuHide');
                return;
            }
            const menuElement = this.$extraActionMenu.get(0);
            const buttonElement = this.$extraActionButton.get(0);
            const isClickOutsideMenu = !menuElement.contains(event.target);
            const isClickOutsideButton = !buttonElement.contains(event.target);
            if (isClickOutsideMenu && isClickOutsideButton) {
                this.hideExtraActionMenu();
            }
        }
        hideExtraActionMenu() {
            if (!this.$extraActionMenu) {
                return;
            }
            this.$extraActionMenu.hide();
            //Stop listening for clicks outside the menu.
            $(document).off('mousedown.ameAcExtraMenuHide');
        }
        openMetadataDialog(mode) {
            this.downloadThemeDialog.mode(mode);
            this.downloadThemeDialog.isOpen(true);
            this.isImportReportVisible(false);
            this.hideExtraActionMenu();
        }
        actionOpenDownloadDialog() {
            if (!this.downloadThemeActionEnabled()) {
                alert('Currently disabled because there are no changes to download.');
                return;
            }
            this.openMetadataDialog(MetadataDialogMode.Download);
        }
        // noinspection JSUnusedGlobalSymbols -- Used in another plugin.
        actionEditOrDownloadTheme() {
            if (!this.downloadThemeActionEnabled()) {
                return;
            }
            //If the user hasn't confirmed the theme metadata yet, show the dialog.
            const metadata = this.settings.adminThemeMetadata();
            if ((metadata === null) || !metadata.wasEverConfirmed) {
                this.openMetadataDialog(MetadataDialogMode.Download);
            }
            else {
                this.downloadThemeDialog.triggerDownloadWithErrorReporting(metadata);
            }
        }
        // noinspection JSUnusedGlobalSymbols -- Used in another plugin.
        actionOpenMetadataDialog() {
            this.openMetadataDialog(MetadataDialogMode.Edit);
        }
        actionOpenImportDialog() {
            if (!this.importActionEnabled()) {
                //Can't import if there is no changeset or the changeset can't be edited.
                //The menu item should be disabled in this case, but we'll check anyway.
                return false;
            }
            this.hideExtraActionMenu();
            //Allow the default action to proceed, which will open the file picker.
            return true;
        }
        actionDiscardChanges() {
            if (!this.discardChangesActionEnabled()) {
                return;
            }
            this.hideExtraActionMenu();
            if (this.settings.isExclusiveOperationInProgress()) {
                alert('Another operation is in progress. Please wait for it to complete before discarding changes.');
                return;
            }
            if (!confirm('Are you sure you want to discard your unsaved changes?')) {
                return;
            }
            this.isImportReportVisible(false);
            this.isDiscardingChanges(true);
            this.settings.trashChangeset()
                .then(() => {
                //Reload the customizer with a new changeset.
                const url = new URL(window.location.href);
                if (this.customBasePath) {
                    url.pathname = this.customBasePath;
                    url.search = '';
                }
                else {
                    //To get the customizer's base URL, get the current URL
                    //and remove all query parameters except "page".
                    const page = url.searchParams.get('page');
                    url.search = '';
                    url.searchParams.set('page', page || 'ame-admin-customizer');
                }
                //Notify the customizer that we definitely want a new changeset;
                //don't try to load a draft.
                url.searchParams.set('_ame-ac-new-changeset', '1');
                //Don't need the hash.
                url.hash = '';
                //Add a random parameter to force a reload.
                url.searchParams.set('_ame-ac-reload', Math.random().toString(36).substring(7));
                //Navigate to the new URL.
                window.location.href = url.toString();
                //Note that the isDiscardingChanges flag is not reset here,
                //so the progress overlay will stay visible until the page reloads.
            })
                .fail((requestObject) => {
                let message = requestObject.statusText || 'Unknown error.';
                if (typeof requestObject.responseJSON === 'object') {
                    const customMessage = _.get(requestObject.responseJSON, ['data', 'message']);
                    if (typeof customMessage === 'string') {
                        message = customMessage;
                    }
                }
                alert('Error: ' + message);
                this.isDiscardingChanges(false);
            });
        }
        handleImportFileSelection() {
            if (!this.$importFileInput) {
                return;
            }
            const fileInput = this.$importFileInput.get(0);
            if (!fileInput || !fileInput.files || (fileInput.files.length < 1)) {
                return;
            }
            //Get the first file. Normally, there should only be one.
            const selectedFile = fileInput.files.item(0);
            if (!selectedFile) {
                return;
            }
            //Limit the file size.
            if (selectedFile.size > this.maxImportFileSize) {
                alert('Error: The selected file is too large. The maximum file size is '
                    + Math.round(this.maxImportFileSize / 1024) + ' KiB');
                //Clear the file input.
                this.$importFileInput.val('');
                return;
            }
            this.isImporting(true);
            this.lastImportReport(null);
            JSZip.loadAsync(selectedFile).then((zip) => {
                const metadataFileRegex = /^([\\/]?[a-zA-Z0-9_-]+[\\/])metadata\.json$/;
                const foundMetadataFiles = zip.file(metadataFileRegex);
                if (!foundMetadataFiles || (foundMetadataFiles.length < 1)) {
                    throw new Error('The selected file is not an admin theme generated by this tool.');
                }
                const metadataFile = foundMetadataFiles[0];
                //Get the directory name and separator from the metadata file path.
                //The prefix will usually be something like "admin-theme-slug/".
                const matches = metadataFileRegex.exec(metadataFile.name);
                let directoryPrefix;
                if (!matches || (matches.length < 2)) {
                    throw new Error('The directory structure of this ZIP file is not recognized.');
                }
                else {
                    directoryPrefix = matches[1];
                }
                const settingsFile = zip.file(directoryPrefix + 'settings.json');
                if (!settingsFile) {
                    throw new Error('The selected ZIP file is missing a settings.json file.');
                }
                //Read both files.
                return Promise.all([
                    metadataFile.async('string'),
                    settingsFile.async('string')
                ]);
            }, (error) => {
                const errorMessage = error.message || error;
                throw new Error('Error reading "' + selectedFile.name + '": ' + errorMessage);
            }).then((fileContents) => {
                if (!fileContents) {
                    throw new Error('Failed to read settings and metadata from the ZIP file.');
                }
                const metadata = this.parseImportedAdminThemeFile(fileContents[0], 'metadata.json', AdminThemeMetadata);
                const settings = this.parseImportedAdminThemeFile(fileContents[1], 'settings.json', AdminThemeSettings);
                const report = new AdminThemeImportReport(selectedFile.name, metadata);
                //Import metadata.
                this.downloadThemeDialog.meta(new ObservableThemeMetadata(metadata));
                //Import settings.
                for (const [settingId, value] of Object.entries(settings)) {
                    report.totalSettings++;
                    const foundSetting = this.settings.get(settingId);
                    foundSetting.forEach((setting) => {
                        const oldValue = setting.value();
                        const errors = setting.tryUpdate(value);
                        if (errors && errors.length) {
                            report.invalidSettings++;
                        }
                        else {
                            report.importedSettings++;
                            if (oldValue != value) {
                                report.differentImportedSettings++;
                            }
                        }
                    });
                    if (foundSetting.isEmpty()) {
                        report.skippedSettings++;
                    }
                }
                this.lastImportReport(report);
                this.isImportReportVisible(true);
            }).catch((error) => {
                //Error handling: Show the error message to the user.
                let errorMessage;
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                else {
                    errorMessage = String(error);
                }
                alert('Error: ' + errorMessage);
            }).finally(() => {
                var _a;
                this.isImporting(false);
                (_a = this.$importFileInput) === null || _a === void 0 ? void 0 : _a.val('');
            });
        }
        parseImportedAdminThemeFile(content, name, schema) {
            try {
                const parsedJson = JSON.parse(content);
                return schema.parse(parsedJson);
            }
            catch (error) {
                let errorMessage;
                if (error instanceof _zod_lib_index_js__WEBPACK_IMPORTED_MODULE_11__.ZodError) {
                    //Convert issues to a newline-separated string.
                    errorMessage = error.issues.map((issue) => {
                        return issue.path.join('.') + ': ' + issue.message;
                    }).join('\n');
                }
                else if (error instanceof Error) {
                    errorMessage = error.message;
                }
                else {
                    errorMessage = String(error);
                }
                //Add the file name to the error message.
                throw new Error('Error parsing ' + name + ':\n' + errorMessage);
            }
        }
        dismissImportReport() {
            this.isImportReportVisible(false);
        }
        log(message) {
            if (this.consoleLoggingEnabled && console && console.log) {
                console.log(message);
            }
        }
    }
    AmeAdminCustomizer.AdminCustomizer = AdminCustomizer;
})(AmeAdminCustomizer || (AmeAdminCustomizer = {}));
jQuery(function () {
    //Give other scripts a chance to load before we start.
    //Some of them also use jQuery to run when the DOM is ready.
    setTimeout(() => {
        window.wsAdminCustomizer = new AmeAdminCustomizer.AdminCustomizer(wsAmeAdminCustomizerData);
        const rootElement = document.getElementById('ame-ac-admin-customizer');
        if (rootElement === null) {
            throw new Error('The root element for the admin customizer was not found.');
        }
        ko.applyBindings(window.wsAdminCustomizer, rootElement);
        //Notify the customizer that bindings have been applied. It needs to do some
        //additional setup that can't be done until the DOM structure is ready.
        setTimeout(() => {
            window.wsAdminCustomizer.onBindingsApplied(rootElement);
        }, 5); //Components are rendered asynchronously.
    }, 20);
});


/***/ }),

/***/ "./extras/modules/admin-customizer/admin-customizer-base.js":
/*!******************************************************************!*\
  !*** ./extras/modules/admin-customizer/admin-customizer-base.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmeAdminCustomizerBase": () => (/* binding */ AmeAdminCustomizerBase)
/* harmony export */ });

var AmeAdminCustomizerBase;
(function (AmeAdminCustomizerBase) {
    class AdminCustomizerBase {
        constructor(scriptData) {
            this.allowedCommOrigins = scriptData.allowedCommOrigins;
            if (this.allowedCommOrigins.length === 0) {
                this.allowedCommOrigins = [window.location.origin];
            }
            this.allowedPreviewUrls = scriptData.allowedPreviewUrls;
            this.parsedAllowedUrls = this.allowedPreviewUrls.map(url => new URL(url));
        }
        isPreviewableUrl(url) {
            if (typeof url === 'string') {
                url = new URL(url);
            }
            if (typeof url.protocol === 'undefined') {
                return false;
            }
            //Only HTTP(S) links are previewable.
            if ((url.protocol !== 'http:') && (url.protocol !== 'https:')) {
                return false;
            }
            //Check against the list of allowed URLs.
            for (const allowedUrl of this.parsedAllowedUrls) {
                //Protocol and host must match. The path must start with the path
                //of the allowed URL (possibly without a trailing slash).
                if ((url.protocol === allowedUrl.protocol) && (url.host === allowedUrl.host)) {
                    const allowedPath = allowedUrl.pathname.replace(/\/$/, '');
                    if (url.pathname.indexOf(allowedPath) === 0) {
                        return true;
                    }
                }
            }
            return false;
        }
    }
    AmeAdminCustomizerBase.AdminCustomizerBase = AdminCustomizerBase;
})(AmeAdminCustomizerBase || (AmeAdminCustomizerBase = {}));
//# sourceMappingURL=admin-customizer-base.js.map

/***/ }),

/***/ "./extras/modules/admin-customizer/ko-components/ame-ac-content-section.js":
/*!*********************************************************************************!*\
  !*** ./extras/modules/admin-customizer/ko-components/ame-ac-content-section.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ame_ac_section_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ame-ac-section.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-section.js");
/* harmony import */ var _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pro-customizables/ko-components/control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");


class AmeAcContentSection extends _ame_ac_section_js__WEBPACK_IMPORTED_MODULE_0__.AmeAcSection {
    constructor(params, $element) {
        super(params, $element);
        if ((typeof params.parentSectionLevel === 'function') && ko.isObservable(params.parentSectionLevel)) {
            this.parentSectionLevel = params.parentSectionLevel;
        }
        else {
            this.parentSectionLevel = null;
        }
        this.contentSectionLevel = ko.pureComputed(() => {
            let parentLevel = 0;
            if (this.parentSectionLevel !== null) {
                parentLevel = this.parentSectionLevel();
            }
            return parentLevel + 1;
        });
        //Tell child sections about our section level.
        this.childComponents().forEach((child) => {
            if (child.name === 'ame-ac-content-section') {
                child.params.parentSectionLevel = this.contentSectionLevel;
            }
        });
        this.sectionLevelClass = ko.pureComputed(() => {
            const level = this.contentSectionLevel();
            return 'ame-ac-content-section-' + level;
        });
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_1__.createComponentConfig)(AmeAcContentSection, `
	<li class="ame-ac-control ame-ac-content-section" data-bind="class: sectionLevelClass">
		<h4 class="ame-ac-control-label ame-ac-content-section-title" data-bind="text: title"></h4>	
	</li>	
	<!-- ko foreach: childComponents -->
		<!-- ko component: $data --><!-- /ko -->
	<!-- /ko -->	
`));
//# sourceMappingURL=ame-ac-content-section.js.map

/***/ }),

/***/ "./extras/modules/admin-customizer/ko-components/ame-ac-control-group.js":
/*!*******************************************************************************!*\
  !*** ./extras/modules/admin-customizer/ko-components/ame-ac-control-group.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pro-customizables/ko-components/control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pro-customizables/assets/customizable.js */ "./extras/pro-customizables/assets/customizable.js");


var ControlGroup = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__.AmeCustomizable.ControlGroup;
class AmeAcControlGroup extends _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoContainerViewModel {
    constructor(params, $element) {
        var _a, _b;
        super(params, $element);
        this.labelFor = (_b = ((_a = this.uiElement) === null || _a === void 0 ? void 0 : _a.labelFor)) !== null && _b !== void 0 ? _b : null;
        this.titleDisabled = (typeof params.titleDisabled !== 'undefined') ? (!!params.titleDisabled) : false;
    }
    getExpectedUiElementType() {
        return ControlGroup;
    }
    mapChildToComponentBinding(child) {
        if (child.component) {
            return _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.ComponentBindingOptions.fromElement(child);
        }
        return super.mapChildToComponentBinding(child);
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createComponentConfig)(AmeAcControlGroup, `
	<li class="ame-ac-control ame-ac-control-group">
		<!-- ko if: title() && !titleDisabled -->
			<!-- ko if: labelFor -->
			<label class="ame-ac-control-label ame-ac-group-title" 
				data-bind="text: title, attr: {for: labelFor}"></label>
			<!-- /ko -->
			<!-- ko ifnot: labelFor -->
			<span class="ame-ac-control-label ame-ac-group-title" 
				data-bind="text: title"></span>
			<!-- /ko -->
		<!-- /ko -->
		<ul data-bind="foreach: childComponents">
			<li class="ame-ac-control">
				<!-- ko if: (
					$data.uiElement 
					&& $data.uiElement.settingValidationErrors
					&& ($data.uiElement.settingValidationErrors().length > 0)
				) -->
					<ame-ac-validation-errors params='errors: $data.uiElement.settingValidationErrors'></ame-ac-validation-errors>
				<!-- /ko -->
				<!-- ko component: $data --><!-- /ko -->
			</li>		
		</ul>
	</li>
`));
//# sourceMappingURL=ame-ac-control-group.js.map

/***/ }),

/***/ "./extras/modules/admin-customizer/ko-components/ame-ac-control.js":
/*!*************************************************************************!*\
  !*** ./extras/modules/admin-customizer/ko-components/ame-ac-control.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pro-customizables/ko-components/control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pro-customizables/assets/customizable.js */ "./extras/pro-customizables/assets/customizable.js");


var Control = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__.AmeCustomizable.Control;
class MissingComponentError extends Error {
    constructor(uiElement) {
        super(`The UI element "${uiElement.label}" [${uiElement.id}] is missing a component name.`);
        this.uiElement = uiElement;
    }
}
class AmeAcControl extends _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoControlViewModel {
    constructor(params, $element) {
        super(params, $element);
        //uiElement is required for this component.
        if (!this.uiElement) {
            throw new Error('The uiElement parameter is required for AmeAcControl');
        }
        this.wrapperLabelEnabled = (this.uiElement.label !== '') && (!this.uiElement.includesOwnLabel);
        this.labelForId = this.uiElement.labelTargetId;
        if (!this.uiElement.component) {
            throw new MissingComponentError(this.uiElement);
        }
    }
    getExpectedUiElementType() {
        return Control;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createComponentConfig)(AmeAcControl, `
	<li class="ame-ac-control">
		<!-- ko if: wrapperLabelEnabled -->
			<!-- ko if: labelForId -->
			<label class="ame-ac-control-label" data-bind="text: label, attr: {for: labelForId}"></label>
			<!-- /ko -->
			<!-- ko ifnot: labelForId -->
			<span class="ame-ac-control-label" data-bind="text: label"></span>
			<!-- /ko -->
		<!-- /ko -->
		<!-- ko component: {name: uiElement.component, params: uiElement.getComponentParams()} --><!-- /ko -->
	</li>
`));
//# sourceMappingURL=ame-ac-control.js.map

/***/ }),

/***/ "./extras/modules/admin-customizer/ko-components/ame-ac-section-link.js":
/*!******************************************************************************!*\
  !*** ./extras/modules/admin-customizer/ko-components/ame-ac-section-link.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pro-customizables/ko-components/control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pro-customizables/assets/customizable.js */ "./extras/pro-customizables/assets/customizable.js");
/* harmony import */ var _ame_ac_section_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ame-ac-section.js */ "./extras/modules/admin-customizer/ko-components/ame-ac-section.js");


var Section = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__.AmeCustomizable.Section;

class AmeAcSectionLink extends _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoContainerViewModel {
    constructor(params, $element) {
        super(params, $element);
        //uiElement is required for this component.
        if (!this.uiElement) {
            throw new Error('The uiElement parameter is required for AmeAcSectionLink');
        }
        this.targetElementId = _ame_ac_section_js__WEBPACK_IMPORTED_MODULE_2__.AmeAcSection.getSectionElementId(this.uiElement);
        this.elementId = _ame_ac_section_js__WEBPACK_IMPORTED_MODULE_2__.AmeAcSection.getSectionLinkElementId(this.uiElement);
    }
    getExpectedUiElementType() {
        return Section;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createComponentConfig)(AmeAcSectionLink, `
	<li class="ame-ac-section-link" data-bind="attr: {'data-target-id' : targetElementId, 'id': elementId}">
		<h3 class="ame-ac-section-title" data-bind="text: title"></h3>
	</li>
`));
//# sourceMappingURL=ame-ac-section-link.js.map

/***/ }),

/***/ "./extras/modules/admin-customizer/ko-components/ame-ac-section.js":
/*!*************************************************************************!*\
  !*** ./extras/modules/admin-customizer/ko-components/ame-ac-section.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmeAcSection": () => (/* binding */ AmeAcSection),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pro-customizables/ko-components/control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pro-customizables/assets/customizable.js */ "./extras/pro-customizables/assets/customizable.js");


var Section = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__.AmeCustomizable.Section;
var Control = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__.AmeCustomizable.Control;
var ControlGroup = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__.AmeCustomizable.ControlGroup;
class AmeAcSection extends _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoContainerViewModel {
    constructor(params, $element) {
        super(params, $element);
        //Must have an uiElement.
        if (this.uiElement === null) {
            throw new Error('AmeAcSection must have an uiElement.');
        }
        this.elementId = AmeAcSection.getSectionElementId(this.uiElement);
        if ((typeof params.breadcrumbs !== 'undefined') && ko.isObservable(params.breadcrumbs)) {
            this.breadcrumbs = params.breadcrumbs;
        }
        else {
            this.breadcrumbs = null;
        }
        //To keep the header text alignment consistent when navigating between sections,
        //let's show something even if there are no breadcrumbs.
        const defaultEmptyBreadcrumbText = 'Admin Menu Editor Pro';
        //Let other modules change the default text.
        let filteredEmptyBreadcrumbText = null;
        if (wp && wp.hooks && wp.hooks.applyFilters) {
            filteredEmptyBreadcrumbText = wp.hooks.applyFilters('adminMenuEditor.ac.emptyBreadcrumbText', defaultEmptyBreadcrumbText);
        }
        const emptyBreadcrumbText = ((typeof filteredEmptyBreadcrumbText === 'string')
            ? filteredEmptyBreadcrumbText
            : defaultEmptyBreadcrumbText);
        this.breadcrumbText = ko.pureComputed(() => {
            if (this.breadcrumbs === null) {
                return emptyBreadcrumbText;
            }
            const breadcrumbs = this.breadcrumbs();
            if (breadcrumbs.length < 1) {
                return emptyBreadcrumbText;
            }
            let titles = breadcrumbs.map(crumb => crumb.title);
            //Show the root section differently, "Admin Customizer" is too long.
            //Not sure about what text to use here, could matching the Theme Customizer be confusing?
            //Alternatives: 🛠️🎨, use \uFE0E to render the emoji without colors (only works for some).
            //Alternatives: ⋯ and …
            titles[0] = 'Customizing';
            //Due to space constraints, show only the last 2 breadcrumbs.
            if (titles.length > 2) {
                titles = titles.slice(titles.length - 2);
            }
            return titles.join(' \u25B8 ');
        });
    }
    getExpectedUiElementType() {
        return Section;
    }
    mapChildToComponentBinding(child) {
        if (child instanceof Section) {
            if (child.preferredRole === 'content') {
                return _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.ComponentBindingOptions.fromElement(child, 'ame-ac-content-section');
            }
            else {
                return _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.ComponentBindingOptions.fromElement(child, 'ame-ac-section-link');
            }
        }
        else if (child instanceof ControlGroup) {
            return _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.ComponentBindingOptions.fromElement(child, 'ame-ac-control-group');
        }
        else if ((child instanceof Control)
            && (['ame-ac-separator', 'ame-horizontal-separator'].indexOf(child.component) < 0)) {
            //Wrap each control in a control group if it's not already in one.
            //Separators are an exception because they're cosmetic and need different styling.
            const controlGroup = child.createControlGroup();
            return this.mapChildToComponentBinding(controlGroup);
        }
        else {
            return _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.ComponentBindingOptions.fromElement(child);
        }
    }
    static getSectionElementId(section) {
        return AmeAcSection.generateSectionElementId(section, 'ame-ac-section-');
    }
    static getSectionLinkElementId(section) {
        return AmeAcSection.generateSectionElementId(section, 'ame-ac-slink-');
    }
    static generateSectionElementId(section, prefix) {
        if (section.id) {
            return prefix + section.id;
        }
        const slug = section.title.toLowerCase().replace(/[^a-z0-9]/g, '-');
        if (slug !== '') {
            return prefix + slug;
        }
        throw new Error('Cannot generate a section element ID because the section does not have an ID or a title.');
    }
    dispose() {
        super.dispose();
        this.childComponents.dispose();
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createComponentConfig)(AmeAcSection, `
	<ul class="ame-ac-section" data-bind="attr: {id: elementId}">
		<li class="ame-ac-section-meta">
			<div class="ame-ac-section-header">
				<button class="ame-ac-section-back-button">
					<span class="screen-reader-text">Back</span>
				</button>
				<h3 class="ame-ac-section-title" data-bind="css: {'ame-ac-has-breadcrumbs': (breadcrumbText() !== '')}">
				    <!-- ko if: breadcrumbText -->
						<span class="ame-ac-section-breadcrumbs" data-bind="text: breadcrumbText"></span>
					<!-- /ko -->
					<span class="ame-ac-section-own-title" data-bind="text: title"></span>				
				</h3>
			</div>
		</li>
		<!-- ko foreach: childComponents -->
			<!-- ko component: $data --><!-- /ko -->
		<!-- /ko -->
	</ul>
`));
//# sourceMappingURL=ame-ac-section.js.map

/***/ }),

/***/ "./extras/modules/admin-customizer/ko-components/ame-ac-separator.js":
/*!***************************************************************************!*\
  !*** ./extras/modules/admin-customizer/ko-components/ame-ac-separator.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pro-customizables/ko-components/control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

class AmeAcSeparator extends _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createComponentConfig)(AmeAcSeparator, `
	<li class="ame-ac-control ame-ac-separator"></li>
`));
//# sourceMappingURL=ame-ac-separator.js.map

/***/ }),

/***/ "./extras/modules/admin-customizer/ko-components/ame-ac-structure.js":
/*!***************************************************************************!*\
  !*** ./extras/modules/admin-customizer/ko-components/ame-ac-structure.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pro-customizables/ko-components/control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../pro-customizables/assets/customizable.js */ "./extras/pro-customizables/assets/customizable.js");


var Section = _pro_customizables_assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__.AmeCustomizable.Section;
class AmeAcStructure extends _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoRendererViewModel {
    constructor(params, $element) {
        var _a;
        super(params, $element);
        this.allNavigationSections = [];
        const rootSection = new Section({
            t: 'section',
            id: 'structure-root',
            title: (_a = this.structure.title) !== null && _a !== void 0 ? _a : 'Root',
        }, this.structure.children);
        //Recursively collect all navigable sections. Don't include content
        //sections: their parents will output them, not this component.
        function collectChildSections(section, accumulator = []) {
            if (section.preferredRole === 'navigation') {
                accumulator.push(section);
            }
            for (const child of section.children) {
                if (child instanceof Section) {
                    collectChildSections(child, accumulator);
                }
            }
            return accumulator;
        }
        this.allNavigationSections = collectChildSections(rootSection);
        //Give the breadcrumb list to each section, if available.
        if (typeof params.breadcrumbs !== 'undefined') {
            for (const section of this.allNavigationSections) {
                section.componentParams.breadcrumbs = params.breadcrumbs;
            }
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createRendererComponentConfig)(AmeAcStructure, `
	<!-- ko foreach: allNavigationSections -->
		<!-- ko component: {name: 'ame-ac-section', params: $data.getComponentParams()} --><!-- /ko -->
	<!-- /ko -->
`));
//# sourceMappingURL=ame-ac-structure.js.map

/***/ }),

/***/ "./extras/modules/admin-customizer/ko-components/ame-ac-validation-errors.js":
/*!***********************************************************************************!*\
  !*** ./extras/modules/admin-customizer/ko-components/ame-ac-validation-errors.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../pro-customizables/ko-components/control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

class AmeAcValidationErrors extends _pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        if (typeof params.errors !== 'undefined') {
            if (Array.isArray(params.errors)) {
                this.errors = params.errors;
            }
            else if (ko.isObservable(params.errors)) {
                this.errors = params.errors;
            }
            else {
                throw new Error('The "errors" parameter must be an array or an observable array.');
            }
        }
        else {
            console.log('Params:', params);
            throw new Error('The "errors" parameter is required for the AmeAcValidationErrors component.');
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_pro_customizables_ko_components_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createComponentConfig)(AmeAcValidationErrors, `
	<ul class="ame-ac-ve-list" data-bind="foreach: errors">
		<li class="notice notice-error ame-ac-validation-error">
			<span class="ame-ac-ve-message" data-bind="text: $data[1].message, attr: {title: $data[1].code}"></span>
		</li>
	</ul>
`));
//# sourceMappingURL=ame-ac-validation-errors.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-box-dimensions/ame-box-dimensions.js":
/*!*****************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-box-dimensions/ame-box-dimensions.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _lazy_popup_slider_adapter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../lazy-popup-slider-adapter.js */ "./extras/pro-customizables/ko-components/lazy-popup-slider-adapter.js");



const allDimensionKeys = [
    'top', 'bottom', 'left', 'right',
    'topLeft', 'topRight', 'bottomLeft', 'bottomRight'
];
function isDimensionKey(key) {
    return allDimensionKeys.includes(key);
}
const DefaultDimensionsInOrder = [
    ['top', 'Top'],
    ['bottom', 'Bottom'],
    ['left', 'Left'],
    ['right', 'Right'],
];
const SideDimensions = ['top', 'bottom', 'left', 'right'];
const SymmetricDimensionMap = {
    'vertical': ['top', 'bottom'],
    'horizontal': ['left', 'right'],
};
function isSymmetricDimensionKey(key) {
    return SymmetricDimensionMap.hasOwnProperty(key);
}
let nextId = 0;
class AmeBoxDimensions extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.inputIdPrefix = '_ame-box-dimensions-c-input-' + (nextId++);
        this.unitElementId = '_ame-box-dimensions-c-unit-' + (nextId++);
        this.wrapperAttributes = {};
        if ((typeof params.id === 'string') && (params.id !== '')) {
            this.wrapperAttributes['id'] = '_ame-box-dimensions-w-' + params.id;
        }
        if ((typeof params['dimensionNames'] !== 'undefined') && Array.isArray(params['dimensionNames'])) {
            this.dimensionsInOrder = params['dimensionNames'];
        }
        else {
            this.dimensionsInOrder = DefaultDimensionsInOrder;
        }
        //Make observable proxies for the individual dimension settings.
        const temp = {};
        for (const [dimensionKey, dimensionName] of this.dimensionsInOrder) {
            const setting = this.settings['value.' + dimensionKey];
            if (!setting || (typeof setting !== 'object')) {
                throw new Error(`Missing setting for the "${dimensionName}" side.`);
            }
            temp[dimensionKey] = ko.computed({
                read: () => {
                    return setting.value();
                },
                write: (newValue) => {
                    if (newValue === '') {
                        newValue = null;
                    }
                    setting.value(newValue);
                },
                deferEvaluation: true,
            }).extend({ 'ameNumericInput': true });
        }
        this.dimensions = temp;
        //Similarly, make an observable for the unit setting.
        const unitSetting = this.settings['value.unit'];
        if (!unitSetting || (typeof unitSetting !== 'object')) {
            throw new Error('Missing setting for the unit.');
        }
        this.unitSetting = unitSetting;
        const defaultDropdownOptions = {
            options: [],
            optionsText: 'text',
            optionsValue: 'value'
        };
        if (params.unitDropdownOptions && (typeof params.unitDropdownOptions === 'object')) {
            const unitDropdownOptions = params.unitDropdownOptions;
            this.unitDropdownOptions = {
                options: unitDropdownOptions['options'] || defaultDropdownOptions.options,
                optionsText: unitDropdownOptions['optionsText'] || defaultDropdownOptions.optionsText,
                optionsValue: unitDropdownOptions['optionsValue'] || defaultDropdownOptions.optionsValue,
            };
        }
        else {
            this.unitDropdownOptions = defaultDropdownOptions;
        }
        this.isLinkActive = ko.observable(false);
        //Enable the link button by default if all dimensions are equal. Exception: null values.
        //Dimensions can have different defaults, so null doesn't necessarily mean that they
        //are actually equal.
        const firstKey = Object.keys(this.dimensions)[0];
        const firstValue = this.dimensions[firstKey]();
        if ((firstValue !== null) && (firstValue !== '')) {
            let areAllDimensionsEqual = true;
            for (const [dimensionKey] of this.dimensionsInOrder) {
                if (this.dimensions[dimensionKey]() !== firstValue) {
                    areAllDimensionsEqual = false;
                    break;
                }
            }
            this.isLinkActive(areAllDimensionsEqual);
        }
        //When "link" mode is enabled, keep all dimensions in sync.
        let isUpdatingAllDimensions = false; //Prevent infinite loops.
        const updateAllDimensions = (newValue) => {
            if (!isUpdatingAllDimensions && this.isLinkActive()) {
                isUpdatingAllDimensions = true;
                newValue = this.normalizeValue(newValue);
                for (const observable of Object.values(this.dimensions)) {
                    observable(newValue);
                }
                isUpdatingAllDimensions = false;
            }
        };
        for (const dimensionKey of Object.keys(this.dimensions)) {
            this.dimensions[dimensionKey].subscribe(updateAllDimensions);
        }
        //In "symmetric" mode, the top/bottom and left/right dimensions are always equal.
        //The control will only show "vertical" and "horizontal" inputs.
        this.symmetricModeEnabled = ko.observable(this.decideSymmetricMode(params));
        //Create computed observables for the "vertical" and "horizontal" dimensions.
        this.symmetricValues = {};
        for (const name in SymmetricDimensionMap) {
            if (!isSymmetricDimensionKey(name) || !SymmetricDimensionMap.hasOwnProperty(name)) {
                continue;
            }
            const sides = SymmetricDimensionMap[name];
            this.symmetricValues[name] = ko.computed({
                read: () => {
                    if (this.symmetricModeEnabled()) {
                        return this.dimensions[sides[0]]();
                    }
                    else {
                        return null;
                    }
                },
                write: (newValue) => {
                    if (this.symmetricModeEnabled()) {
                        newValue = this.normalizeValue(newValue);
                        for (const side of sides) {
                            this.dimensions[side](newValue);
                        }
                    }
                },
                deferEvaluation: true
            }).extend({ 'ameNumericInput': true });
        }
        //The control displays a different set of inputs depending on the current mode.
        this.inputsInOrder = ko.pureComputed(() => {
            let result;
            if (this.symmetricModeEnabled()) {
                result = [
                    ['vertical', 'Vertical'],
                    ['horizontal', 'Horizontal'],
                ];
            }
            else {
                result = this.dimensionsInOrder;
            }
            return result;
        });
        let sliderOptions = {
            'positionParentSelector': '.ame-single-box-dimension',
            'verticalOffset': -2,
        };
        if (typeof params.popupSliderWithin === 'string') {
            sliderOptions.positionWithinClosest = params.popupSliderWithin;
        }
        this.sliderAdapter = new _lazy_popup_slider_adapter_js__WEBPACK_IMPORTED_MODULE_1__.LazyPopupSliderAdapter(params.sliderRanges ? params.sliderRanges : null, '.ame-box-dimensions-control', 'input.ame-box-dimensions-input', sliderOptions);
    }
    get classes() {
        return ['ame-box-dimensions-control', ...super.classes];
    }
    //noinspection JSUnusedGlobalSymbols -- Used in the template.
    /**
     * Get an observable for a specific dimension or a pair of dimensions.
     *
     * Unfortunately, Knockout doesn't seem to support nested indexed accessors
     * like "dimensions[$data[0]]", so we have to use a method instead.
     */
    getInputObservable(key) {
        if (this.symmetricModeEnabled() && isSymmetricDimensionKey(key)) {
            return this.symmetricValues[key];
        }
        if (isDimensionKey(key)) {
            return this.dimensions[key];
        }
        throw new Error('Invalid input key for the current mode: ' + key);
    }
    getInputIdFor(key) {
        return this.inputIdPrefix + '-' + key;
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template.
    getInputAttributes(key) {
        return {
            id: this.getInputIdFor(key),
            'data-unit-element-id': this.unitElementId,
            'data-ame-box-dimension': key,
        };
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template.
    getSettingFor(key) {
        const settingName = 'value.' + key;
        if (settingName in this.settings) {
            return this.settings[settingName];
        }
        if (this.symmetricModeEnabled() && isSymmetricDimensionKey(key)) {
            for (const dimension of SymmetricDimensionMap[key]) {
                //Since both symmetric dimensions are always equal, we can use
                //either of the two settings.
                const settingName = 'value.' + dimension;
                if (settingName in this.settings) {
                    return this.settings[dimension];
                }
            }
        }
        return null;
    }
    // noinspection JSUnusedGlobalSymbols -- Actually used in the template.
    toggleLink() {
        this.isLinkActive(!this.isLinkActive());
        //When enabling "link" mode, fill all inputs with the same value.
        //Use the first non-empty value.
        if (this.isLinkActive()) {
            let firstValue = null;
            for (const dimensionObservable of Object.values(this.dimensions)) {
                const value = dimensionObservable();
                if ((value !== null) && (value !== '')) {
                    firstValue = value;
                    break;
                }
            }
            if (firstValue !== null) {
                firstValue = this.normalizeValue(firstValue);
                for (const dimensionObservable of Object.values(this.dimensions)) {
                    dimensionObservable(firstValue);
                }
            }
        }
    }
    normalizeValue(value) {
        if (value === null) {
            return null;
        }
        //Convert strings to numbers, and invalid strings to null.
        if (typeof value === 'string') {
            value = parseFloat(value);
            if (isNaN(value)) {
                return null;
            }
        }
        return value;
    }
    /**
     * Determine whether the control should be in "symmetric" mode.
     */
    decideSymmetricMode(componentParams) {
        //This mode is off by default and can be enabled by setting the "symmetricMode" parameter.
        let enableMode = (typeof componentParams['symmetricMode'] !== 'undefined')
            ? (!!componentParams['symmetricMode'])
            : false;
        if (!enableMode) {
            return false;
        }
        //Symmetric mode can't be enabled if the control doesn't have all side dimensions.
        const hasAllSideDimensions = SideDimensions.every((key) => {
            return (key in this.dimensions);
        });
        if (!hasAllSideDimensions) {
            return false;
        }
        //It also can only be enabled if top/bottom and left/right dimensions are equal.
        return ((this.dimensions['top']() === this.dimensions['bottom']())
            && (this.dimensions['left']() === this.dimensions['right']()));
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeBoxDimensions, `
	<fieldset data-bind="class: classString, enable: isEnabled, style: styles, attr: wrapperAttributes"
	          data-ame-is-component="1">
		<!-- ko foreach: inputsInOrder -->
			<div data-bind="class: ('ame-single-box-dimension ame-box-dimension-' + $data[0])">
				<input type="text" inputmode="numeric" maxlength="20" pattern="\\s*-?[0-9]+(?:[.,]\\d*)?\\s*" 
					data-bind="value: $parent.getInputObservable($data[0]), valueUpdate: 'input',
					attr: $component.getInputAttributes($data[0]),
					class: ('ame-small-number-input ame-box-dimensions-input ame-box-dimensions-input-' + $data[0]),
					enable: $component.isEnabled,
					click: $component.sliderAdapter.handleKoClickEvent,
					ameValidationErrorClass: $component.getSettingFor($data[0])" />				
				<label data-bind="attr: {'for': $component.getInputIdFor($data[0])}" 
					class="ame-box-dimension-label"><span
					data-bind="text: $data[1]" class="ame-box-dimension-label-text"></span></label>
			</div>
		<!-- /ko -->
		<ame-unit-dropdown params="optionData: unitDropdownOptions, settings: {value: unitSetting},
			classes: ['ame-box-dimensions-unit-selector'],
			id: unitElementId"></ame-unit-dropdown>
		<button class="button button-secondary ame-box-dimensions-link-button hide-if-no-js"
			title="Link values" data-bind="enable: isEnabled, css: {'active': isLinkActive}, 
				click: $component.toggleLink.bind($component)"><span class="dashicons dashicons-admin-links"></span></button>
	</fieldset>
`));
//# sourceMappingURL=ame-box-dimensions.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-choice-control/ame-choice-control.js":
/*!*****************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-choice-control/ame-choice-control.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmeChoiceControl": () => (/* binding */ AmeChoiceControl),
/* harmony export */   "ChoiceControlOption": () => (/* binding */ ChoiceControlOption)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

class ChoiceControlOption {
    constructor(data) {
        this.value = data.value;
        this.label = data.label;
        this.description = data.description || '';
        this.enabled = (typeof data.enabled === 'undefined') || data.enabled;
        this.icon = data.icon || '';
    }
}
class AmeChoiceControl extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.options = ko.observableArray([]);
        if ((typeof params['options'] !== 'undefined') && Array.isArray(params.options)) {
            this.options(params.options.map((optionData) => new ChoiceControlOption(optionData)));
        }
    }
}
//# sourceMappingURL=ame-choice-control.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-code-editor/ame-code-editor.js":
/*!***********************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-code-editor/ame-code-editor.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");


/**
 * Code editor control with syntax highlighting.
 *
 * This control uses the custom Knockout binding "ameCodeMirror" to do the heavy
 * lifting. The binding is defined in ko-extensions.ts.
 *
 * Note: The user can disable syntax highlighting. In that case, this control
 * should behave like a normal textarea.
 */
class AmeCodeEditor extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        if ((typeof params.editorSettings === 'object') && (params.editorSettings !== null)) {
            this.editorSettings = params.editorSettings;
        }
        else {
            this.editorSettings = false;
        }
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeCodeEditor, `
	<div class="ame-code-editor-control-wrap">  
		<textarea data-bind="attr: inputAttributes, value: valueProxy, 
			class: inputClassString, ameCodeMirror: editorSettings" 
			class="large-text" cols="50" rows="10"></textarea>
	</div>
	<!-- ko if: (description) -->
		<!-- ko component: {name: 'ame-sibling-description', params: {description: description}} --><!-- /ko -->
	<!-- /ko -->
`));
//# sourceMappingURL=ame-code-editor.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-color-picker/ame-color-picker.js":
/*!*************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-color-picker/ame-color-picker.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

/**
 * A wrapper for the WordPress color picker.
 *
 * Note that the custom 'ameColorPicker' binding must be available when this component
 * is used. You must enqueue the 'ame-ko-extensions' script for this to work.
 */
class AmeColorPicker extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
    }
    koDescendantsComplete(node) {
        //Make the color picker input visible. Its visibility is set to hidden by default.
        if (node.nodeType === Node.COMMENT_NODE) {
            //The component was bound to a comment node. The real element
            //should be the next non-comment sibling.
            let nextElement;
            do {
                nextElement = node.nextElementSibling;
            } while (nextElement && (nextElement.nodeType === Node.COMMENT_NODE));
            if (!nextElement) {
                return; //This should never happen.
            }
            node = nextElement;
        }
        if (!node || (node.nodeType !== Node.ELEMENT_NODE)) {
            return; //This should never happen.
        }
        const $picker = jQuery(node);
        //This should be a .wp-picker-container element that contains an input.
        const $input = $picker.find('input.ame-color-picker');
        if ($input.length > 0) {
            $input.css('visibility', 'visible');
        }
    }
    get classes() {
        return ['ame-color-picker', 'ame-color-picker-component', ...super.classes];
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeColorPicker, `
	<input type="text" style="visibility: hidden" data-bind="ameColorPicker: valueProxy, 
		class: classString, attr: inputAttributes">
`));
//# sourceMappingURL=ame-color-picker.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-components.js":
/*!******************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-components.js ***!
  \******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "registerBaseComponents": () => (/* binding */ registerBaseComponents)
/* harmony export */ });
/* harmony import */ var _ame_box_dimensions_ame_box_dimensions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ame-box-dimensions/ame-box-dimensions.js */ "./extras/pro-customizables/ko-components/ame-box-dimensions/ame-box-dimensions.js");
/* harmony import */ var _ame_color_picker_ame_color_picker_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ame-color-picker/ame-color-picker.js */ "./extras/pro-customizables/ko-components/ame-color-picker/ame-color-picker.js");
/* harmony import */ var _ame_font_style_picker_ame_font_style_picker_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ame-font-style-picker/ame-font-style-picker.js */ "./extras/pro-customizables/ko-components/ame-font-style-picker/ame-font-style-picker.js");
/* harmony import */ var _ame_image_selector_ame_image_selector_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ame-image-selector/ame-image-selector.js */ "./extras/pro-customizables/ko-components/ame-image-selector/ame-image-selector.js");
/* harmony import */ var _ame_number_input_ame_number_input_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./ame-number-input/ame-number-input.js */ "./extras/pro-customizables/ko-components/ame-number-input/ame-number-input.js");
/* harmony import */ var _ame_nested_description_ame_nested_description_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./ame-nested-description/ame-nested-description.js */ "./extras/pro-customizables/ko-components/ame-nested-description/ame-nested-description.js");
/* harmony import */ var _ame_radio_button_bar_ame_radio_button_bar_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./ame-radio-button-bar/ame-radio-button-bar.js */ "./extras/pro-customizables/ko-components/ame-radio-button-bar/ame-radio-button-bar.js");
/* harmony import */ var _ame_radio_group_ame_radio_group_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ame-radio-group/ame-radio-group.js */ "./extras/pro-customizables/ko-components/ame-radio-group/ame-radio-group.js");
/* harmony import */ var _ame_select_box_ame_select_box_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./ame-select-box/ame-select-box.js */ "./extras/pro-customizables/ko-components/ame-select-box/ame-select-box.js");
/* harmony import */ var _ame_sibling_description_ame_sibling_description_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./ame-sibling-description/ame-sibling-description.js */ "./extras/pro-customizables/ko-components/ame-sibling-description/ame-sibling-description.js");
/* harmony import */ var _ame_static_html_ame_static_html_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./ame-static-html/ame-static-html.js */ "./extras/pro-customizables/ko-components/ame-static-html/ame-static-html.js");
/* harmony import */ var _ame_text_input_ame_text_input_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./ame-text-input/ame-text-input.js */ "./extras/pro-customizables/ko-components/ame-text-input/ame-text-input.js");
/* harmony import */ var _ame_toggle_checkbox_ame_toggle_checkbox_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./ame-toggle-checkbox/ame-toggle-checkbox.js */ "./extras/pro-customizables/ko-components/ame-toggle-checkbox/ame-toggle-checkbox.js");
/* harmony import */ var _ame_unit_dropdown_ame_unit_dropdown_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./ame-unit-dropdown/ame-unit-dropdown.js */ "./extras/pro-customizables/ko-components/ame-unit-dropdown/ame-unit-dropdown.js");
/* harmony import */ var _ame_wp_editor_ame_wp_editor_js__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./ame-wp-editor/ame-wp-editor.js */ "./extras/pro-customizables/ko-components/ame-wp-editor/ame-wp-editor.js");
/* harmony import */ var _ame_horizontal_separator_ame_horizontal_separator_js__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./ame-horizontal-separator/ame-horizontal-separator.js */ "./extras/pro-customizables/ko-components/ame-horizontal-separator/ame-horizontal-separator.js");
/* harmony import */ var _ame_code_editor_ame_code_editor_js__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./ame-code-editor/ame-code-editor.js */ "./extras/pro-customizables/ko-components/ame-code-editor/ame-code-editor.js");
/*
 * This utility module imports all the base Knockout components and exports
 * a function that can be used to register the components with Knockout.
 */

















let componentsRegistered = false;
/**
 * Register the base Knockout components that are part of AME.
 *
 * It's safe to call this function multiple times. It will only register the components once.
 */
function registerBaseComponents() {
    if (componentsRegistered) {
        return;
    }
    ko.components.register('ame-box-dimensions', _ame_box_dimensions_ame_box_dimensions_js__WEBPACK_IMPORTED_MODULE_0__["default"]);
    ko.components.register('ame-color-picker', _ame_color_picker_ame_color_picker_js__WEBPACK_IMPORTED_MODULE_1__["default"]);
    ko.components.register('ame-font-style-picker', _ame_font_style_picker_ame_font_style_picker_js__WEBPACK_IMPORTED_MODULE_2__["default"]);
    ko.components.register('ame-image-selector', _ame_image_selector_ame_image_selector_js__WEBPACK_IMPORTED_MODULE_3__["default"]);
    ko.components.register('ame-number-input', _ame_number_input_ame_number_input_js__WEBPACK_IMPORTED_MODULE_4__["default"]);
    ko.components.register('ame-nested-description', _ame_nested_description_ame_nested_description_js__WEBPACK_IMPORTED_MODULE_5__["default"]);
    ko.components.register('ame-radio-button-bar', _ame_radio_button_bar_ame_radio_button_bar_js__WEBPACK_IMPORTED_MODULE_6__["default"]);
    ko.components.register('ame-radio-group', _ame_radio_group_ame_radio_group_js__WEBPACK_IMPORTED_MODULE_7__["default"]);
    ko.components.register('ame-select-box', _ame_select_box_ame_select_box_js__WEBPACK_IMPORTED_MODULE_8__["default"]);
    ko.components.register('ame-sibling-description', _ame_sibling_description_ame_sibling_description_js__WEBPACK_IMPORTED_MODULE_9__["default"]);
    ko.components.register('ame-static-html', _ame_static_html_ame_static_html_js__WEBPACK_IMPORTED_MODULE_10__["default"]);
    ko.components.register('ame-text-input', _ame_text_input_ame_text_input_js__WEBPACK_IMPORTED_MODULE_11__["default"]);
    ko.components.register('ame-toggle-checkbox', _ame_toggle_checkbox_ame_toggle_checkbox_js__WEBPACK_IMPORTED_MODULE_12__["default"]);
    ko.components.register('ame-unit-dropdown', _ame_unit_dropdown_ame_unit_dropdown_js__WEBPACK_IMPORTED_MODULE_13__["default"]);
    ko.components.register('ame-wp-editor', _ame_wp_editor_ame_wp_editor_js__WEBPACK_IMPORTED_MODULE_14__["default"]);
    ko.components.register('ame-horizontal-separator', _ame_horizontal_separator_ame_horizontal_separator_js__WEBPACK_IMPORTED_MODULE_15__["default"]);
    ko.components.register('ame-code-editor', _ame_code_editor_ame_code_editor_js__WEBPACK_IMPORTED_MODULE_16__["default"]);
    componentsRegistered = true;
}
//# sourceMappingURL=ame-components.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-description/ame-description.js":
/*!***********************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-description/ame-description.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmeDescriptionComponent": () => (/* binding */ AmeDescriptionComponent)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

/**
 * Base class for description components.
 */
class AmeDescriptionComponent extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoComponentViewModel {
    constructor(params, $element) {
        super(params, $element);
        this.description = params.description || '';
    }
}
//# sourceMappingURL=ame-description.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-font-style-picker/ame-font-style-picker.js":
/*!***********************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-font-style-picker/ame-font-style-picker.js ***!
  \***********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

//Note: Font style picker CSS is already included in the main 'controls.scss' file
//and won't be duplicated or included here. Instead, load that stylesheet when
//using any control components.
/**
 * Font style options that can be selected in the picker component.
 *
 * Regrettably, these are duplicated from the PHP version of the control.
 * Once browsers support importing JSON files, we can move this to a separate
 * file and use that file in both places.
 */
const fontStyleOptions = {
    "font-style": [
        {
            "value": null,
            "text": "Default font style",
            "label": "&mdash;"
        },
        {
            "value": "italic",
            "text": "Italic",
            "label": "<span class=\"dashicons dashicons-editor-italic\"></span>"
        }
    ],
    "text-transform": [
        {
            "value": null,
            "text": "Default letter case",
            "label": "&mdash;"
        },
        {
            "value": "uppercase",
            "text": "Uppercase",
            "label": {
                'text-transform': 'uppercase'
            }
        },
        {
            "value": "lowercase",
            "text": "Lowercase",
            "label": {
                'text-transform': 'lowercase'
            }
        },
        {
            "value": "capitalize",
            "text": "Capitalize each word",
            "label": {
                'text-transform': 'capitalize'
            }
        }
    ],
    "font-variant": [
        {
            "value": null,
            "text": "Default font variant",
            "label": "&mdash;"
        },
        {
            "value": "small-caps",
            "text": "Small caps",
            "label": {
                'font-variant': 'small-caps'
            }
        }
    ],
    "text-decoration": [
        {
            "value": null,
            "text": "Default text decoration",
            "label": "&mdash;"
        },
        {
            "value": "underline",
            "text": "Underline",
            "label": "<span class=\"dashicons dashicons-editor-underline\"></span>"
        },
        {
            "value": "line-through",
            "text": "Strikethrough",
            "label": "<span class=\"dashicons dashicons-editor-strikethrough\"></span>"
        }
    ]
};
//Generate label HTML for options that don't have it yet.
function makeFontSample(styles) {
    let styleString = '';
    for (const [property, value] of Object.entries(styles)) {
        styleString += `${property}: ${value};`;
    }
    return `<span class="ame-font-sample" style="${styleString}">ab</span>`;
}
let flattenedOptions = [];
for (const [property, options] of Object.entries(fontStyleOptions)) {
    options.forEach((option) => {
        //Skip null values. They're used to indicate the default option,
        //and we don't need those in the Knockout version of this control.
        if (option.value === null) {
            return;
        }
        let labelString;
        if (typeof option.label === 'object') {
            labelString = makeFontSample(option.label);
        }
        else {
            labelString = option.label;
        }
        flattenedOptions.push({
            'value': option.value,
            'text': option.text || '',
            'property': property,
            'label': labelString
        });
    });
}
class AmeFontStylePicker extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.options = flattenedOptions;
    }
    get classes() {
        return ['ame-font-style-control', ...super.classes];
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template, below.
    isOptionSelected(property, value) {
        if (this.settings.hasOwnProperty(property)) {
            return (this.settings[property].value() === value);
        }
        return false;
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template.
    toggleOption(property, value) {
        if (!this.settings.hasOwnProperty(property)) {
            return;
        }
        const targetSetting = this.settings[property];
        if (targetSetting.value() === value) {
            //When the user clicks on the currently selected option, reset it to the default.
            targetSetting.tryUpdate(null);
        }
        else {
            //Otherwise, set the new value.
            targetSetting.tryUpdate(value);
        }
    }
}
//Note: This weird spacing in the template string is intentional. It's used to
//remove whitespace nodes from the DOM, which would otherwise slightly change
//the layout of the control.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeFontStylePicker, `
	<fieldset data-ame-is-component="1" data-bind="class: classString, style: styles">
		<!-- 
		ko foreach: options 
		--><label class="ame-font-style-control-choice" data-bind="attr: {title: (text || '')}"><!-- 
			ko if: text 
			--><span class="screen-reader-text" data-bind="text: text"></span><!-- 
			/ko 
		--><span class="button button-secondary ame-font-style-control-choice-label" 
				data-bind="html: label, css: { 'active': $component.isOptionSelected(property, value) },
				click: $component.toggleOption.bind($component, property, value)"></span></label><!-- 
		/ko -->
	</fieldset>
`));
//# sourceMappingURL=ame-font-style-picker.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-horizontal-separator/ame-horizontal-separator.js":
/*!*****************************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-horizontal-separator/ame-horizontal-separator.js ***!
  \*****************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

class AmeHorizontalSeparator extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeHorizontalSeparator, `
	<div class="ame-horizontal-separator"></div>
`));
//# sourceMappingURL=ame-horizontal-separator.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-image-selector/ame-image-selector.js":
/*!*****************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-image-selector/ame-image-selector.js ***!
  \*****************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");


/**
 * Image selector control.
 *
 * This implementation hands off the work to the existing AmeImageSelectorApi.ImageSelector
 * class to avoid duplicating the effort. That class is not a module because it is also
 * used for the more progressive-enhancement-y PHP-rendered controls, so we can't import it.
 */
class AmeImageSelector extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.selectorInstance = null;
        //Verify that our dependencies are available.
        if (typeof AmeImageSelectorApi === 'undefined') {
            throw new Error('AmeImageSelectorApi is not available. Remember to enqueue "ame-image-selector-control-v2".');
        }
        if (typeof AmeImageSelectorApi.ImageSelector === 'undefined') {
            throw new Error('AmeImageSelectorApi.ImageSelector is not available. This is probably a bug.');
        }
        this.externalUrlsAllowed = !!params.externalUrlsAllowed;
        this.canSelectMedia = !!params.canSelectMedia;
        this.imageProxy = this.settings.value.value;
    }
    get classes() {
        return [
            'ame-image-selector-v2',
            ...super.classes,
        ];
    }
    koDescendantsComplete() {
        const $container = this.findChild('.ame-image-selector-v2');
        if ($container.length === 0) {
            return;
        }
        this.selectorInstance = new AmeImageSelectorApi.ImageSelector($container, {
            externalUrlsAllowed: this.externalUrlsAllowed,
            canSelectMedia: this.canSelectMedia,
        }, this.imageProxy());
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeImageSelector, `
	<div class="ame-image-selector-v2" data-ame-is-component="1" 
		data-bind="class: classString, ameObservableChangeEvents: { observable: imageProxy }">
		<!-- The contents should be generated by the image selector API. -->
	</div>
`));
//# sourceMappingURL=ame-image-selector.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-nested-description/ame-nested-description.js":
/*!*************************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-nested-description/ame-nested-description.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _ame_description_ame_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ame-description/ame-description.js */ "./extras/pro-customizables/ko-components/ame-description/ame-description.js");


/**
 * A simple component that displays the description of a UI element.
 *
 * Like AmeSiblingDescription, but intended to be rendered inside
 * the parent control or container, not as a sibling.
 */
class AmeNestedDescription extends _ame_description_ame_description_js__WEBPACK_IMPORTED_MODULE_1__.AmeDescriptionComponent {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createComponentConfig)(AmeNestedDescription, `
	<br><span class="description" data-bind="html: description"></span>	
`));
//# sourceMappingURL=ame-nested-description.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-number-input/ame-number-input.js":
/*!*************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-number-input/ame-number-input.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmeNumberInput": () => (/* binding */ AmeNumberInput),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../assets/customizable.js */ "./extras/pro-customizables/assets/customizable.js");
/// <reference path="../../../../customizables/assets/popup-slider.d.ts" />


var Control = _assets_customizable_js__WEBPACK_IMPORTED_MODULE_1__.AmeCustomizable.Control;
class AmeNumberInput extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoDependentControl {
    constructor(params, $element) {
        super(params, $element);
        this.sliderRanges = null;
        this.slider = null;
        this.numericValue = this.valueProxy.extend({ 'ameNumericInput': true });
        this.unitText = params.unitText || '';
        this.hasUnitDropdown = params.hasUnitDropdown || false;
        this.unitElementId = params.unitElementId || '';
        if (this.hasUnitDropdown && params.unitDropdownOptions) {
            this.unitDropdownOptions = {
                options: params.unitDropdownOptions.options || [],
                optionsText: params.unitDropdownOptions.optionsText || 'text',
                optionsValue: params.unitDropdownOptions.optionsValue || 'value'
            };
        }
        else {
            this.unitDropdownOptions = null;
        }
        this.min = params.min || null;
        this.max = params.max || null;
        this.step = params.step || null;
        if (params.sliderRanges) {
            this.sliderRanges = params.sliderRanges;
        }
        this.popupSliderWithin = (typeof params.popupSliderWithin === 'string') ? params.popupSliderWithin : null;
        this.inputClasses.unshift('ame-input-with-popup-slider', 'ame-number-input');
    }
    get classes() {
        const classes = ['ame-number-input-control'];
        if (this.sliderRanges !== null) {
            classes.push('ame-container-with-popup-slider');
        }
        classes.push(...super.classes);
        return classes;
    }
    get inputClasses() {
        const classes = ['ame-input-with-popup-slider', 'ame-number-input'];
        classes.push(...super.inputClasses);
        return classes;
    }
    getAdditionalInputAttributes() {
        let attributes = super.getAdditionalInputAttributes();
        if (this.min !== null) {
            attributes['min'] = this.min.toString();
        }
        if (this.max !== null) {
            attributes['max'] = this.max.toString();
        }
        if (this.step !== null) {
            attributes['step'] = this.step.toString();
        }
        if (this.unitElementId) {
            attributes['data-unit-element-id'] = this.unitElementId;
        }
        return attributes;
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the Knockout template in this same file.
    showPopupSlider($data, event) {
        if ((this.sliderRanges === null) || (typeof AmePopupSlider === 'undefined')) {
            return;
        }
        //Some sanity checks.
        if (!event.target) {
            return;
        }
        const $input = jQuery(event.target);
        if ($input.is(':disabled') || !$input.is('input')) {
            return;
        }
        const $container = $input.closest('.ame-container-with-popup-slider');
        if ($container.length < 1) {
            return;
        }
        //Initialize the slider if it's not already initialized.
        if (!this.slider) {
            let sliderOptions = {};
            if (this.popupSliderWithin) {
                sliderOptions.positionWithinClosest = this.popupSliderWithin;
            }
            //In HTML, we would pass the range data as a "data-slider-ranges" attribute,
            //but here we can just set the data directly.
            $input.data('slider-ranges', this.sliderRanges);
            this.slider = AmePopupSlider.createSlider($container, sliderOptions);
        }
        this.slider.showForInput($input);
    }
    getExpectedUiElementType() {
        return Control;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeNumberInput, `
	<fieldset data-bind="class: classString, enable: isEnabled">
		<div data-bind="class: (hasUnitDropdown ? 'ame-input-group' : '')">
			<input type="text" inputmode="numeric" maxlength="20" pattern="\\s*-?[0-9]+(?:[.,]\\d*)?\\s*"
				   data-bind="attr: inputAttributes, value: numericValue, valueUpdate: 'input', 
				   class: inputClassString, enable: isEnabled, click: showPopupSlider.bind($component),
				   ameValidationErrorClass: settings.value">
			
			<!-- ko if: hasUnitDropdown -->
				<ame-unit-dropdown params="optionData: unitDropdownOptions, settings: {value: settings.unit},
					classes: ['ame-input-group-secondary', 'ame-number-input-unit'],
					id: unitElementId"></ame-unit-dropdown>
			<!-- /ko -->
			<!-- ko if: (!hasUnitDropdown && unitText) -->
				<span class="ame-number-input-unit" 
					  data-bind="text: unitText, attr: {id: unitElementId, 'data-number-unit': unitText}"></span>
			<!-- /ko -->
		</div>
	</fieldset>	
`));
//# sourceMappingURL=ame-number-input.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-radio-button-bar/ame-radio-button-bar.js":
/*!*********************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-radio-button-bar/ame-radio-button-bar.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _ame_choice_control_ame_choice_control_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ame-choice-control/ame-choice-control.js */ "./extras/pro-customizables/ko-components/ame-choice-control/ame-choice-control.js");



class AmeRadioButtonBar extends _ame_choice_control_ame_choice_control_js__WEBPACK_IMPORTED_MODULE_1__.AmeChoiceControl {
    constructor(params, $element) {
        super(params, $element);
    }
    get classes() {
        return ['ame-radio-button-bar-control', ...super.classes];
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeRadioButtonBar, `
	<fieldset data-bind="class: classString, enable: isEnabled, style: styles" data-ame-is-component="1">
		<!-- ko foreach: options -->
		<label data-bind="attr: {title: description}" class="ame-radio-bar-item">
			<input type="radio" data-bind="class: $component.inputClassString,
				checked: $component.valueProxy, checkedValue: value, enable: $component.isEnabled,
				ameObservableChangeEvents: true">
			<span class="button ame-radio-bar-button" data-bind="css: {'ame-rb-has-label' : label}">
				<!-- ko if: (icon && (icon.indexOf('dashicons-') >= 0)) -->
					<span data-bind="class: 'dashicons ' + icon"></span>
				<!-- /ko -->
				<!-- ko if: label -->
					<span class="ame-rb-label" data-bind="text: label"></span>
				<!-- /ko -->
			</span>
		</label>
		<!-- /ko -->
	</fieldset>
`));
//# sourceMappingURL=ame-radio-button-bar.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-radio-group/ame-radio-group.js":
/*!***********************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-radio-group/ame-radio-group.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _ame_choice_control_ame_choice_control_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ame-choice-control/ame-choice-control.js */ "./extras/pro-customizables/ko-components/ame-choice-control/ame-choice-control.js");



// noinspection JSUnusedGlobalSymbols -- Enum keys like "Paragraph" are used when serializing wrapStyle in PHP.
var WrapStyle;
(function (WrapStyle) {
    WrapStyle["LineBreak"] = "br";
    WrapStyle["Paragraph"] = "p";
    WrapStyle["None"] = "";
})(WrapStyle || (WrapStyle = {}));
function isWrapStyle(value) {
    if (typeof value !== 'string') {
        return false;
    }
    return (typeof WrapStyle[value] === 'string');
}
let nextRadioGroupId = 1;
class AmeRadioGroup extends _ame_choice_control_ame_choice_control_js__WEBPACK_IMPORTED_MODULE_1__.AmeChoiceControl {
    constructor(params, $element) {
        super(params, $element);
        this.wrapStyle = WrapStyle.None;
        this.childByValue = new Map();
        if ((typeof params['valueChildIndexes'] === 'object') && Array.isArray(params.valueChildIndexes)) {
            const children = ko.unwrap(this.inputChildren);
            for (const [value, index] of params.valueChildIndexes) {
                if (!children || !children[index]) {
                    throw new Error('The "' + this.label + '" radio group has no children, but its valueChildIndexes'
                        + ' requires child #' + index + ' to be associated with value "' + value + '".');
                }
                this.childByValue.set(value, children[index]);
            }
        }
        this.wrapStyle = isWrapStyle(params.wrapStyle) ? WrapStyle[params.wrapStyle] : WrapStyle.None;
        if (this.childByValue.size > 0) {
            this.wrapStyle = WrapStyle.None;
        }
        this.radioInputPrefix = (typeof params.radioInputPrefix === 'string')
            ? params.radioInputPrefix
            : ('ame-rg-input-' + nextRadioGroupId++ + '-');
    }
    get classes() {
        const result = ['ame-radio-group-component', ...super.classes];
        if (this.childByValue.size > 0) {
            result.push('ame-rg-has-nested-controls');
        }
        return result;
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template below.
    getChoiceChild(value) {
        return this.childByValue.get(value) || null;
    }
    // noinspection JSUnusedGlobalSymbols -- Used in the template.
    /**
     * Get the ID attribute for a radio input.
     *
     * Note: This must match the algorithm used by the PHP version of this control
     * to work correctly with the BorderStyleSelector control that adds style samples
     * to each choice and uses the ID to link them to the inputs (so that clicking
     * the sample selects the option).
     */
    getRadioInputId(choice) {
        let sanitizedValue = (choice.value !== null) ? choice.value.toString() : '';
        //Emulate the sanitize_key() function from WordPress core.
        sanitizedValue = sanitizedValue.toLowerCase().replace(/[^a-z0-9_\-]/gi, '');
        return this.radioInputPrefix + sanitizedValue;
    }
}
const choiceTemplate = `
	<label data-bind="class: 'ame-rg-option-label',
		css: {'ame-rg-has-choice-child' : ($component.getChoiceChild(value) !== null)}">
		<input type="radio" data-bind="class: $component.inputClassString, 
			checked: $component.valueProxy, checkedValue: value, enable: $component.isEnabled,
			attr: {id: $component.getRadioInputId($data)}">
		<span data-bind="html: label"></span>
		<!-- ko if: description -->
			<!-- ko component: {name: 'ame-nested-description', params: {description: description}} --><!-- /ko -->
		<!-- /ko -->
	</label>
`;
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeRadioGroup, `
	<fieldset data-bind="class: classString, enable: isEnabled, style: styles">
		<!-- ko foreach: options -->
			<!-- ko if: $component.wrapStyle === 'br' -->
				${choiceTemplate} <br>
			<!-- /ko -->
			<!-- ko if: $component.wrapStyle === 'p' -->
				<p>${choiceTemplate}</p>
			<!-- /ko -->
			<!-- ko if: $component.wrapStyle === '' -->
				${choiceTemplate}
			<!-- /ko -->
			<!-- ko with: $component.getChoiceChild(value) -->
			<span class="ame-rg-nested-control" 
				data-bind="component: {name: component, params: getComponentParams()}"></span>
			<!-- /ko -->
		<!-- /ko -->
	</fieldset>
`));
//# sourceMappingURL=ame-radio-group.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-select-box/ame-select-box.js":
/*!*********************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-select-box/ame-select-box.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _ame_choice_control_ame_choice_control_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../ame-choice-control/ame-choice-control.js */ "./extras/pro-customizables/ko-components/ame-choice-control/ame-choice-control.js");
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");


class AmeSelectBox extends _ame_choice_control_ame_choice_control_js__WEBPACK_IMPORTED_MODULE_0__.AmeChoiceControl {
    constructor(params, $element) {
        super(params, $element);
    }
    get classes() {
        return ['ame-select-box-control', ...super.classes];
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_1__.createControlComponentConfig)(AmeSelectBox, `
	<select data-bind="class: classString, value: valueProxy, options: options,
		optionsValue: 'value', optionsText: 'label', enable: isEnabled, attr: inputAttributes"></select>
	<!-- ko if: (description) -->
		<!-- ko component: {name: 'ame-sibling-description', params: {description: description}} --><!-- /ko -->
	<!-- /ko -->	
`));
//# sourceMappingURL=ame-select-box.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-sibling-description/ame-sibling-description.js":
/*!***************************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-sibling-description/ame-sibling-description.js ***!
  \***************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");
/* harmony import */ var _ame_description_ame_description_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../ame-description/ame-description.js */ "./extras/pro-customizables/ko-components/ame-description/ame-description.js");


/**
 * A simple component that displays the description of a UI element.
 *
 * This should be rendered as a sibling of the UI element's component,
 * typically immediately after it.
 *
 * Caution: HTML is allowed in the description.
 */
class AmeSiblingDescription extends _ame_description_ame_description_js__WEBPACK_IMPORTED_MODULE_1__.AmeDescriptionComponent {
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createComponentConfig)(AmeSiblingDescription, `
	<p class="description" data-bind="html: description"></p>	
`));
//# sourceMappingURL=ame-sibling-description.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-static-html/ame-static-html.js":
/*!***********************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-static-html/ame-static-html.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

class AmeStaticHtml extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.containerType = 'span';
        this.htmlContent = (typeof params.html === 'string') ? params.html : '';
        if (typeof params.container === 'string') {
            this.containerType = params.container;
        }
    }
}
//Note: The HTML content has to be in a container element because Knockout doesn't allow
//using the "html" binding with virtual elements.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeStaticHtml, `
	<!-- ko if: containerType === 'div' -->
		<div data-bind="html: htmlContent"></div>
	<!-- /ko -->
	<!-- ko if: containerType === 'span' -->
		<span data-bind="html: htmlContent"></span>
	<!-- /ko -->
`));
//# sourceMappingURL=ame-static-html.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-text-input/ame-text-input.js":
/*!*********************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-text-input/ame-text-input.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmeTextInput": () => (/* binding */ AmeTextInput),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

class AmeTextInput extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoDependentControl {
    constructor(params, $element) {
        super(params, $element);
        this.inputType = 'text';
        this.isCode = params.isCode || false;
        this.inputType = params.inputType || 'text';
    }
    get inputClasses() {
        const classes = ['regular-text'];
        if (this.isCode) {
            classes.push('code');
        }
        classes.push('ame-text-input-control', ...super.inputClasses);
        return classes;
    }
    getAdditionalInputAttributes() {
        return Object.assign({ 'type': this.inputType }, super.getAdditionalInputAttributes());
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeTextInput, `
	<input data-bind="value: valueProxy, attr: inputAttributes, class: inputClassString">
	<!-- ko if: (description) -->
		<!-- ko component: {name: 'ame-sibling-description', params: {description: description}} --><!-- /ko -->
	<!-- /ko -->	
`));
//# sourceMappingURL=ame-text-input.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-toggle-checkbox/ame-toggle-checkbox.js":
/*!*******************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-toggle-checkbox/ame-toggle-checkbox.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

class AmeToggleCheckbox extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.onValue = (typeof params.onValue !== 'undefined') ? params.onValue : true;
        this.offValue = (typeof params.offValue !== 'undefined') ? params.offValue : false;
        if (typeof this.settings['value'] === 'undefined') {
            this.isChecked = ko.pureComputed(() => false);
        }
        else {
            this.isChecked = ko.computed({
                read: () => {
                    return this.settings.value.value() === ko.unwrap(this.onValue);
                },
                write: (newValue) => {
                    this.settings.value.value(ko.unwrap(newValue ? this.onValue : this.offValue));
                },
                deferEvaluation: true
            });
        }
    }
    get classes() {
        return ['ame-toggle-checkbox-control', ...super.classes];
    }
}
//Unlike the HTML version of this control, the Knockout version doesn't have
//a second, hidden checkbox. This is because the component is entirely JS-based
//and doesn't need to be submitted as part of a form.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeToggleCheckbox, `
	<label data-bind="class: classString">
		<input type="checkbox" data-bind="checked: isChecked, attr: inputAttributes, 
			class: inputClassString, enable: isEnabled">
		<span data-bind="text: label"></span>
		<!-- ko if: (description) -->
			<!-- ko component: {name: 'ame-nested-description', params: {description: description}} --><!-- /ko -->
		<!-- /ko -->
	</label>	
`));
//# sourceMappingURL=ame-toggle-checkbox.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-unit-dropdown/ame-unit-dropdown.js":
/*!***************************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-unit-dropdown/ame-unit-dropdown.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmeUnitDropdown": () => (/* binding */ AmeUnitDropdown),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");

class AmeUnitDropdown extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.dropdownData = params.optionData || {
            options: [],
            optionsText: 'text',
            optionsValue: 'value'
        };
        this.selectId = params.id || '';
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeUnitDropdown, `
	<select data-bind="options: dropdownData.options, optionsText: dropdownData.optionsText, 
		optionsValue: dropdownData.optionsValue, value: valueProxy, class: classString,
		attr: {id: selectId}"></select>
`));
//# sourceMappingURL=ame-unit-dropdown.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/ame-wp-editor/ame-wp-editor.js":
/*!*******************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/ame-wp-editor/ame-wp-editor.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _control_base_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../control-base.js */ "./extras/pro-customizables/ko-components/control-base.js");


//Note: Requires Lodash, but does not explicitly import it because this plugin
//already uses Lodash as a global variable (wsAmeLodash) in many places. Code
//that uses this component should make sure that Lodash is loaded.
let autoAssignedIdCounter = 0;
/**
 * List of visual editor buttons that are visible in the "teeny" mode.
 *
 * Found in /wp-includes/class-wp-editor.php, the editor_settings() method.
 * The relevant code is around line #601 (as of WP 6.1.1).
 */
const TeenyButtons = [
    'bold',
    'italic',
    'underline',
    'blockquote',
    'strikethrough',
    'bullist',
    'numlist',
    'alignleft',
    'aligncenter',
    'alignright',
    'undo',
    'redo',
    'link',
    'fullscreen'
];
/**
 * List of Quicktags editor buttons that are visible by default.
 *
 * The default list of text editor buttons used by wp.editor.initialize()
 * doesn't match the defaults used by wp_editor() in PHP. Let's copy the list
 * from /includes/class-wp-editor.php.
 */
const DefaultQuicktagsButtons = [
    'strong', 'em', 'link', 'block', 'del', 'ins', 'img', 'ul', 'ol', 'li', 'code', 'more', 'close'
];
class AmeWpEditor extends _control_base_js__WEBPACK_IMPORTED_MODULE_0__.KoStandaloneControl {
    constructor(params, $element) {
        super(params, $element);
        this.editorId = null;
        this.isWpEditorInitialized = false;
        const textSetting = this.settings.value;
        if (typeof textSetting === 'undefined') {
            throw new Error('Visual Editor control is missing the required setting');
        }
        this.rows = params.rows || 6;
        this.isTeeny = !!params.teeny;
    }
    getAdditionalInputAttributes() {
        return Object.assign({ rows: this.rows.toString() }, super.getAdditionalInputAttributes());
    }
    koDescendantsComplete() {
        const $textArea = this.findChild('textarea.ame-wp-editor-textarea');
        if ($textArea.length === 0) {
            return;
        }
        const currentValue = this.valueProxy();
        $textArea.val((currentValue === null) ? '' : currentValue.toString());
        //The textarea must have an ID for wp.editor.initialize() to work.
        {
            let editorId = $textArea.attr('id');
            if (!editorId) {
                editorId = 'ws-ame-wp-editor-aid-' + (autoAssignedIdCounter++);
                $textArea.attr('id', editorId);
            }
            this.editorId = editorId;
        }
        //Update the setting when the contents of the underlying textarea change.
        //This happens when the user selects the "Text" tab in the editor, or when
        //TinyMCE is unavailable (e.g. if the "Disable the visual editor when writing"
        //option is checked in the user's profile).
        $textArea.on('change input', this.throttleUpdates(() => $textArea.val()));
        let editorSettings = {
            tinymce: {
                wpautop: true
            },
            quicktags: {
                //The default list of text editor buttons used by wp.editor.initialize()
                //doesn't match the defaults used by wp_editor() in PHP. Let's copy the list
                //from /includes/class-wp-editor.php.
                buttons: DefaultQuicktagsButtons.join(','),
            },
            //Include the "Add Media" button.
            mediaButtons: true,
        };
        if (typeof window['tinymce'] === 'undefined') {
            //TinyMCE is disabled or not available.
            editorSettings.tinymce = false;
        }
        if (this.isTeeny && (typeof editorSettings.tinymce === 'object')) {
            editorSettings.tinymce.toolbar1 = TeenyButtons.join(',');
            editorSettings.tinymce.toolbar2 = '';
        }
        const $document = jQuery(document);
        const self = this;
        //After the editor finishes initializing, add an event listener to update
        //the setting when the contents of the visual editor change.
        $document.on('tinymce-editor-init', function addMceChangeListener(event, editor) {
            if (editor.id !== self.editorId) {
                return; //Not our editor.
            }
            //According to the TinyMCE documentation, the "Change" event is fired
            //when "changes [...] cause an undo level to be added". This could be
            //too frequent for our purposes, so we'll throttle the callback.
            editor.on('Change', self.throttleUpdates(() => editor.getContent()));
            $document.off('tinymce-editor-init', addMceChangeListener);
        });
        //Unfortunately, as of WP 6.2-beta, wp.editor.initialize() doesn't add
        //the "wp-editor-container" wrapper when only the Quicktags editor is used.
        //This means the editor won't be styled correctly. Let's fix that.
        $document.on('quicktags-init', function maybeAddEditorWrapper(event, editor) {
            if (!editor || (editor.id !== self.editorId)) {
                return;
            }
            if (editor.canvas) {
                const $textarea = jQuery(editor.canvas);
                const $wrapper = $textarea.closest('.wp-editor-container');
                if ($wrapper.length === 0) {
                    //Also include the toolbar in the wrapper.
                    const $toolbar = $textarea.prevAll('.quicktags-toolbar').first();
                    $textarea.add($toolbar).wrapAll('<div class="wp-editor-container"></div>');
                }
            }
            $document.off('quicktags-init', maybeAddEditorWrapper);
        });
        //Finally, initialize the editor.
        wp.editor.initialize($textArea.attr('id'), editorSettings);
        this.isWpEditorInitialized = true;
    }
    /**
     * Create a throttled function that updates the setting.
     *
     * There are multiple ways to get the contents of the editor (e.g. TinyMCE mode
     * vs a plain textarea), so using a utility function helps avoid code duplication.
     *
     * @param valueGetter
     * @protected
     */
    throttleUpdates(valueGetter) {
        const textSetting = this.settings.value;
        return wsAmeLodash.throttle(function () {
            textSetting.value(valueGetter());
            return void 0;
        }, 1000, { leading: true, trailing: true });
    }
    dispose() {
        //Destroy the editor. It's not clear whether this is necessary, but it's
        //probably a good idea to give WP a chance to clean up.
        if (this.isWpEditorInitialized && (this.editorId !== null)) {
            wp.editor.remove(this.editorId);
            this.isWpEditorInitialized = false;
        }
        super.dispose();
    }
}
//Note: The class of the textarea element is set directly instead of using a binding
//because it must always have the "wp-editor-area" class for it to render correctly
//(apparently, wp.editor.initialize() does not automatically add that class).
//Knockout should not be able to remove the class.
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_control_base_js__WEBPACK_IMPORTED_MODULE_0__.createControlComponentConfig)(AmeWpEditor, `
	<textarea data-bind="attr: inputAttributes" class="wp-editor-area ame-wp-editor-textarea" cols="40"></textarea>	
`));
//# sourceMappingURL=ame-wp-editor.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/control-base.js":
/*!****************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/control-base.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComponentBindingOptions": () => (/* binding */ ComponentBindingOptions),
/* harmony export */   "KoComponentViewModel": () => (/* binding */ KoComponentViewModel),
/* harmony export */   "KoContainerViewModel": () => (/* binding */ KoContainerViewModel),
/* harmony export */   "KoControlViewModel": () => (/* binding */ KoControlViewModel),
/* harmony export */   "KoDependentControl": () => (/* binding */ KoDependentControl),
/* harmony export */   "KoRendererViewModel": () => (/* binding */ KoRendererViewModel),
/* harmony export */   "KoStandaloneControl": () => (/* binding */ KoStandaloneControl),
/* harmony export */   "createComponentConfig": () => (/* binding */ createComponentConfig),
/* harmony export */   "createControlComponentConfig": () => (/* binding */ createControlComponentConfig),
/* harmony export */   "createRendererComponentConfig": () => (/* binding */ createRendererComponentConfig)
/* harmony export */ });
/* harmony import */ var _assets_customizable_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../assets/customizable.js */ "./extras/pro-customizables/assets/customizable.js");

var Setting = _assets_customizable_js__WEBPACK_IMPORTED_MODULE_0__.AmeCustomizable.Setting;
var InterfaceStructure = _assets_customizable_js__WEBPACK_IMPORTED_MODULE_0__.AmeCustomizable.InterfaceStructure;
var Control = _assets_customizable_js__WEBPACK_IMPORTED_MODULE_0__.AmeCustomizable.Control;
class KoComponentViewModel {
    constructor(params, $element) {
        var _a;
        this.params = params;
        this.$element = $element;
        this.isBoundToComment = ($element[0]) && ($element[0].nodeType === Node.COMMENT_NODE);
        this.uiElement = null;
        const expectedType = this.getExpectedUiElementType();
        if (expectedType !== null) {
            if ((typeof params.uiElement !== 'undefined')
                && (params.uiElement instanceof expectedType)) {
                this.uiElement = params.uiElement;
            }
            else {
                throw new Error('uiElement is not a ' + expectedType.name + ' instance.');
            }
        }
        else if ((typeof params.uiElement !== 'undefined') && !(this instanceof KoStandaloneControl)) {
            console.warn('Unexpected "uiElement" parameter for ' + this.constructor.name
                + ' that did not expect an UI element. Did you forget to override getExpectedUiElementType() ?', params.uiElement);
        }
        if (typeof params.children !== 'undefined') {
            if (Array.isArray(params.children) || this.isObservableArray(params.children)) {
                this.inputChildren = params.children;
            }
            else {
                throw new Error('Invalid "children" parameter: expected an array or an observable array.');
            }
        }
        else {
            this.inputChildren = [];
        }
        this.customClasses = ((typeof params.classes === 'object') && Array.isArray(params.classes)) ? params.classes : [];
        this.customStyles = ((typeof params.styles === 'object') && (params.styles !== null)) ? params.styles : {};
        if (typeof params.enabled !== 'undefined') {
            if (ko.isObservable(params.enabled)) {
                this.isEnabled = params.enabled;
            }
            else {
                this.isEnabled = ko.pureComputed(() => !!params.enabled);
            }
        }
        else {
            this.isEnabled = ko.pureComputed(() => true);
        }
        //Get the description either from the "description" parameter or from the UI element.
        this.description = params.description
            ? ko.unwrap(params.description.toString())
            : (((_a = this.uiElement) === null || _a === void 0 ? void 0 : _a.description) || '');
    }
    dispose() {
        //Does nothing by default.
    }
    getExpectedUiElementType() {
        return null;
    }
    get classes() {
        return [].concat(this.customClasses);
    }
    // noinspection JSUnusedGlobalSymbols -- Used in Knockout templates.
    get classString() {
        return this.classes.join(' ');
    }
    get styles() {
        return Object.assign({}, this.customStyles);
    }
    findChild(selector, allowSiblingSearch = null) {
        if (allowSiblingSearch === null) {
            //Enable only if the component is bound to a comment (i.e. "<!-- ko component: ... -->").
            allowSiblingSearch = this.isBoundToComment;
        }
        if (this.isBoundToComment) {
            if (allowSiblingSearch) {
                return this.$element.nextAll(selector).first();
            }
            else {
                //We would never find anything because a comment node has no children.
                return jQuery();
            }
        }
        return this.$element.find(selector);
    }
    isObservableArray(value) {
        return (typeof value === 'object')
            && (value !== null)
            && (typeof value.slice === 'function')
            && (typeof value.indexOf === 'function')
            && (ko.isObservable(value));
    }
}
function makeCreateVmFunctionForComponent(ctor) {
    return function (params, componentInfo) {
        const $element = jQuery(componentInfo.element);
        return new ctor(params, $element);
    };
}
function createComponentConfig(ctor, templateString) {
    return {
        viewModel: {
            createViewModel: makeCreateVmFunctionForComponent(ctor),
        },
        template: templateString,
    };
}
//endregion
//region Container
class ComponentBindingOptions {
    // noinspection JSUnusedGlobalSymbols -- the uiElement property is used in the KO template of AC control groups.
    constructor(name, params, uiElement) {
        this.name = name;
        this.params = params;
        this.uiElement = uiElement;
        if (name === '') {
            throw new Error('Component name cannot be empty.');
        }
    }
    static fromElement(element, overrideComponentName = null) {
        if (!element.component && (overrideComponentName === null)) {
            throw new Error(`Cannot create component binding options for UI element "${element.id}" without a component name.`);
        }
        return new ComponentBindingOptions(overrideComponentName || element.component, element.getComponentParams(), element);
    }
}
class KoContainerViewModel extends KoComponentViewModel {
    constructor(params, $element) {
        if (typeof params.children === 'undefined') {
            throw new Error('Missing "children" parameter.');
        }
        super(params, $element);
        this.title = ko.pureComputed(() => {
            if (typeof params.title !== 'undefined') {
                let title = ko.unwrap(params.title);
                if ((title !== null) && (typeof title !== 'undefined')) {
                    return title.toString();
                }
            }
            if (this.uiElement) {
                return this.uiElement.title;
            }
            return '';
        });
        this.childComponents = ko.pureComputed(() => {
            const result = ko.unwrap(this.inputChildren)
                .map(child => this.mapChildToComponentBinding(child))
                .filter(binding => binding !== null);
            //TypeScript does not recognize that the filter() call above removes
            //all null values, so we need an explicit cast.
            return result;
        });
    }
    mapChildToComponentBinding(child) {
        //Does not map any children by default.
        return null;
    }
    dispose() {
        super.dispose();
        this.childComponents.dispose();
    }
}
//endregion
//region Control
class KoControlViewModel extends KoComponentViewModel {
    constructor(params, $element) {
        var _a;
        super(params, $element);
        this.settings =
            ((typeof params.settings === 'object') && isSettingMap(params.settings))
                ? params.settings
                : {};
        if (typeof this.settings.value !== 'undefined') {
            this.valueProxy = this.settings.value.value;
        }
        else {
            this.valueProxy = ko.pureComputed(() => {
                console.error('Missing "value" setting for a control component.', this.settings, params);
                return '';
            });
        }
        //Input ID will be provided by the server if applicable.
        this.primaryInputId = (typeof params.primaryInputId === 'string') ? params.primaryInputId : null;
        this.inputAttributes = ko.pureComputed(() => {
            var _a;
            const attributes = ((_a = this.uiElement) === null || _a === void 0 ? void 0 : _a.inputAttributes) || {};
            const inputId = this.getPrimaryInputId();
            if ((inputId !== null) && (inputId !== '')) {
                attributes.id = inputId;
            }
            //Note: The "name" field is not used because these controls are entirely JS-driven.
            const additionalAttributes = this.getAdditionalInputAttributes();
            for (const key in additionalAttributes) {
                if (!additionalAttributes.hasOwnProperty(key)) {
                    continue;
                }
                attributes[key] = additionalAttributes[key];
            }
            return attributes;
        });
        if ((typeof params.label !== 'undefined') && (params.label !== null)) {
            const unwrappedLabel = ko.unwrap(params.label);
            this.label = (typeof unwrappedLabel === 'undefined') ? '' : unwrappedLabel.toString();
        }
        else {
            this.label = ((_a = this.uiElement) === null || _a === void 0 ? void 0 : _a.label) || '';
        }
    }
    get inputClasses() {
        var _a;
        return ((_a = this.uiElement) === null || _a === void 0 ? void 0 : _a.inputClasses) || [];
    }
    // noinspection JSUnusedGlobalSymbols -- Used in Knockout templates.
    get inputClassString() {
        return this.inputClasses.join(' ');
    }
    getAdditionalInputAttributes() {
        return {};
    }
    getPrimaryInputId() {
        return this.primaryInputId;
    }
}
function isSettingMap(value) {
    if (value === null) {
        return false;
    }
    if (typeof value !== 'object') {
        return false;
    }
    const valueAsRecord = value;
    for (const key in valueAsRecord) {
        if (!valueAsRecord.hasOwnProperty(key)) {
            continue;
        }
        if (!(valueAsRecord[key] instanceof Setting)) {
            return false;
        }
    }
    return true;
}
/**
 * A control that doesn't use or need a UI element instance, but can still have
 * settings and other parameters typically associated with controls.
 */
class KoStandaloneControl extends KoControlViewModel {
}
/**
 * A control that requires a UI element of the "Control" class.
 */
class KoDependentControl extends KoControlViewModel {
    getExpectedUiElementType() {
        return Control;
    }
}
function createControlComponentConfig(ctor, templateString) {
    return {
        viewModel: {
            createViewModel: makeCreateVmFunctionForComponent(ctor),
        },
        template: templateString,
    };
}
//endregion
//region Renderer
class KoRendererViewModel extends KoComponentViewModel {
    constructor(params, $element) {
        super(params, $element);
        if ((typeof params.structure !== 'object') || !(params.structure instanceof InterfaceStructure)) {
            throw new Error('Invalid interface structure for a renderer component.');
        }
        this.structure = params.structure;
    }
}
function createRendererComponentConfig(ctor, templateString) {
    return {
        viewModel: {
            createViewModel: makeCreateVmFunctionForComponent(ctor),
        },
        template: templateString,
    };
}
//endregion
//# sourceMappingURL=control-base.js.map

/***/ }),

/***/ "./extras/pro-customizables/ko-components/lazy-popup-slider-adapter.js":
/*!*****************************************************************************!*\
  !*** ./extras/pro-customizables/ko-components/lazy-popup-slider-adapter.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "LazyPopupSliderAdapter": () => (/* binding */ LazyPopupSliderAdapter)
/* harmony export */ });
/// <reference path="../../../customizables/assets/popup-slider.d.ts" />
/**
 * This is a wrapper for the popup slider that initializes the slider on first use.
 * It's useful for Knockout components.
 */
class LazyPopupSliderAdapter {
    constructor(sliderRanges, containerSelector = '.ame-container-with-popup-slider', inputSelector = 'input', sliderOptions = {}) {
        this.sliderRanges = sliderRanges;
        this.containerSelector = containerSelector;
        this.inputSelector = inputSelector;
        this.sliderOptions = sliderOptions;
        this.slider = null;
        if (!sliderOptions.hasOwnProperty('ranges')) {
            sliderOptions.ranges = sliderRanges;
        }
        this.handleKoClickEvent = ($data, event) => {
            //Verify that this is one of the inputs we're interested in.
            //Also, disabled inputs should not trigger the slider.
            if (event.target === null) {
                return;
            }
            const $input = jQuery(event.target);
            if ($input.is(':disabled') || !$input.is(this.inputSelector)) {
                return;
            }
            //Short-circuit if the slider is already initialized.
            if (this.slider) {
                this.slider.showForInput($input);
                return;
            }
            //Some sanity checks.
            if (typeof AmePopupSlider === 'undefined') {
                return;
            }
            const $container = $input.closest(this.containerSelector);
            if ($container.length < 1) {
                return;
            }
            this.initSlider($container);
            if (this.slider !== null) {
                //TS doesn't realize that this.initSlider() will initialize the slider.
                this.slider.showForInput($input);
            }
        };
    }
    /**
     * Initialize the slider if it's not already initialized.
     */
    initSlider($container) {
        if (this.slider) {
            return;
        }
        //In HTML, we would pass the range data as a "data-slider-ranges" attribute,
        //but here they are passed via the "ranges" option (see the constructor).
        this.slider = AmePopupSlider.createSlider($container, this.sliderOptions);
    }
}
//# sourceMappingURL=lazy-popup-slider-adapter.js.map

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["customizable"], () => (__webpack_exec__("./extras/modules/admin-customizer/admin-customizer.ts")));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=admin-customizer.bundle.js.map