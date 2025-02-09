import { AnimatePresence, motion } from "framer-motion";

interface ToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
}

export const Toast = ({ message, type, isVisible, onClose }: ToastProps) => {
  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-4 right-4 z-50"
      >
        <div
          className={`${
            type === "success" ? "bg-green-500" : "bg-red-500"
          } text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2`}
        >
          <span>{message}</span>
          <button onClick={onClose} className="ml-2 hover:opacity-80">
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
