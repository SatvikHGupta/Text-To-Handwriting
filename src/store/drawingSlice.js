// drawing slice: active tool, color and line width
export function createDrawingSlice(set) {
  return {
    drawingTool:      'none',
    drawingColor:     '#000000',
    drawingLineWidth: 2,

    setDrawingTool:      (tool)  => set({ drawingTool: tool }),
    setDrawingColor:     (color) => set({ drawingColor: color }),
    setDrawingLineWidth: (w)     => set({ drawingLineWidth: w }),
  };
}
