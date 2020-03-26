import React, { useMemo, useRef, useState } from "react";
import { scaleLinear } from "d3-scale";
import { max } from "d3-array";

import { format } from "d3-format";
import { range } from "d3-array";
import { line } from "d3-shape";
import { normal } from "jstat";

import { useGesture } from 'react-use-gesture'
import { useSpring, animated } from 'react-spring'


const Axis = ({
  domain=[0, 100],
  range=[10, 290]
}) => {
  const ticks = useMemo(() => {
    const xScale = scaleLinear()
      .domain(domain)
      .range(range)
    const width = range[1] - range[0]
    const pixelsPerTick = 30
    const numberOfTicksTarget = Math.max(
      1,
      Math.floor(
        width / pixelsPerTick
      )
    )
    return xScale.ticks(numberOfTicksTarget)
      .map(value => ({
        value,
        xOffset: xScale(value)
      }))
  }, [
    domain.join("-"),
    range.join("-")
  ])
  return (
    <g>
      <path
        d={[
          "M", range[0], 6,
          "v", -6,
          "H", range[1],
          "v", 6,
        ].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g
          key={value}
          transform={`translate(${xOffset}, 0)`}
        >
          <line
            y2="6"
            stroke="currentColor"
          />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)"
            }}>
            { value }
          </text>
        </g>
      ))}
    </g>
  )
}

const AnimatedAxis = animated(Axis);

// Generates data
const genData = (mu, SD, x) => {
  var y = [];
  for (var i = 0; i < x.length; i++) {
    y.push(normal.pdf(x[i], mu, SD));
  }
  var tmp = [];
  x.unshift(x[0]);
  y.unshift(0);
  x.push(x[x.length - 1]);
  y.push(0);
  for (var i = 0; i < x.length; i++) {
    tmp.push([x[i], y[i]]);
  }

  var data = {
    data: tmp,
    x: x,
    y: y
  };
  return data;
};

const VerticalLine = ({ x, y1, y2, id }) => {
  return <line x1={x} x2={x} y1={y1} y2={y2} id={id} />;
};

const margin = { top: 60, right: 20, bottom: 30, left: 20 };

const OverlapChart = props => {

  const [{xOffset}, set] = useSpring(() => ({xOffset: 0}))
  const [xDiff, setDiff] = useState(0);
  const bind = useGesture({
    onDrag: ({delta: [dx,]}) => {
      set({xOffset: xOffset.value + dx, immediate: true})
      setDiff(xScale.invert(xOffset.value) - xScale.invert(0))
    },
    onDoubleClick: () => {
      set({xOffset: 0})
      setDiff(0)
    }
  })

  const {
    cohend,
    M0,
    M1,
    xLabel,
    muZeroLabel,
    muOneLabel,
    width,
    height,
    SD
  } = props;
  const aspect = 0.4;
  const w = width - margin.left - margin.right;
  const h = width * 0.4 - margin.top - margin.bottom;

  // x.values
  const x_start = M0 - 3 * SD;
  const x_end = M1 + 3 * SD;
  const x = range(x_start, x_end, Math.abs(x_start - x_end) / 100);

  // Data sets
  const data1 = useMemo(() => genData(M0, SD, x), [SD, w]);
  //const data2 = useMemo(() => genData(M1, SD, x), [SD, w]);

  // Axes min and max
  const x_max = useMemo(() => M1 + SD * 3, []);
  const x_min = useMemo(() => M0 - SD * 3, []);
  const yMax = max(data1.y);

  // Scales and Axis
  /*   const [xScale, setXScale] = useState(() =>
    scaleLinear()
      .domain([x_min, x_max])
      .range([0, w])
  ); */

  const xScale = useMemo(
    () =>
      scaleLinear()
        .domain([x_min, x_max])
        .range([0, w]),
    [w]
  );
  /*  const [xAxis, setXAxis] = useState(() => {
    return axisBottom(xScale);
  }); */

  /*   // Zoom
  var zoomFn = zoom().on("zoom", zoomed);

  function zoomed() {
    setZoomTrans(event.transform.x);
    const xAxis = axisBottom(xScale);
    if (typeof event.transform.rescaleX === "function") {
      const newX = xAxis.scale(event.transform.rescaleX(xScale));
      setXAxis(() => newX);
    }
  }
 */
  // Resize
  /*   useEffect(() => {
    const t = zoomTransform(vizRef.current);
    const newXScale = t.rescaleX(xScale.range([0, w]));
    setXAxis(() => axisBottom(newXScale));
  }, [w]); */

  // Update
  /*   useEffect(() => {
    createOverlapChart(durationTime);
  }, [para]); */

  const yScale = scaleLinear()
    .domain([0, yMax])
    .range([0, h]);

  // Line function
  const linex = useMemo(
    () =>
      line()
        .x(d => xScale(d[0]))
        .y(d => h - yScale(d[1])),
    [w]
  );

  const PathDist1 = useMemo(() => linex(data1.data), [SD, w]);
  //const PathDist2 = linex(data2.data);
  const labMargin = cohend > 0.1 ? 5 : 15;
  /*   const createOverlapChart = durationTime => {
    // Axis
    select(node)
      .selectAll("g.xAxis")
      .data([0])
      .enter()
      .append("g")
      .attr("class", "xAxis");

    select(node)
      .select("g.xAxis")
      .attr(
        "transform",
        "translate(" + margin.left + "," + (h + margin.top) + ")"
      )
      .call(xAxis);

    select(node)
      .call(zoomFn)
      .on("wheel.zoom", null)
      .on("mousewheel.zoom", null)
      .on("dblclick.zoom", () => {
        const newXScale = xScale.domain([x_min, x_max]).range([0, w]);
        setXScale(() => newXScale);
        select(vizRef.current)
          .transition()
          .duration(200)
          .call(zoomFn.transform, zoomIdentity);
      });
    } */

  
  console.log("diff " + xDiff)
  return (
    <svg width={props.width} height={props.width * 0.4}>
      <animated.g {...bind()} transform={xOffset.interpolate((x) => `translate(${margin.left + x}, ${margin.top})`)}>
        <path id="dist1" d={PathDist1} />
        <clipPath id="distClip">
          <use href="#dist2" />
        </clipPath>
        <g>
          <path
            d={PathDist1}
            id="dist2"
            transform={`translate(${xScale(M1) - xScale(M0)},0)`}
          />
        </g>
        <path d={PathDist1} clipPath="url(#distClip)" id="distOverlap" />

        <VerticalLine
          x={xScale(M0)}
          y1={yScale(0)}
          y2={yScale(yMax)}
          id="mu0"
        />
        <VerticalLine
          x={xScale(M1)}
          y1={yScale(0)}
          y2={yScale(yMax)}
          id="mu1"
        />
        <text
          textAnchor="middle"
          id="x-label"
          transform={`translate(${w / 2}, ${h + margin.bottom})`}
        >
          {xLabel}
        </text>
        <line
          x1={xScale(M0)}
          x2={xScale(M1)}
          y1={-10}
          y2={-10}
          id="mu_connect"
          marker-start="url(#arrow)"
          marker-end="url(#arrow)"
        />
        <text
          x={xScale((M0 + M1) / 2)}
          y={-50}
          className="MuiTypography-h5 fontWeightBold"
          dominantBaseline="central"
          textAnchor="middle"
          id="cohend_float"
        >
          {`Cohen's d: ${format(".2n")(cohend)}`}
        </text>
        <text
          x={xScale((M0 + M1) / 2)}
          y={-25}
          className="MuiTypography-body1"
          dominantBaseline="central"
          textAnchor="middle"
          id="diff_float"
        >
          {`(Diff: ${format(".3n")(M1 - M0)})`}
        </text>
        <text
          x={xScale(M0) - labMargin}
          y={-10}
          className="MuiTypography-body1"
          dominantBaseline="central"
          textAnchor={cohend >= 0 ? "end" : "start"}
          id="mu0Label"
        >
          {muZeroLabel}
        </text>
        <text
          x={xScale(M1) + labMargin}
          y={-10}
          className="MuiTypography-body1"
          dominantBaseline="central"
          textAnchor={cohend >= 0 ? "start" : "end"}
          id="mu1Label"
        >
          {muOneLabel}
        </text>
      </animated.g>
      <g transform={`translate(${margin.left}, ${h + margin.top})`}>
        <Axis domain={[x_min - xDiff, x_max - xDiff]} range={[0,w]}/>
        </g>
      <defs>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
    </svg>
  );
};

export default OverlapChart;
