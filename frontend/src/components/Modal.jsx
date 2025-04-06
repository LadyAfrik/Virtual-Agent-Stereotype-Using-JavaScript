import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "OK",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  // Close modal when clicking outside the modal
  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel(); // or call onConfirm if you prefer
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleOutsideClick}
        >
          <motion.div
            className="bg-white rounded-xl shadow-lg w-96 p-6 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {title && <h3 className="text-xl font-semibold mb-3">{title}</h3>}
            <p className="mb-6">{message}</p>
            <div className="flex justify-center gap-4">
              {cancelText && (
                <button
                  onClick={onCancel}
                  className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400"
                >
                  {cancelText}
                </button>
              )}
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
