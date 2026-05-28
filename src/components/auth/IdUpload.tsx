'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface IdUploadProps {
  onImageSelect: (file: File) => void;
  preview?: string;
  loading?: boolean;
  error?: string;
}

export function IdUpload({ onImageSelect, preview, loading = false, error }: IdUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(preview || '');

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('File size must be less than 5MB');
          return;
        }

        // Create preview URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
          onImageSelect(file);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    multiple: false,
    disabled: loading,
  });

  const clearPreview = () => {
    setPreviewUrl('');
  };

  const dropzoneProps = getRootProps();
  const inputProps = getInputProps();

  return (
    <div className="w-full max-w-md mx-auto">
      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 shadow-2xl"
          >
            <div className="aspect-video relative">
              <img
                src={previewUrl}
                alt="ID Preview"
                className="w-full h-full object-cover"
              />
              {/* Logo watermark effect */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>

            {/* Preview metadata */}
            <div className="p-4 bg-gray-900/50 backdrop-blur-sm border-t border-gray-700">
              <p className="text-sm text-gray-300 font-medium">ID Document Preview</p>
              <p className="text-xs text-gray-500 mt-1">
                {loading ? 'Uploading...' : 'Ready to submit'}
              </p>

              {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
            </div>

            {/* Clear button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearPreview}
              disabled={loading}
              className="absolute top-3 right-3 bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white p-2 rounded-full transition-colors shadow-lg"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <div
            key="dropzone"
            {...dropzoneProps}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 cursor-pointer group ${
              isDragActive
                ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20'
                : 'border-gray-600 hover:border-gray-500 bg-gray-900/50 hover:bg-gray-900'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <input {...inputProps} />

              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative z-10">
                <motion.div
                  animate={isDragActive ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="mb-4 inline-block"
                >
                  <Upload
                    className={`w-12 h-12 transition-colors ${
                      isDragActive
                        ? 'text-blue-400'
                        : 'text-gray-500 group-hover:text-gray-400'
                    }`}
                  />
                </motion.div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {loading ? 'Uploading...' : 'Upload Your Student ID'}
                </h3>

                <p className="text-sm text-gray-400 mb-2">
                  Drag and drop your ID card or click to browse
                </p>

                <p className="text-xs text-gray-500">
                  Supported formats: JPEG, PNG, WebP • Max size: 5MB
                </p>

                {error && <p className="text-xs text-red-400 mt-4">{error}</p>}
              </div>

              {/* Animated border glow on drag */}
              {isDragActive && (
                <motion.div
                  className="absolute inset-0 border-2 border-blue-500 rounded-lg"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                      '0 0 40px rgba(59, 130, 246, 0.3)',
                      '0 0 20px rgba(59, 130, 246, 0.5)',
                    ],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Export a standalone version with hook support
export function IdUploadWithState() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleImageSelect = (file: File) => {
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <IdUpload
      onImageSelect={handleImageSelect}
      preview={preview}
      loading={loading}
      error={error}
    />
  );
}
