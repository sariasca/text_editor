import { useEditor, EditorContent, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Toolbar from './Toolbar';

import './Tiptap.css';

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ 
        link: {
          autolink: true, // Automatically converts URLs to links
        }
      }),
      Image,
    ],
    content: 'Hello World!',
  });

  const editorState = useEditorState({
    editor,
    selector: (context) => {
      return{
        isBold: context.editor.isActive('bold'),
        isItalic: context.editor.isActive('italic'),
        isUnderline: context.editor.isActive('underline'),
        isCodeBlock: context.editor.isActive('codeBlock'),
        isH1: context.editor.isActive('heading', { level: 1 }),
        isH2: context.editor.isActive('heading', { level: 2 }),
        isH3: context.editor.isActive('heading', { level: 3 }),
        isParagraph: context.editor.isActive('paragraph'),
        isOrderedList: context.editor.isActive('orderedList'),
        isBulletList: context.editor.isActive('bulletList'),
      }
    },
  });

const comandos = {
  toggleBold: () => editor.chain().focus().toggleBold().run(),
  toggleItalic: () => editor.chain().focus().toggleItalic().run(),
  toggleUnderline: () => editor.chain().focus().toggleUnderline().run(),
  toggleCodeBlock: () => editor.chain().focus().toggleCodeBlock().run(),
  toggleH1: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  toggleH2: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  toggleH3: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  toggleParagraph: () => editor.chain().focus().setParagraph().run(),
  toggleOrderedList: () => editor.chain().focus().toggleOrderedList().run(),
  toggleBulletList: () => editor.chain().focus().toggleBulletList().run(),
  addImage: () => {
    const url = prompt('URL de la imagen');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  },
  addLink: () => {
    const anteriorURL = editor.getAttributes('link').href;
    const url = prompt('URL del enlace', anteriorURL);
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  },
}

  return (
    <>
      <Toolbar comandos={comandos} editorState={editorState} />
      <main>
        <EditorContent editor={editor} />
      </main>
    </>
  );
};

export default Tiptap;
