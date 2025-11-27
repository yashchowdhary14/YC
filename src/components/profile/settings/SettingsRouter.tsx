
'use client';

import { motion } from 'framer-motion';
import type { SettingsView, SettingsViewProps } from './types';
import MainSettings from './MainSettings';
import YourActivity from './YourActivity';
import Archive from './Archive';
import Notifications from './Notifications';
import Privacy from './Privacy';
import Interactions from './Interactions';
import AppAndMedia from './AppAndMedia';
import ForProfessionals from './ForProfessionals';
import WhatYouSee from './WhatYouSee';

const viewMap: { [key in SettingsView]: React.ComponentType<SettingsViewProps> } = {
  main: MainSettings,
  activity: YourActivity,
  archive: Archive,
  notifications: Notifications,
  privacy: Privacy,
  interactions: Interactions,
  appAndMedia: AppAndMedia,
  forProfessionals: ForProfessionals,
  whatYouSee: WhatYouSee,
};

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

interface SettingsRouterProps {
  currentView: SettingsView;
  setView: (view: SettingsView) => void;
  onClose: () => void;
}

export default function SettingsRouter({ currentView, setView, onClose }: SettingsRouterProps) {
  const Component = viewMap[currentView] || MainSettings;
  // This is a simplified direction logic. A more robust solution might track navigation history.
  const direction = currentView === 'main' ? -1 : 1; 

  return (
    <motion.div
      key={currentView}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 }
      }}
      className="absolute top-0 left-0 w-full h-full"
    >
      <Component setView={setView} onClose={onClose} />
    </motion.div>
  );
}
