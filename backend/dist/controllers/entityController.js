"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEntities = getEntities;
const entityService_1 = require("../services/entityService");
function getEntities() {
    return entityService_1.entityService.queryEntities();
}
