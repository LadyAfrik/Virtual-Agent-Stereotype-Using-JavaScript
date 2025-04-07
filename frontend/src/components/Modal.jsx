import React from "react"; // Import React to create components
import { motion, AnimatePresence } from "framer-motion"; // Import motion for animations and AnimatePresence for handling component transitions


/**
 * Modal Component
 *
 * This modal component displays a dialog overlay with a title, message, and action buttons.
 * It uses framer-motion for smooth animations when appearing and disappearing.
 *
 * Props:
 * - isOpen (boolean): Determines whether the modal is visible.
 * - title (string): The title to display at the top of the modal.
 * - message (string): The content message to display in the modal.
 * - onConfirm (function): Callback function called when the confirm button is clicked.
 * - onCancel (function): Callback function called when the cancel button is clicked or when clicking outside the modal.
 * - confirmText (string, optional): Text for the confirm button (default is "OK").
 * - cancelText (string, optional): Text for the cancel button (default is "Cancel").
 */
const Modal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  // If the modal is not supposed to be open, render nothing.
  if (!isOpen) return null;

  /**
   * Handle clicks outside the modal content.
   *
   * If the clicked element is the backdrop (and not a child element), invoke the onCancel function.
   *
   * @param {Event} e - The click event.
   */
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel(); // Dismiss the modal when clicking outside its content
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        // Modal backdrop with fade animations
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOutsideClick} // Close modal when clicking on the backdrop
        >
          {/* Modal content container with scale animations */}
          <motion.div
            className="bg-white rounded-xl shadow-lg w-96 p-6 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Render the title only if it is provided */}
            {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
            {/* Display the message content */}
            <p className="mb-6">{message}</p>
            {/* Action buttons container */}
            <div className="flex justify-center gap-4">
              {/* Render the cancel button if cancelText is provided */}
              {cancelText && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                >
                  {cancelText}
                </button>
              )}
              {/* Confirm action button */}
              <button
                onClick={onConfirm}
                className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
