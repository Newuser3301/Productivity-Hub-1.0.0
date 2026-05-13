// src/components/Pomodoro/TimerSettings.jsx
import { usePomodoroStore } from '../../store/usePomodoroStore';

const fields = [
  ['focusMinutes', 'Focus'],
  ['shortBreakMinutes', 'Short break'],
  ['longBreakMinutes', 'Long break'],
  ['sessionsBeforeLongBreak', 'Long break after']
];

export default function TimerSettings() {
  const settings = usePomodoroStore((state) => state.settings);
  const updateSettings = usePomodoroStore((state) => state.updateSettings);

  return (
    <div className="panel grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
      {fields.map(([key, label]) => (
        <label key={key} className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          {label}
          <input
            className="input mt-1"
            type="number"
            min="1"
            max={key === 'sessionsBeforeLongBreak' ? 12 : 120}
            value={settings[key]}
            onChange={(event) => updateSettings({ [key]: Math.max(1, Number(event.target.value)) })}
          />
        </label>
      ))}
    </div>
  );
}
