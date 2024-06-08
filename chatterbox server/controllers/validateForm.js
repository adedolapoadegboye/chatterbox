const Yup = require("yup");

// Define the schema for form validation using Yup
const formSchema = Yup.object({
  username: Yup.string()
    .required("Username required") // Username is required
    .min(6, "Username too short") // Minimum length of 6 characters
    .max(128, "Username too long!"), // Maximum length of 128 characters
  password: Yup.string()
    .required("Password required") // Password is required
    .min(6, "Password too short") // Minimum length of 6 characters
    .max(128, "Password too long!"), // Maximum length of 128 characters
});

const validateForm = (req, res) => {
  const formData = req.body; // Extract form data from the request body

  // Validate the form data against the schema
  formSchema
    .validate(formData)
    .then((valid) => {
      // If validation is successful
      if (valid) {
        console.log("Form is good");
        // res.status(200).json({ message: "Form is good" }); // Send a success response
      }
    })
    .catch((err) => {
      // If validation fails
      console.log(err.errors);
      res.status(422).json({ errors: err.errors }).send(); // Send an error response with status 422
    });
};

module.exports = validateForm;
