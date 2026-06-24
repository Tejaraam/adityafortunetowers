import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-900/75 transition-opacity backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative inline-block w-full ${maxWidth} transform overflow-hidden rounded-2xl bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle`}
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold leading-6 text-gray-900">{title}</h3>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full bg-white p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none transition-colors"
                >
                  <span className="sr-only">Close</span>
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div className="px-4 py-5 sm:p-6 bg-gray-50/50">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
