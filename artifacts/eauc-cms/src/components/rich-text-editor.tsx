import { useEffect, useRef, useState } from 'react';
import {
  Bold, Italic, Heading2, Heading3, Quote, Link as LinkIcon,
  Unlink, List, ListOrdered, ImagePlus, Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { articleContentToHtml, sanitizeArticleHtml } from '@/lib/sanitize-article-html';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  onUploadImages?: (files: File[]) => Promise<string[]>;
};

export function RichTextEditor({ value, onChange, onUploadImages }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const selectionRef = useRef<Range | null>(null);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    const normalizedValue = articleContentToHtml(value);
    if (editor && editor.innerHTML !== normalizedValue && document.activeElement !== editor) {
      editor.innerHTML = normalizedValue;
    }
  }, [value]);

  const saveSelection = () => {
    const selection = window.getSelection();
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
    if (range && editorRef.current?.contains(range.commonAncestorContainer)) {
      selectionRef.current = range.cloneRange();
    }
  };

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

  const insertUploadedImages = async (files: File[]) => {
    if (!onUploadImages || files.length === 0) return;
    setIsUploadingImages(true);
    try {
      const urls = await onUploadImages(files);
      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();
      const selection = window.getSelection();
      let range = selectionRef.current;
      if (!range || !editor.contains(range.commonAncestorContainer)) {
        range = document.createRange();
        range.selectNodeContents(editor);
        range.collapse(false);
      }
      selection?.removeAllRanges();
      selection?.addRange(range);

      urls.forEach((url) => {
        const paragraph = document.createElement('p');
        const image = document.createElement('img');
        image.src = url;
        image.alt = 'Article image';
        paragraph.appendChild(image);
        range?.insertNode(paragraph);
        range?.setStartAfter(paragraph);
        range?.collapse(true);
      });
      onChange(sanitizeArticleHtml(editor.innerHTML));
    } catch {
      // The parent uploader reports the user-facing error.
    } finally {
      setIsUploadingImages(false);
      selectionRef.current = null;
      if (imageInputRef.current) imageInputRef.current.value = '';
    }
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
        {onUploadImages && (
          <>
            <span className="mx-1 h-8 w-px bg-border" />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => void insertUploadedImages(Array.from(event.target.files ?? []))}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              title="Insert images"
              aria-label="Insert images"
              disabled={isUploadingImages}
              className="h-8 gap-2 px-2"
              onMouseDown={(event) => {
                event.preventDefault();
                saveSelection();
              }}
              onClick={() => imageInputRef.current?.click()}
            >
              {isUploadingImages ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              <span className="hidden sm:inline">{isUploadingImages ? 'Uploading...' : 'Insert images'}</span>
            </Button>
          </>
        )}
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
          [&_a]:text-primary [&_a]:underline
          [&_p]:my-3 [&_img]:my-5 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-xl"
        onInput={(event) => onChange(event.currentTarget.innerHTML)}
        onFocus={() => document.execCommand('defaultParagraphSeparator', false, 'p')}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        onBlur={(event) => {
          const cleanHtml = sanitizeArticleHtml(event.currentTarget.innerHTML);
          if (cleanHtml !== event.currentTarget.innerHTML) event.currentTarget.innerHTML = cleanHtml;
          onChange(cleanHtml);
        }}
      />
    </div>
  );
}