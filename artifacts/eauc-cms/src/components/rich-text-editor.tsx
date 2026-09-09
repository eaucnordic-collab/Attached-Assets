import { useEffect, useRef } from 'react';
import {
  Bold, Italic, Heading2, Heading3, Quote, Link as LinkIcon,
  Unlink, List, ListOrdered,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor && editor.innerHTML !== value && document.activeElement !== editor) {
      editor.innerHTML = value;
    }
  }, [value]);

  const runCommand = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    onChange(editorRef.current?.innerHTML ?? '');
  };

  const addLink = () => {
    const href = window.prompt('Enter link URL (https://...)');
    if (!href) return;
    const normalized = /^https?:\/\//i.test(href) ? href : `https://${href}`;
    runCommand('createLink', normalized);
  };

  const controls = [
    { label: 'Bold', icon: Bold, action: () => runCommand('bold') },
    { label: 'Italic', icon: Italic, action: () => runCommand('italic') },
    { label: 'Heading 2', icon: Heading2, action: () => runCommand('formatBlock', 'h2') },
    { label: 'Heading 3', icon: Heading3, action: () => runCommand('formatBlock', 'h3') },
    { label: 'Quote', icon: Quote, action: () => runCommand('formatBlock', 'blockquote') },
    { label: 'Bulleted list', icon: List, action: () => runCommand('insertUnorderedList') },
    { label: 'Numbered list', icon: ListOrdered, action: () => runCommand('insertOrderedList') },
    { label: 'Add link', icon: LinkIcon, action: addLink },
    { label: 'Remove link', icon: Unlink, action: () => runCommand('unlink') },
  ];

  return (
    <div className="rounded-md border bg-background overflow-hidden focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      <div className="flex flex-wrap gap-1 border-b bg-muted/40 p-2">
        {controls.map(({ label, icon: Icon, action }) => (
          <Button
            key={label}
            type="button"
            variant="ghost"
            size="sm"
            title={label}
            aria-label={label}
            className="h-8 w-8 p-0"
            onMouseDown={(event) => event.preventDefault()}
            onClick={action}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder="Write the full article..."
        className="min-h-[360px] px-4 py-3 text-base leading-7 outline-none
          [&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold
          [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold
          [&_blockquote]:my-5 [&_blockquote]:border-l-4 [&_blockquote]:border-primary
          [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
          [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6
          [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6
          [&_a]:text-primary [&_a]:underline"
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
      />
    </div>
  );
}