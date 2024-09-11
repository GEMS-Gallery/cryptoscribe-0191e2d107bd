import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

type PostFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, body: string, author: string) => void;
};

const PostForm: React.FC<PostFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm();

  const onSubmitForm = (data: any) => {
    const htmlBody = draftToHtml(convertToRaw(data.body.getCurrentContent()));
    onSubmit(data.title, htmlBody, data.author);
    reset();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Create New Post</DialogTitle>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Controller
            name="title"
            control={control}
            defaultValue=""
            rules={{ required: 'Title is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Title"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="body"
            control={control}
            defaultValue={EditorState.createEmpty()}
            rules={{ required: 'Body is required' }}
            render={({ field: { onChange, value } }) => (
              <Editor
                editorState={value}
                onEditorStateChange={onChange}
                wrapperClassName="wrapper-class"
                editorClassName="editor-class"
                toolbarClassName="toolbar-class"
              />
            )}
          />
          <Controller
            name="author"
            control={control}
            defaultValue=""
            rules={{ required: 'Author is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Author"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PostForm;
