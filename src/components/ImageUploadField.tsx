import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface ImageUploadFieldProps {
  value: string;
  onChange: (value: string | File) => void;
  onFileChange?: (file: File | null) => void;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  value,
  onChange,
  onFileChange,
}) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0]; // Only use the first file

      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);

      // Pass the file to the parent component for server upload
      if (onFileChange) {
        onFileChange(file);
      }

      // Update the preview URL in the form
      onChange(previewUrl);
    },
    [onChange, onFileChange]
  );

  // We're not using the value prop directly in this component because
  // the preview is shown in the parent component, but we need to keep it
  // in the props for consistency with the form field pattern

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5 MB
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer transition-colors
        ${
          isDragActive
            ? 'border-orange-500 bg-orange-50'
            : 'border-gray-300 hover:border-orange-500'
        }`}
    >
      <input {...getInputProps()} />
      <Upload className="w-6 h-6 mx-auto mb-2 text-gray-400" />
      <p className="text-sm text-gray-500">
        {isDragActive
          ? 'Drop the image here...'
          : 'Drag & drop an image here, or click to select'}
      </p>
      <p className="text-xs mt-1 text-gray-400">
        JPG, PNG, GIF, WEBP up to 5MB
      </p>
    </div>
  );
};

export default ImageUploadField;
