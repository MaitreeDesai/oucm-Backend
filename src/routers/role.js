const express = require("express");
const { createRole, listRole } = require("../controllers/rolecontroller");
const router = express.Router();


router.post("/createRole",createRole);

router.post("/listRole", listRole);

module.exports = router; 