"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const axios_1 = __importDefault(require("axios"));
(0, globals_1.describe)("Health Check", () => {
    const healthEndpoint = "http://localhost:3000/api/v1/checkup/health";
    (0, globals_1.it)("should return 200 OK", () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.get(healthEndpoint);
            (0, globals_1.expect)(response.status).toBe(200);
        }
        catch (error) {
            throw error;
        }
    }));
});
//# sourceMappingURL=health.test.js.map