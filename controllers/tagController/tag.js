const Tag = require("../../models/tag");

const getTags = async (req, res) => {
  try {
    const tags = await Tag.find({});
    res.status(200).json({ message: "success", data: tags });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const deleteTag = async (req, res) => {
  try {
    const { tagId } = req.params;
    await Tag.deleteOne({ _id: tagId });
    const tags = await Tag.find({});
    res.status(200).json({
      message: "Tag has been deleted.",
      data: tags,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error });
  }
};

const createTag = async (req, res) => {
  try {
    const findTag = await Tag.findOne({ title: req.body.title });

    if (findTag) {
      return res.status(400).json({ message: "Tag already exist" });
    } else {
      const tag = new Tag(req.body);

      let result = await tag.save();

      res.status(200).json({
        message: "Tag has been created.",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

module.exports = { createTag, getTags, deleteTag };
