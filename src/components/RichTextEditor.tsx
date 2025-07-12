import React from 'react';
import { Bold, Italic, Code, List, ListOrdered, Link as LinkIcon } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  className
}) => {
  const handleToolbarClick = (tag: string) => {
    const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = value;
    let newCursorPos = start;

    switch(tag) {
      case 'bold':
        newText = value.substring(0, start) + `**${selectedText}**` + value.substring(end);
        newCursorPos = end + 4;
        break;
      case 'italic':
        newText = value.substring(0, start) + `_${selectedText}_` + value.substring(end);
        newCursorPos = end + 2;
        break;
      case 'code':
        newText = value.substring(0, start) + `\`${selectedText}\`` + value.substring(end);
        newCursorPos = end + 2;
        break;
      case 'bullet-list':
        newText = value.substring(0, start) + `\n- ${selectedText}` + value.substring(end);
        newCursorPos = end + 3;
        break;
      case 'number-list':
        newText = value.substring(0, start) + `\n1. ${selectedText}` + value.substring(end);
        newCursorPos = end + 4;
        break;
      case 'link':
        newText = value.substring(0, start) + `[${selectedText}](url)` + value.substring(end);
        newCursorPos = end + 7;
        break;
    }

    onChange(newText);
    
    // Reset cursor position after state update
    setTimeout(() => {
      const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
      if (textarea) {
        textarea.focus();
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className || ''}`}>
      <div className="flex items-center gap-2 p-2 bg-gray-50 border-b">
        <button
          type="button"
          onClick={() => handleToolbarClick('bold')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('italic')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('code')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Code"
        >
          <Code className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => handleToolbarClick('bullet-list')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => handleToolbarClick('number-list')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-4 bg-gray-300 mx-1" />
        <button
          type="button"
          onClick={() => handleToolbarClick('link')}
          className="p-1 hover:bg-gray-200 rounded"
          title="Insert Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>
      <textarea
        id="rich-text-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full p-4 min-h-[200px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="p-2 bg-gray-50 border-t text-xs text-gray-500">
        Markdown is supported. You can use **bold**, _italic_, `code`, and more.
      </div>
    </div>
  );
};