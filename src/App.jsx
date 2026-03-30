// Root component: layout switches between mobile tab view and desktop 3-panel

import { useEffect }     from 'react';
import { useStore }      from './store.js';
import { useBreakpoint } from './hooks/useBreakpoint.js';
import Navbar            from './components/Navbar.jsx';
import ControlsSidebar   from './components/ControlsSidebar.jsx';
import HandwritingPage   from './components/page/HandwritingPage.jsx';
import DrawingCanvas     from './components/DrawingCanvas.jsx';
import DrawingToolbar    from './components/DrawingToolbar.jsx';
import TextEditor        from './components/TextEditor.jsx';
import PageManager       from './components/PageManager.jsx';
import MobileTabBar      from './components/MobileTabBar.jsx';
import ExportModal       from './components/modals/ExportModal.jsx';
import FontPickerModal   from './components/modals/FontPickerModal.jsx';
import HelpModal         from './components/modals/HelpModal.jsx';
import ColorTagsModal    from './components/modals/ColorTagsModal.jsx';

export default function App() {
  const loadFromDB      = useStore((s) => s.loadFromDB);
  const exportModalOpen = useStore((s) => s.exportModalOpen);
  const fontPickerOpen  = useStore((s) => s.fontPickerOpen);
  const helpOpen        = useStore((s) => s.helpOpen);
  const colorTagsOpen   = useStore((s) => s.colorTagsOpen);
  const settings        = useStore((s) => s.settings);
  const drawingTool     = useStore((s) => s.drawingTool);
  const zoom            = useStore((s) => s.zoom);
  const setZoom         = useStore((s) => s.resetZoom);
  const mobileTab       = useStore((s) => s.mobileTab);

  const { isMobile, isTablet } = useBreakpoint();

  useEffect(() => { loadFromDB(); }, [loadFromDB]);

  // auto-set zoom on mobile/tablet so page fits the screen
  useEffect(() => {
    if (isMobile) {
      // on mobile, page panel is fullscreen width minus padding
      const fitZoom = Math.max(0.3, +((window.innerWidth - 32) / settings.pageWidth).toFixed(2));
      useStore.setState({ zoom: Math.min(fitZoom, 0.55) });
    } else if (isTablet) {
      const fitZoom = Math.max(0.3, +((window.innerWidth * 0.6) / settings.pageWidth).toFixed(2));
      useStore.setState({ zoom: Math.min(fitZoom, 0.72) });
    }
  }, [isMobile, isTablet]);

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-app)' }}>
      <Navbar />

      {isMobile ? (
        <MobileLayout
          settings={settings}
          zoom={zoom}
          drawingTool={drawingTool}
          mobileTab={mobileTab}
        />
      ) : isTablet ? (
        <TabletLayout
          settings={settings}
          zoom={zoom}
          drawingTool={drawingTool}
        />
      ) : (
        <DesktopLayout
          settings={settings}
          zoom={zoom}
          drawingTool={drawingTool}
        />
      )}

      {exportModalOpen && <ExportModal />}
      {fontPickerOpen  && <FontPickerModal />}
      {helpOpen        && <HelpModal />}
      {colorTagsOpen   && <ColorTagsModal />}
    </div>
  );
}

function DesktopLayout({ settings, zoom, drawingTool }) {
  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
      <ControlsSidebar />
      <CanvasColumn settings={settings} zoom={zoom} drawingTool={drawingTool} />
      <TextEditor />
    </div>
  );
}

function TabletLayout({ settings, zoom, drawingTool }) {
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  return (
    <div style={{ display: 'flex', flex: 1, minHeight: 0, position: 'relative' }}>
      {/* sidebar overlays on tablet when open */}
      {sidebarOpen && (
        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, zIndex: 30, display: 'flex' }}>
          <ControlsSidebar />
          {/* tap-outside to close */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: -1, background: 'rgba(0,0,0,0.4)' }}
            onClick={() => useStore.setState({ sidebarOpen: false })}
          />
        </div>
      )}
      <CanvasColumn settings={settings} zoom={zoom} drawingTool={drawingTool} flex />
      <TextEditor compact />
    </div>
  );
}

function MobileLayout({ settings, zoom, drawingTool, mobileTab }) {
  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', minHeight: 0 }}>
      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', position: 'relative' }}>
        {/* settings panel */}
        {mobileTab === 'settings' && (
          <div style={{ height: '100%', overflow: 'auto' }} className="custom-scrollbar">
            <ControlsSidebar fullscreen />
          </div>
        )}
        {/* page/canvas panel */}
        {mobileTab === 'page' && (
          <CanvasColumn settings={settings} zoom={zoom} drawingTool={drawingTool} />
        )}
        {/* text editor panel */}
        {mobileTab === 'text' && (
          <TextEditor fullscreen />
        )}
      </div>
      <MobileTabBar />
    </div>
  );
}

// Shared canvas column used across all layouts
function CanvasColumn({ settings, zoom, drawingTool, flex }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: flex ? 1 : undefined, minWidth: 0, minHeight: 0, background: 'var(--bg-canvas)', ...(flex ? {} : { flex: 1 }) }}>
      <div
        style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: '24px 16px' }}
        className="custom-scrollbar"
      >
        <ScaledPage pageWidth={settings.pageWidth} pageHeight={settings.pageHeight} zoom={zoom}>
          <HandwritingPage />
          <DrawingCanvas pageWidth={settings.pageWidth} pageHeight={settings.pageHeight} />
        </ScaledPage>

        {drawingTool !== 'none' && (
          <div style={{ marginTop: '12px' }}>
            <DrawingToolbar />
          </div>
        )}
      </div>

      <div style={{ flexShrink: 0, width: '100%', padding: '8px 12px', borderTop: '1px solid var(--border)', background: 'var(--bg-panel)' }}>
        <PageManager />
      </div>
    </div>
  );
}

function ScaledPage({ pageWidth, pageHeight, zoom, children }) {
  return (
    <div className="scaled-page-outer" style={{ '--page-w': `${pageWidth}px`, '--page-h': `${pageHeight}px`, '--scale': zoom }}>
      <div className="scaled-page-inner">{children}</div>
    </div>
  );
}
