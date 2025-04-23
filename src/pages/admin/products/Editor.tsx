import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DOMPurify from 'dompurify';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export const Editor: React.FC<EditorProps> = ({
  value = '',
  onChange,
  readOnly = false,
}) => {
  // Quill modules configuration
  const modules = {
    toolbar: readOnly
      ? false
      : [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ align: [] }],
          ['link'],
          ['clean'],
        ],
    clipboard: {
      matchVisual: false,
    },
  };

  // Quill formats
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'indent',
    'align',
    'link',
  ];

  // Handle change and sanitize HTML
  const handleChange = (content: string) => {
    // Sanitize content to prevent XSS
    const sanitizedContent = DOMPurify.sanitize(content);
    onChange(sanitizedContent);
  };

  return (
    <div className="editor-container">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        readOnly={readOnly}
        className="min-h-[200px]"
      />
    </div>
  );
};

export default Editor;
