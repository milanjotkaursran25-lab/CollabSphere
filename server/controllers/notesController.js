
const Note = require("../models/Note");


const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      owner: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      notes
    });
  } catch (error) {
    console.error("Get notes error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notes"
    });
  }
};


const createNote = async (req, res) => {
  try {
    const { title, content, project, projectName } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required"
      });
    }

    const note = await Note.create({
      title: title.trim(),
      content,
      owner: req.user.id,
      ...(project ? { project } : {})
    });

    return res.status(201).json({
      success: true,
      message: "Note created successfully",
      note
    });
  } catch (error) {
    console.error("Create note error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create note"
    });
  }
};


const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found"
      });
    }

    await note.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Note deleted successfully"
    });
  } catch (error) {
    console.error("Delete note error:", error.message);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid note ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete note"
    });
  }
};

module.exports = {
  getNotes,
  createNote,
  deleteNote
};
