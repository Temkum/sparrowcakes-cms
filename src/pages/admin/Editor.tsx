import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import the styles

export function Editor({ value, onChange }: EditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'], // Text formatting
      [{ list: 'ordered' }, { list: 'bullet' }], // Lists
      ['link', 'image'], // Links and images
      ['clean'], // Remove formatting
    ],
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'list',
    'bullet',
    'link',
    'image',
  ];

  return (
    <>
      <ReactQuill
        theme="snow" // Use the "snow" theme for a clean UI
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder="Enter description here..."
        className="rounded-md h-[150px] mb-4"
      />
    </>
  );
}
