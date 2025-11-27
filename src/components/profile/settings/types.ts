
export type SettingsView = 'main' | 'activity' | 'archive';

export interface SettingsViewProps {
  setView: (view: SettingsView) => void;
  onClose: () => void;
}

    