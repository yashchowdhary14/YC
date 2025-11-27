
export type SettingsView =
  | 'main'
  | 'activity'
  | 'archive'
  | 'notifications'
  | 'privacy'
  | 'interactions'
  | 'appAndMedia'
  | 'forProfessionals'
  | 'whatYouSee';

export interface SettingsViewProps {
  setView: (view: SettingsView) => void;
  onClose: () => void;
}
