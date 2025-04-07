// Import necessary testing utilities from the @testing-library/react package
import { render, screen } from '@testing-library/react';
// Import the App component to test
import App from './App';

// Define a test case for rendering the "learn react" link in the App component
test('renders learn react link', () => {
  // Render the App component into the virtual DOM
  render(<App />);

  // Query the document to find the element that contains the text "learn react"
  const linkElement = screen.getByText(/learn react/i);

  // Assert that the link element is in the document (i.e., it has been rendered)
  expect(linkElement).toBeInTheDocument();
});
