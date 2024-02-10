"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/no-var-requires
var envalid_1 = require("envalid");
// eslint-disable-next-line @typescript-eslint/no-var-requires
var validators_1 = require("envalid/dist/validators");

exports.default = (0, envalid_1.cleanEnv)(process.env, {
    MONGODB_URI: (0, validators_1.str)(),
    PORT: (0, validators_1.port)(),
    SECRET: (0, validators_1.str)(),
});
