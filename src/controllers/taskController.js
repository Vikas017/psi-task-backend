const Task = require("../models/Task");

exports.createTask = async (req, res) => {
  try {
    const docs = req.files ? req.files.map(f => f.path) : [];
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);
    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      status: req.body.status || "todo",
      priority: req.body.priority,
      dueDate: req.body.dueDate,
      assignedTo: req.body.assignedTo,
      documents: docs
    });

    res.json(task);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    console.log("GET TASKS HIT");
    const { status, priority, sort = "dueDate", page = 1 } = req.query;

    const query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    // USER sees only their tasks
    if (req.user.role !== "admin") {
      query.assignedTo = req.user.id;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "email")
      .sort({ [sort]: 1 })
      .skip((page - 1) * 10)
      .limit(10);

    res.json(tasks);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: "Not found" });

    //   ADMIN FULL CONTROL
    if (req.user.role === "admin") {

      //   remove selected docs
      let existingDocs = task.documents;

      if (req.body.removeDocs) {
        const removeDocs = JSON.parse(req.body.removeDocs);

        existingDocs = existingDocs.filter(
          doc => !removeDocs.includes(doc)
        );
      }

      //   add new uploaded docs
      const newDocs = req.files ? req.files.map(f => f.path) : [];

      const updatedDocs = [...existingDocs, ...newDocs];

      const updated = await Task.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
          documents: updatedDocs
        },
        { new: true }
      );

      return res.json(updated);
    }

    // 👤 USER → only status
    task.status = req.body.status || task.status;
    await task.save();

    res.json(task);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    // only admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};