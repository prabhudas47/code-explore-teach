// Cheap fallback when the device can't sustain 60fps for the WebGL shader.
// Pure CSS — no JS animation loop.
export const LowPowerBackground = () => (
  <div
    aria-hidden
    className="fixed inset-0 z-0 pointer-events-none"
    style={{
      background:
        'radial-gradient(1200px 800px at 20% 10%, hsl(0 0% 8%), hsl(0 0% 4%) 60%, hsl(0 0% 2%) 100%)',
    }}
  />
);
