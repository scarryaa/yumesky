import BasicView from '../components/BasicView';
import SelectableButton from '../components/SelectableButton';
import { useTheme } from '../contexts/ThemeContext';
import './Settings.scss';

interface SettingsProps {
  setCurrentPage: (pageName: string) => void;
}
const Settings: React.FC<SettingsProps> = ({ setCurrentPage }: SettingsProps) => {
  const { theme, toggleTheme } = useTheme();

  setCurrentPage('Settings');

  return (
    <BasicView padding={true} viewPadding={true}>
        <SelectableButton left label='System' selected={theme === 'system'} onSelect={() => { toggleTheme('system') }} />
        <SelectableButton label='Light' selected={theme === 'light'} onSelect={() => { toggleTheme('light') }} />
        <SelectableButton label='Dim' selected={theme === 'dim'} onSelect={() => { toggleTheme('dim') }} />
        <SelectableButton right label='Dark' selected={theme === 'dark'} onSelect={() => { toggleTheme('dark') }} />
    </BasicView>
  )
}

export default Settings;
