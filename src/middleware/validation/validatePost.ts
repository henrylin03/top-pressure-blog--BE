import { body } from "express-validator";

const validatePost = [
	body("title")
		.isLength({ min: 3, max: 60 })
		.withMessage("Title must be between 3 and 60 characters"),

	body("text")
		.isLength({ min: 50, max: 15000 })
		.withMessage("Blog post must be between 50 and 15,000 characters"),
];

export default validatePost;
