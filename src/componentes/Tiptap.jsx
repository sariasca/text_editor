import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './Tiptap.css';
import Toolbar from './Toolbar';

const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: 'Hello World!',
  });

  return (
    <>
      <Toolbar/>
      <main>
        <EditorContent editor={editor} />
      </main>
    </>
  );
};

export default Tiptap;
