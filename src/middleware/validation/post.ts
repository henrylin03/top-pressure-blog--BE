import { body } from "express-validator";

const validatePost = [
	body("title")
		.trim()
		.isLength({ min: 3, max: 100 })
		.withMessage("Title must be between 3 and 100 characters"),

	body("lede")
		.trim()
		.isLength({ max: 1800 })
		.withMessage("Lede (tl;dr section) must be under 1,800 characters"),

	body("text")
		.trim()
		.isLength({ min: 50, max: 15000 })
		.withMessage("Blog post must be between 50 and 15,000 characters"),
];

export default validatePost;
