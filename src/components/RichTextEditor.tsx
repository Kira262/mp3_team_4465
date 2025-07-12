import { useState } from "react";
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Smile, 
  Link2, 
  Image, 
  AlignLeft, 
  AlignCenter, 
  AlignRight 
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Separator } from "../components/ui/separator";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);

  const toolbarButtons = [
    { icon: Bold, label: "Bold", format: "**text**" },
    { icon: Italic, label: "Italic", format: "*text*" },
    { icon: Strikethrough, label: "Strikethrough", format: "~~text~~" },
  ];

  const listButtons = [
    { icon: List, label: "Bullet List", format: "- " },
    { icon: ListOrdered, label: "Numbered List", format: "1. " },
  ];

  const alignButtons = [
    { icon: AlignLeft, label: "Align Left" },
    { icon: AlignCenter, label: "Align Center" },
    { icon: AlignRight, label: "Align Right" },
  ];

  const insertFormatting = (format: string) => {
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    let newText = "";
    if (format.includes("text")) {
      newText = format.replace("text", selectedText || "text");
    } else {
      newText = format;
    }

    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Focus back to textarea and set cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + newText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) {
      insertFormatting(`[link text](${url})`);
    }
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      insertFormatting(`![image description](${url})`);
    }
  };

  const insertEmoji = () => {
    const emojis = ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🤔", "🤗", "😍", "🥰", "😘", "👍", "👎", "👏", "🙌", "💪"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    insertFormatting(emoji);
  };

  return (
    <div className={`border rounded-lg bg-card ${className}`}>
      {/* Toolbar */}
      <div className="p-3 border-b bg-muted/30">
        <div className="flex flex-wrap items-center gap-1">
          {/* Text Formatting */}
          {toolbarButtons.map((button) => (
            <Button
              key={button.label}
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting(button.format)}
              className="h-8 w-8 p-0"
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Lists */}
          {listButtons.map((button) => (
            <Button
              key={button.label}
              variant="ghost"
              size="sm"
              onClick={() => insertFormatting(button.format)}
              className="h-8 w-8 p-0"
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Alignment */}
          {alignButtons.map((button) => (
            <Button
              key={button.label}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              title={button.label}
            >
              <button.icon className="w-4 h-4" />
            </Button>
          ))}

          <Separator orientation="vertical" className="h-6 mx-1" />

          {/* Media and Links */}
          <Button
            variant="ghost"
            size="sm"
            onClick={insertLink}
            className="h-8 w-8 p-0"
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={insertImage}
            className="h-8 w-8 p-0"
            title="Insert Image"
          >
            <Image className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={insertEmoji}
            className="h-8 w-8 p-0"
            title="Insert Emoji"
          >
            <Smile className="w-4 h-4" />
          </Button>

          <div className="ml-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              {showPreview ? "Edit" : "Preview"}
            </Button>
          </div>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="min-h-[200px]">
        {showPreview ? (
          <div className="p-4 prose prose-sm max-w-none">
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, '<br>') }} />
            ) : (
              <div className="text-muted-foreground italic">Nothing to preview...</div>
            )}
          </div>
        ) : (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[200px] border-0 resize-none focus-visible:ring-0 rounded-none"
          />
        )}
      </div>

      {/* Footer with formatting tips */}
      <div className="px-4 py-2 border-t bg-muted/30 text-xs text-muted-foreground">
        <span>Tip: Use **bold**, *italic*, and [links](url) for formatting. Upload images by pasting URLs.</span>
      </div>
    </div>
  );
}