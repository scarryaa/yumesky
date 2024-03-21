import { type Prompt } from '../../../state/prompts';

export const DeleteDraftPrompt: Prompt = {
  name: 'delete-draft',
  title: 'Discard draft?',
  description: 'Are you sure you want to discard this draft?',
  options: ['Cancel', 'Discard'],
  uri: '',
  confirmAction: () => {}
};
