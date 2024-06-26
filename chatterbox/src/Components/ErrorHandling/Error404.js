// src/pages/Error404.js
import { Box, Heading, Text, Button, Icon } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi"; // Import an icon for better visual feedback

// Error404 component to display a 404 error page
function Error404() {
  return (
    <Box
      textAlign="center"
      py={10}
      px={6}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bg="gray.50"
      color="gray.700"
    >
      {/* Icon to visually represent the error */}
      <Icon as={FiAlertCircle} w={20} h={20} color="red.500" mb={4} />
      {/* Heading with modern styling to display 404 error */}
      <Heading as="h1" size="2xl" mb={4}>
        404
      </Heading>
      {/* Subtext to inform user the page was not found */}
      <Text fontSize="xl" mb={2}>
        Page Not Found
      </Text>
      <Text fontSize="md" color="gray.500" mb={6}>
        The page you are looking for does not seem to exist.
      </Text>
      {/* Button to navigate back to the home page */}
      <Button as={Link} to="/" colorScheme="teal" variant="solid">
        Go to Home
      </Button>
    </Box>
  );
}

export default Error404;
