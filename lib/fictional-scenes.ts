/** Authored parody scenes. Supported educational patterns select decoration only; never care guidance. */
export const FICTIONAL_SCENES = {
  neutral: { label: 'The Bureau is out of its depth.', stamp: 'PARODY', chase: false, caption: 'The horse is on its lunch break.', note: 'Entertainment only; this joke does not assess your health.' },
  bubonic: { label: 'The horse has been deployed.', stamp: 'FILE B / SCRIPTED FICTION', chase: true, caption: 'Nobody mentioned the horse in the training video.', note: 'This is a prewritten story label, not a diagnosis of you or any real person.' },
  pneumonic: { label: 'The entire squad is en route.', stamp: 'FILE P / SCRIPTED FICTION', chase: true, caption: 'The horse has declined to comment.', note: 'This is a prewritten story label, not a diagnosis of you or any real person.' },
  googling: { label: 'Too much Googling. Touch grass.', stamp: 'FILE G / INTERNET SATIRE', chase: false, caption: 'Your search history needs a nap.', note: 'A joke about a fictional character, not a mental-health label or a reason to dismiss real symptoms. Real concerns deserve care.' },
} as const;
export type FictionalSceneId = keyof typeof FICTIONAL_SCENES;
