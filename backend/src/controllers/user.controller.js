import { User } from "../models/user.model.js";

// Добавляем next в аргументы каждой функции
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Проверка обязательных полей
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are important!" });
    }

    // Проверка существующего пользователя
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "user already exists" });
    }

    // Создание пользователя
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password,
      loggedIn: false,
    });

    res.status(201).json({
      message: "User registered",
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    // Теперь ошибка корректно обрабатывается и не вызывает "next is not a function"
    console.error("DEBUG ERROR:", error.message);
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user)
      return res.status(400).json({
        message: "User not found",
      });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({
        message: "invalid credentials",
      });

    res.status(200).json({
      message: "User logged in",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("DEBUG ERROR:", error.message);
    next(error);
  }
};

const logoutuser = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user)
      return res.status(404).json({
        message: "user not found",
      });

    res.status(200).json({
      message: "logout successfull",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal problems", error: error.message });
  }
};

export { registerUser, loginUser, logoutuser };
