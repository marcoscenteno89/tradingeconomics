import React, { useState, useEffect, useRef } from 'react';
import { CanvasManager, Line } from "@marccent/util/canvas";
import Loading from './loading';

/**
 * Higher-order component that wraps a component with canvas functionality.
 * @param {React.Component} Component - The component to be wrapped.
 * @returns {React.Component} - The wrapped component.
 */
const withCanvas = (Component) => {
  const WithCanvasComponent = (props) => {
    const ref = useRef(null);
    const [ sketch, setSketch ] = useState(null);
    const cls = props.canvasCls ? props.canvasCls.split(' ') : [];
    cls.push('canvas-container');

    useEffect(() => {

      /**
       * Initializes the canvas and sets up the sketch.
       * @returns {Promise<void>} A promise that resolves once the canvas is initialized.
       */
      
      const init = async () => {
        const data = {};
        data.p5 = (await import("p5")).default;
        data.sketch = new data.p5((p) => data.p = p);
        data.canvas = new CanvasManager(data.p5, data.p, ref.current);
        setSketch(data);
      }
      init();
    }, []);
    return (
      <div className={cls.join(' ')}>
        <canvas ref={ref}></canvas>
        <Loading require={[sketch]}>
          <Component {...props} cavasRef={ref} sketch={sketch} />
        </Loading>
      </div>
    );
  }
  return WithCanvasComponent;
}

const Graph = (props) => {
  const { base, pts, obj } = props;
  const { data, min, max } = obj;
  const { sketch, canvas: c, p } = props.sketch;
  const [ grid, setGrid ] = useState(null);
  const [ selected, setSelected ] = useState(null);
  const [ cell ] = useState({x: p.width / data.length, y: p.height / base});

  // Set canvas properties, only runs once
  useEffect(() => {
    sketch.setup = () => {
      p.frameRate(30);
      p.textSize(10);
      p.stroke(255);
      p.fill(255);
    }
    sketch.setup();
  }, []);

  // Create a grid, runs every time obj changes (ticker)
  useEffect(() => {
    const grid = [];
    for (let x = 0; x < data.length; x++) {
      const col = [];
      let current = max;
      for (let y = 0; y < base; y++) {
        col.push({
          x: x,
          y: y,
          date: data[x].Date,
          price: current
        });
        current = current - pts;
      }
      grid.push(col);
    }
    
    setGrid(grid); // Set state for Grid
  }, [obj]);

  useEffect(() => {
    
    sketch.draw = () => {
      p.clear();
      p.noFill();
      p.beginShape();
      for (let i = 0; i < data.length; i++) {
        const x = p.map(i, 0, data.length, 0, p.width);
        const y = p.map(data[i].Close, min, max, p.height, 0);
        p.vertex(x, y);
      }
      p.endShape();
      
      if (grid) { // Make sure grid exists befor running calculations
        if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
          new Line(c, p.createVector(0, p.mouseY), p.createVector(p.width, p.mouseY), false);
          new Line(c, p.createVector(p.mouseX, 0), p.createVector(p.mouseX, p.height), false);
          let x = p.floor(p.mouseX / cell.x);
          let y = p.floor(p.mouseY / cell.y);
          setSelected(grid[x][y]);
        }
      }
      
    }
  
    sketch.draw();
  }, [grid]);

  return (
    <div className="selected">
      {selected && (
        <div>{selected.date.format('dddd, DD MMMM YYYY')} ${selected.price.toFixed(4)}</div>
      )}
    </div>
  );
}

const GraphWithCanvas = withCanvas(Graph);

export { GraphWithCanvas }  