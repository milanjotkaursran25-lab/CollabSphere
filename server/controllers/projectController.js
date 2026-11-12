
const Project = require("../models/Project");


const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      owner: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    console.error("Get projects error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve projects"
    });
  }
};


const getPublicProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      isPublic: true
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      projects
    });
  } catch (error) {
    console.error("Get public projects error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve public projects"
    });
  }
};


const createProject = async (req, res) => {
  try {
    const { name, description, status, isPublic } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const project = await Project.create({
      name: name.trim(),
      description: description || "",
      status: status || "active",
      isPublic: isPublic === true,
      owner: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      project
    });
  } catch (error) {
    console.error("Create project error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create project"
    });
  }
};


const updateProject = async (req, res) => {
  try {
    const { name, description, status, isPublic } = req.body;

    const updates = {};

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Project name cannot be empty"
        });
      }

      updates.name = name.trim();
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (status !== undefined) {
      updates.status = status;
    }

    if (isPublic !== undefined) {
      updates.isPublic = isPublic;
    }

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project
    });
  } catch (error) {
    console.error("Update project error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update project"
    });
  }
};


const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    console.error("Delete project error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete project"
    });
  }
};

module.exports = {
  getProjects,
  getPublicProjects,
  createProject,
  updateProject,
  deleteProject
};
