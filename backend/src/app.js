"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = require("express");
var cors_1 = require("cors");
var morgan_1 = require("morgan");
var cookie_parser_1 = require("cookie-parser");
var api_1 = require("./routes/api");
var compression_1 = require("compression");
var helmet_1 = require("helmet");
var express_rate_limit_1 = require("express-rate-limit");
var app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "https://photo-tagging-app-6rhb.vercel.app",
    credentials: true // If your frontend sends cookies or authorization headers
}));
app.use((0, compression_1.default)());
app.use(helmet_1.default.contentSecurityPolicy({
    directives: {
        "script-src": ["'self'"],
    },
}));
var limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
});
// Apply rate limiter to all requests
app.use(limiter);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use('/api/v1', api_1.default);
app.get('/', function (req, res) {
    res.json('hi');
});
exports.default = app;
