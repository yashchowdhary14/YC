
export type SettingsView =
  | 'main'
  | 'activity'
  | 'archive'
  | 'notifications'
  | 'privacy'
  | 'interactions'
  | 'appAndMedia';

export interface SettingsViewProps {
  setView: (view: SettingsView) => void;
  onClose: () => void;
}
