import { deletePost } from '../../../api/agent';
import { type DeletePostPromptType } from '../../../state/prompts';

export const DeletePostPrompt: DeletePostPromptType = {
  name: 'delete-post',
  title: 'Delete this post?',
  description: 'This action is permanent!',
  options: ['Cancel', 'Delete'],
  uri: '',
  confirmAction: async function () {
    await deletePost(this.uri ?? '');
  }
}
