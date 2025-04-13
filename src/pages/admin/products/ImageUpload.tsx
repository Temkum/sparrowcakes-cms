import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
interface ImageUploadProps {
  value: (File | string)[];
  onChange: (value: (File | string)[]) => void;
  maxFiles?: number;
  isEditMode?: boolean;
}

const validImageTypes = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/bmp',
  'image/svg+xml',
  'image/tiff',
  'image/jpg',
] as const;

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value = [],
  onChange,
  maxFiles = 10,
  isEditMode = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);

  // Helper function to check if an item is a File
  const isFile = (item: File | string): item is File => {
    return item instanceof File;
  };

  // Helper function to check if an item is a URL
  const isUrl = (item: File | string): item is string => {
    return typeof item === 'string';
  };

  // Check if an image is valid based on our schema
  const isValidImageType = (file: File): boolean => {
    return validImageTypes.includes(
      file.type as (typeof validImageTypes)[number]
    );
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Filter out invalid file types
      const validFiles = acceptedFiles.filter(isValidImageType);

      if (validFiles.length !== acceptedFiles.length) {
        alert(
          'Some files were rejected. Please upload only valid image formats (JPEG, PNG, GIF, WEBP, BMP, SVG, TIFF, or JPG).'
        );
      }

      if (validFiles.length === 0) return;

      if (value.length + validFiles.length > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} images.`);
        return;
      }

      setIsUploading(true);
      try {
        // In a real application, here we would upload files to storage
        // For now, we'll just add the File objects directly to the form value
        onChange([...value, ...validFiles]);
      } catch (error) {
        console.error('Upload failed:', error);
        alert('Failed to upload images. Please try again.');
      } finally {
        setIsUploading(false);
      }
    },
    [value, onChange, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [
        '.png',
        '.jpg',
        '.jpeg',
        '.gif',
        '.webp',
        '.bmp',
        '.svg',
        '.tiff',
      ],
    },
    disabled: isUploading,
  });

  const removeImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  // Preview function that handles both File objects and URL strings
  const getImagePreview = (image: File | string): string => {
    if (isFile(image)) {
      return URL.createObjectURL(image);
    }
    return image; // It's already a URL
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${
            isDragActive
              ? 'border-orange-500 bg-orange-50'
              : 'border-gray-300 hover:border-orange-500'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-sm text-center text-gray-600">
          {isDragActive
            ? 'Drop the images here...'
            : 'Drag & drop images here, or click to select files'}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          PNG, JPG, GIF, WEBP, BMP, SVG, TIFF up to 10MB (Max {maxFiles} images)
        </p>
        {isUploading && (
          <p className="text-sm text-orange-500 mt-2">Uploading...</p>
        )}
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((image, index) => (
            <Card key={index} className="relative overflow-hidden group">
              <div className="aspect-square relative">
                <img
                  src={getImagePreview(image)}
                  alt={`Product image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onLoad={() => {
                    // Clean up object URLs to prevent memory leaks
                    if (isFile(image)) {
                      return () => URL.revokeObjectURL(getImagePreview(image));
                    }
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="w-8 h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="px-2 py-1 text-xs text-gray-500 truncate">
                {isFile(image) ? image.name : 'Uploaded image'}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
