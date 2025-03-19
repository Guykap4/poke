"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entityRoutes = void 0;
const express_1 = require("express");
const entityController_1 = require("../controllers/entityController");
const router = (0, express_1.Router)();
router.get('/', entityController_1.getEntities);
exports.entityRoutes = router;
