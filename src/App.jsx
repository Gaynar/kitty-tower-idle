import { useEffect } from 'react';
import { Home, Moon, RotateCcw, Sun } from 'lucide-react';
import { GameStateProvider, useGameState } from './store/gameState.js';
import {
  advanceDayTimer,
  DAY_DURATION_MS,
  getDayProduction,
  returnHomeFromNight,
  startDayTimer,
  startNightRun,
} from './store/dayPhase.js';
import { resetSave } from './store/persistence.js';
import './hector.css';

function formatResource(value) {
  return Math.floor(value ?? 0).toLocaleString();
}

function formatSeconds(ms) {
  return Math.ceil(ms / 1000).toLocaleString();
}

function ResourceBar() {
  const { state } = useGameState();

  return (
    <header className="resource-bar">
      <div>
        <p className="eyebrow">Day {state.day}</p>
        <h1 className="resource-title">Hector&apos;s Adventure</h1>
      </div>
      <div className="resource-pills" aria-label="Resources">
        <div className="resource-pill fishbones" aria-label="Fishbones">
          <span aria-hidden="true">Fishbones</span>
          <strong>{formatResource(state.resources.fishbones)}</strong>
        </div>
        <div className="resource-pill tuna" aria-label="Canned Tuna">
          <span aria-hidden="true">Canned Tuna</span>
          <strong>{formatResource(state.resources.cannedTuna)}</strong>
        </div>
      </div>
    </header>
  );
}

function PhaseBadge() {
  const { state } = useGameState();
  const isDay = state.phase === 'day';
  const Icon = isDay ? Sun : Moon;

  return (
    <div className={`phase-badge ${isDay ? 'day' : 'night'}`}>
      <Icon aria-hidden="true" />
      <span>{isDay ? 'Day preparation' : 'Night run'}</span>
    </div>
  );
}

function HectorPanel() {
  const { state } = useGameState();
  const stats = state.hector.stats;

  return (
    <section className="panel hector-panel" aria-labelledby="hector-heading">
      <div className="hector-portrait pixel-art" aria-hidden="true">
        H
      </div>
      <div>
        <p className="eyebrow">Main character</p>
        <h2 id="hector-heading">Hector</h2>
        <p>{state.hector.summary}</p>
        <dl className="stat-grid">
          <div>
            <dt>HP</dt>
            <dd>{stats.maxHp}</dd>
          </div>
          <div>
            <dt>MP</dt>
            <dd>{stats.maxMp}</dd>
          </div>
          <div>
            <dt>Attack</dt>
            <dd>{stats.attack}</dd>
          </div>
          <div>
            <dt>Defense</dt>
            <dd>{stats.defense}</dd>
          </div>
          <div>
            <dt>Speed</dt>
            <dd>{stats.speed}</dd>
          </div>
          <div>
            <dt>Luck</dt>
            <dd>{stats.luck}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

function HousePanel() {
  const { state } = useGameState();

  return (
    <section className="panel house-panel" aria-labelledby="house-heading">
      <div className="section-heading">
        <Home aria-hidden="true" />
        <div>
          <p className="eyebrow">Terraced house</p>
          <h2 id="house-heading">Day Rooms</h2>
        </div>
      </div>
      <div className="room-grid">
        {state.house.rooms.map((room) => (
          <article className={`room-card slot-${room.layoutSlot}`} key={room.id}>
            <p className="room-floor">Floor {room.floor}</p>
            <h3>{room.name}</h3>
            <p>{room.activity}</p>
            <div className="hector-activity">
              <span className="hector-token pixel-art" aria-hidden="true">
                H
              </span>
              <span>Hector is {room.hectorActivity}.</span>
            </div>
            <small>Tier {room.upgradeTier}: {room.effect}</small>
            <small>
              Output: +{room.baseDayOutput?.fishbones ?? 0} Fishbones, +{room.baseDayOutput?.cannedTuna ?? 0} Tuna
            </small>
          </article>
        ))}
      </div>
    </section>
  );
}

function PhaseControls() {
  const { state, setState } = useGameState();
  const isDay = state.phase === 'day';
  const dayPhase = state.dayPhase ?? { status: 'idle', elapsedMs: 0 };
  const dayProduction = getDayProduction(state);
  const progressPercent = Math.min(100, Math.round(((dayPhase.elapsedMs ?? 0) / DAY_DURATION_MS) * 100));

  function handleStartDay() {
    setState((currentState) => startDayTimer(currentState));
  }

  function handleAdvanceDay() {
    setState((currentState) => advanceDayTimer(currentState, 5_000));
  }

  function handleStartNight() {
    setState((currentState) => startNightRun(currentState));
  }

  function handleReturnHome() {
    setState((currentState) => returnHomeFromNight(currentState));
  }

  return (
    <section className="panel control-panel" aria-labelledby="phase-heading">
      <PhaseBadge />
      <h2 id="phase-heading">{isDay ? 'Prepare for tonight' : 'Back Alley run started'}</h2>
      {isDay ? (
        <>
          <p>
            {dayPhase.status === 'ready'
              ? "The house has finished today's tiny cat routines. Hector can head out tonight."
              : 'Start the day timer to let the house prepare resources while the app is open.'}
          </p>
          <div className="day-meter" aria-label={`Day progress ${progressPercent}%`}>
            <div className="day-meter-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="day-summary">
            <span>{formatSeconds(DAY_DURATION_MS - Math.min(dayPhase.elapsedMs ?? 0, DAY_DURATION_MS))}s left</span>
            <span>
              Today: +{dayProduction.fishbones} Fishbones, +{dayProduction.cannedTuna} Tuna
            </span>
          </div>
          {dayPhase.lastGains ? (
            <p className="last-gains">
              Prepared +{dayPhase.lastGains.fishbones} Fishbones and +{dayPhase.lastGains.cannedTuna} Canned Tuna.
            </p>
          ) : null}
          <div className="button-row">
            {dayPhase.status === 'ready' ? (
              <button className="primary-button" type="button" onClick={handleStartNight}>
                Start Night
              </button>
            ) : (
              <button className="primary-button" type="button" onClick={handleStartDay}>
                {dayPhase.status === 'running' ? 'Day Running' : 'Start Day'}
              </button>
            )}
            <button
              className="secondary-button"
              type="button"
              onClick={handleAdvanceDay}
              disabled={dayPhase.status !== 'running'}
            >
              Advance 5s
            </button>
          </div>
        </>
      ) : (
        <>
          <p>The generated map and combat engine come next. Returning home clears this placeholder run.</p>
          <button className="primary-button" type="button" onClick={handleReturnHome}>
            Return Home
          </button>
        </>
      )}
    </section>
  );
}

function DayTimerTicker() {
  const { setState } = useGameState();

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setState((currentState) => advanceDayTimer(currentState, 250));
    }, 250);

    return () => window.clearInterval(intervalId);
  }, [setState]);

  return null;
}

function DebugPanel() {
  function handleReset() {
    resetSave();
    window.location.reload();
  }

  return (
    <div className="debug-row">
      <button className="debug-reset" type="button" onClick={handleReset}>
        <RotateCcw aria-hidden="true" />
        Reset save
      </button>
    </div>
  );
}

function Game() {
  return (
    <div className="app-shell">
      <DayTimerTicker />
      <ResourceBar />
      <main className="app-main">
        <PhaseControls />
        <div className="dashboard-grid">
          <HectorPanel />
          <HousePanel />
        </div>
        <DebugPanel />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <GameStateProvider>
      <Game />
    </GameStateProvider>
  );
}
