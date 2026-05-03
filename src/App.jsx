import { useEffect, useRef, useState } from 'react';
import { CatInfoPanel } from './components/CatInfoPanel.jsx';
import { CatDiary } from './components/CatDiary.jsx';
import { CatRosterScreen } from './components/CatRosterScreen.jsx';
import { CatRoster } from './components/CatRoster.jsx';
import { Diorama } from './components/Diorama.jsx';
import { EventCardStack } from './components/EventCardStack.jsx';
import { OfflineSummaryOverlay } from './components/OfflineSummaryOverlay.jsx';
import { ResourceBar } from './components/ResourceBar.jsx';
import { RoomDetailPanel } from './components/RoomDetailPanel.jsx';
import { Tutorial } from './components/Tutorial.jsx';
import { assignCat } from './store/actions.js';
import { GameStateProvider, useGameState } from './store/gameState.js';
import { resetSave } from './store/persistence.js';
import { sampleTransitionDue } from './store/transitions.js';

const DRAG_THRESHOLD = 8;

function useDesktopLayout() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia('(min-width: 641px)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 641px)');
    const handleChange = () => setIsDesktop(mediaQuery.matches);
    handleChange();
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isDesktop;
}

function Game() {
  const { state, setState, liveEvents, dismissLiveEvent } = useGameState();
  const isDesktop = useDesktopLayout();
  const [activeCatInfoId, setActiveCatInfoId] = useState(null);
  const [activeRoomId, setActiveRoomId] = useState(null);
  const [sidePanel, setSidePanel] = useState('cats');
  const [diaryOpen, setDiaryOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const [dragState, setDragState] = useState(null);
  const [hoveredRoomId, setHoveredRoomId] = useState(null);
  const [roomMessage, setRoomMessage] = useState(null);
  const dragRef = useRef(null);
  const stateRef = useRef(state);
  const messageTimeoutRef = useRef(null);
  const isTrackingDrag = Boolean(dragState);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    if (state.tutorialStep === 1 && state.resources.comfort > 0) {
      setState((currentState) => ({ ...currentState, tutorialStep: 2 }));
    } else if (state.tutorialStep === 2 && state.resources.comfort >= 1) {
      setState((currentState) => ({ ...currentState, tutorialStep: 3 }));
    }
  }, [state.resources.comfort, state.tutorialStep, setState]);

  useEffect(() => {
    document.body.dataset.tutorialStep = String(state.tutorialStep ?? 0);
    return () => {
      delete document.body.dataset.tutorialStep;
    };
  }, [state.tutorialStep]);

  function showRoomMessage(roomId, text) {
    window.clearTimeout(messageTimeoutRef.current);
    setRoomMessage({ roomId, text });
    messageTimeoutRef.current = window.setTimeout(() => setRoomMessage(null), 1200);
  }

  function roomIdFromPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    return element?.closest('[data-room-id]')?.dataset.roomId ?? null;
  }

  function startCatDrag(catId, event) {
    if (event.button !== undefined && event.button !== 0) {
      return;
    }

    event.preventDefault();

    const nextDragState = {
      catId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      x: event.clientX,
      y: event.clientY,
      isDragging: false,
    };

    dragRef.current = nextDragState;
    setDragState(nextDragState);
  }

  useEffect(() => {
    if (!isTrackingDrag) {
      return undefined;
    }

    function handlePointerMove(event) {
      const currentDrag = dragRef.current;
      if (!currentDrag || event.pointerId !== currentDrag.pointerId) {
        return;
      }

      const moved = Math.hypot(event.clientX - currentDrag.startX, event.clientY - currentDrag.startY);
      const nextDragState = {
        ...currentDrag,
        x: event.clientX,
        y: event.clientY,
        isDragging: currentDrag.isDragging || moved >= DRAG_THRESHOLD,
      };

      dragRef.current = nextDragState;
      setDragState(nextDragState);
      setHoveredRoomId(nextDragState.isDragging ? roomIdFromPoint(event.clientX, event.clientY) : null);
    }

    function handlePointerUp(event) {
      const currentDrag = dragRef.current;
      if (!currentDrag || event.pointerId !== currentDrag.pointerId) {
        return;
      }

      const finalDrag = {
        ...currentDrag,
        x: event.clientX,
        y: event.clientY,
      };

      if (finalDrag.isDragging) {
        const roomId = roomIdFromPoint(event.clientX, event.clientY);
        if (roomId) {
          const dropResult = assignCat(stateRef.current, finalDrag.catId, roomId, Date.now());
          if (dropResult.ok) {
            const nowMs = Date.now();
            let nextState = dropResult.state;
            if (nextState.tutorialStep === 0 && finalDrag.catId === 'miso' && roomId === 'bedroom') {
              nextState = {
                ...nextState,
                tutorialStep: 1,
                cats: nextState.cats.map((cat) =>
                  cat.id === 'miso'
                    ? {
                        ...cat,
                        currentState: 'sleeping',
                        stateEnteredAt: nowMs,
                        stateTransitionDue: sampleTransitionDue('sleeping', cat, nowMs),
                      }
                    : cat,
                ),
              };
            } else if (nextState.tutorialStep === 0) {
              nextState = { ...nextState, tutorialStep: 1 };
            }
            setState(nextState);
          } else {
            showRoomMessage(roomId, dropResult.reason);
          }
        }
      } else {
        setActiveCatInfoId(finalDrag.catId);
      }

      dragRef.current = null;
      setDragState(null);
      setHoveredRoomId(null);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [isTrackingDrag, setState]);

  useEffect(() => () => window.clearTimeout(messageTimeoutRef.current), []);

  function handleResetSave() {
    resetSave();
    window.location.reload();
  }

  function openCats() {
    if (isDesktop) {
      setSidePanel('cats');
    } else {
      setCatsOpen(true);
    }
  }

  function openHouse() {
    setCatsOpen(false);
    setDiaryOpen(false);
    setActiveRoomId(null);
    setActiveCatInfoId(null);
    if (isDesktop) {
      setSidePanel('cats');
    }
  }

  function openRoomDetail(roomId) {
    setActiveRoomId(roomId);
    if (isDesktop) {
      setSidePanel('room');
    }
    if (state.tutorialStep === 3) {
      setState((currentState) => ({ ...currentState, tutorialStep: 4 }));
    }
  }

  return (
    <div className="app-shell">
      <ResourceBar />
      <div className="top-actions">
        <button type="button" onClick={openCats}>Cats</button>
        <button type="button" onClick={() => setDiaryOpen(true)}>Diary</button>
      </div>
      <div className="game-layout">
        <Diorama
          draggingCatId={dragState?.isDragging ? dragState.catId : null}
          hoveredRoomId={hoveredRoomId}
          roomMessage={roomMessage}
          onOpenCatInfo={setActiveCatInfoId}
          onOpenRoomDetail={openRoomDetail}
        />
        <aside className="desktop-side-panel" aria-label="Tower side panel">
          {sidePanel === 'room' && activeRoomId ? (
            <RoomDetailPanel
              roomId={activeRoomId}
              embedded
              onOpenCatInfo={(catId) => {
                setActiveCatInfoId(catId);
              }}
            />
          ) : (
            <CatRosterScreen embedded />
          )}
        </aside>
      </div>
      <div className="debug-row">
        <button className="debug-reset" type="button" onClick={handleResetSave}>
          Reset save
        </button>
      </div>
      <CatRoster
        draggingCatId={dragState?.catId ?? null}
        isDragging={Boolean(dragState?.isDragging)}
        onCatPointerDown={startCatDrag}
        onOpenCatInfo={setActiveCatInfoId}
      />
      {dragState?.isDragging ? (
        <div
          className="cat-drag-ghost"
          style={{ '--drag-x': `${dragState.x}px`, '--drag-y': `${dragState.y}px` }}
          aria-hidden="true"
        >
          {dragState.catId.charAt(0).toUpperCase()}
        </div>
      ) : null}
      {activeCatInfoId ? <CatInfoPanel catId={activeCatInfoId} onClose={() => setActiveCatInfoId(null)} /> : null}
      {activeRoomId && !isDesktop ? (
        <RoomDetailPanel
          roomId={activeRoomId}
          onClose={() => setActiveRoomId(null)}
          onOpenCatInfo={(catId) => {
            setActiveCatInfoId(catId);
          }}
        />
      ) : null}
      {catsOpen ? <CatRosterScreen onClose={() => setCatsOpen(false)} /> : null}
      {diaryOpen ? <CatDiary onClose={() => setDiaryOpen(false)} /> : null}
      <EventCardStack events={liveEvents} onDismiss={dismissLiveEvent} />
      <Tutorial />
      <OfflineSummaryOverlay />
      <nav className="mobile-tab-bar" aria-label="Main tabs">
        <button type="button" onClick={openHouse}>House</button>
        <button type="button" onClick={openCats}>Cats</button>
        <button type="button" onClick={() => setDiaryOpen(true)}>Diary</button>
      </nav>
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
