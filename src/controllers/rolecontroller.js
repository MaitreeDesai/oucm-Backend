const Role = require("../models/role");

const createRole = async (req, res) => {
  const role = new Role(req.body);

  try {
    await role.save();

    res.status(201).send({
      role,
      message: "Role Created",
    });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

const listRole = async (req, res) => {
  try {
    const role = await Role.find({});

    res.send({ role, message: "Role fetch Successful" });
  } catch (e) {
    res.status(400).send({ error: e.message });
  }
};

module.exports = {
  createRole,
  listRole,
};
