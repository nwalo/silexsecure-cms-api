const BlogPost = require("../../models/blogPost");
const ArticlePost = require("../../models/articlePost");
const User = require("../../models/user");
const Notification = require("../../models/notification");
const moment = require("moment");

const getCurrentYear = () => {
  return moment().year();
};

const webStatistics = async (req, res) => {
  try {
    const blogs = await BlogPost.countDocuments({});
    const articles = await ArticlePost.countDocuments({});
    const users = await User.countDocuments({});
    const currentYear = getCurrentYear();

    const result = await BlogPost.aggregate([
      {
        $match: {
          createdAt: {
            $gte: moment(`${currentYear}-01-01`).toDate(), // This year
            $lt: moment(`${currentYear + 1}-01-01`).toDate(), // next year
          },
        },
      },
      {
        $group: {
          _id: {
            $month: "$createdAt",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort the results by month (1 to 12)
      },
    ]);

    const counts = Array(12).fill(0);

    // Update the array with counts from the aggregation result
    result.forEach((entry) => {
      counts[entry._id - 1] = entry.count;
    });

    const data = {
      blogs,
      articles,
      users,
      monthlyBlogPost: counts,
    };

    res.status(200).json({ message: "Website statistics.", data: data });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const recentChanges = async (req, res) => {
  try {
    console.log("recentChanges");
    const notif = await Notification.find({ read: false });
    res.status(200).json({ message: "Recent changes.", data: notif });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

module.exports = {
  webStatistics,
  recentChanges,
};

// total no of blogs
// total no of articles
// blog post/month [Array of 12]
// total no of users

// Recent blogs

// Recent Notification
