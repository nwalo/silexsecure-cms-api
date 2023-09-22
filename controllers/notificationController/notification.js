const Notification = require("../../models/notification");

const createNotification = async (data) => {
  try {
    const notif = await Notification.create(data);

    return notif;
  } catch (error) {
    return error;
  }
};

module.exports = { createNotification };
