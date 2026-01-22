const Contact = require("../models/contact.model");

module.exports.createContact = async (req, res) => {
  console.log("hy");

  try {
    const { email, name, phone, message } = req.body;

    if (!email || !name || !phone || !message) {
      return res.status(400).json({ message: "All field must be required" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number",
      });
    }

    const contact = await Contact.create({
      email,
      name,
      phone,
      message,
    });
    res.status(200).json({ message: "Created", contact });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports.getAllContact = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    if (contacts.length === 0) {
      return res.status(400).json({ message: "No contact exists" });
    }

    const getRelativeDateLabel = (date) => {
      const today = new Date();
      const targetDate = new Date(date);

      today.setHours(0, 0, 0, 0);
      targetDate.setHours(0, 0, 0, 0);

      const diffTime = today - targetDate;
      console.log(diffTime);

      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      console.log(diffDays);

      if (diffDays === 0) return "Today";
      if (diffDays === 1) return "Yesterday";
      return `${diffDays} days ago`;
    };

    const formattedContacts = contacts.map((contact) => ({
      ...contact.toObject(),
      relativeDate: getRelativeDateLabel(contact.createdAt),
    }));

    res
      .status(200)
      .json({ message: "All contacts", contacts: formattedContacts });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong", error: error.message });
  }
};

module.exports.deleteContact = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedContact = await Contact.findByIdAndDelete(id);
    if (!deletedContact) {
      return res
        .status(400)
        .json({ message: "Contact is not exists for this id" });
    }

    res.status(200).json({ message: "Contact deleted ", deletedContact });
  } catch (error) {
    res
      .status(500)
      .json({ messsage: "Something went wrong", error: error.message });
  }
};
