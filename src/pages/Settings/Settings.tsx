import { useEffect } from 'react';
import BasicView from '../../components/BasicView/BasicView';
import SelectableButton from '../../components/SelectableButton/SelectableButton';
import { useTheme } from '../../contexts/ThemeContext';
import { HexColorPicker } from 'react-colorful';
import './Settings.scss';

interface SettingsProps {
  setCurrentPage: (pageName: string) => void;
}
const Settings: React.FC<SettingsProps> = ({ setCurrentPage }: SettingsProps) => {
  const { theme, toggleTheme, changePrimaryColor, primaryColor } = useTheme();

  useEffect(() => {
    setCurrentPage('Settings');
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty('--primary', primaryColor);
  }, [primaryColor])

  return (
    <BasicView className='settings' padding={true} viewPadding={true}>
      <div className='select-buttons'>
        <SelectableButton left label='System' selected={theme === 'system'} onSelect={() => { toggleTheme('system') }} />
        <SelectableButton label='Light' selected={theme === 'light'} onSelect={() => { toggleTheme('light') }} />
        <SelectableButton label='Dim' selected={theme === 'dim'} onSelect={() => { toggleTheme('dim') }} />
        <SelectableButton right label='Dark' selected={theme === 'dark'} onSelect={() => { toggleTheme('dark') }} />
      </div>

      <div className='color-picker'>
        <span>Select primary color:</span>
        <HexColorPicker color={primaryColor} onChange={changePrimaryColor} />
      </div>
    </BasicView>
  )
}

export default Settings;
