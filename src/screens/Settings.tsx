import BasicView from '../components/BasicView';
import SelectableButton from '../components/SelectableButton';
import { useTheme } from '../contexts/ThemeContext';
import './Settings.scss';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

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
