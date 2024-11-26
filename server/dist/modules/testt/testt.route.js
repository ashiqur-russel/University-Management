"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const testt_controller_1 = require("./testt.controller");
const router = (0, express_1.Router)();
router.get("/", testt_controller_1.TesttController.findAll);
exports.default = router;
