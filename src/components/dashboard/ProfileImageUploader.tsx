// src/components/dashboard/ProfileImageUploader.tsx - Version 3
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, Trash2, RotateCcw, Check, AlertTriangle, Image as ImageIcon } from 'lucide-react';

interface ProfileImageUploaderProps {
  currentImage?: string | null;
  onUpload: (file: File) => Promise<boolean>;
  onClose: () => void;
}

export const ProfileImageUploader: React.FC<ProfileImageUploaderProps> = ({
  currentImage,
  onUpload,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Check file type
    if (!file.type.startsWith('image/')) {
      return 'Please select an image file (JPG, PNG, GIF, WebP)';
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return 'File size must be less than 5MB';
    }

    // Check image dimensions (optional)
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      return 'Please select a valid image format (JPG, PNG, GIF, WebP)';
    }

    return null;
  };

  const handleFileSelect = useCallback((file: File) => {
    setError(null);
    
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOver(false);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);
      
      const success = await onUpload(selectedFile);
      if (success) {
        onClose();
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Update Profile Photo</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3" />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Current Image */}
          {currentImage && !preview && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Current Photo</p>
              <div className="flex justify-center">
                <img
                  src={currentImage}
                  alt="Current profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 shadow-md"
                />
              </div>
            </div>
          )}

          {/* Preview */}
          {preview && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Preview</p>
              <div className="flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-200 shadow-md"
                />
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              dragOver 
                ? 'border-blue-400 bg-blue-50 scale-[1.02]' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                dragOver ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {dragOver ? (
                  <Upload className="w-8 h-8 text-blue-600" />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Choose a photo
                </button>
                <p className="text-gray-500">or drag and drop here</p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, GIF, WebP up to 5MB
                </p>
                <p className="text-xs text-gray-400">
                  Recommended: Square images (1:1 ratio)
                </p>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>

          {/* Selected File Info */}
          {selectedFile && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearSelection}
                  className="text-red-600 hover:text-red-700 transition-colors"
                  title="Remove file"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              disabled={uploading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <Camera className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h5 className="font-medium text-blue-900 mb-1">Photo Tips</h5>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Use a clear, high-quality image</li>
                  <li>• Square images work best for profile photos</li>
                  <li>• Make sure your face is clearly visible</li>
                  <li>• Avoid busy backgrounds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};