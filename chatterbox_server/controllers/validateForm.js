const Yup = require("yup");

// Define the schema for form validation using Yup
const formSchema = Yup.object({
  username: Yup.string()
    .required("Username is required!") // Username is required
    .min(6, "Username is too short!") // Minimum length of 6 characters
    .max(128, "Username is too long!"), // Maximum length of 128 characters
  password: Yup.string()
    .required("Password is required!") // Password is required
    .min(6, "Password is too short!") // Minimum length of 6 characters
    .max(128, "Password is too long!"), // Maximum length of 128 characters
});

const validateForm = (req, res, next) => {
  const formData = req.body; // Extract form data from the request body

  // Validate the form data against the schema
  formSchema
    .validate(formData, { abortEarly: false }) // Ensure all errors are collected
    .then(() => {
      console.log("Validation successful");
    })
    .catch((err) => {
      console.log("Validation failed:", err);
      const errors =
        err.inner && err.inner.length > 0
          ? err.inner.map((e) => e.message)
          : [err.message]; // Fallback to top-level error message if no inner errors
      console.log("Formatted errors:", errors);
      res.status(422).json({ errors }); // Send an error response with status 422
      next();
    });
};

module.exports = validateForm;
