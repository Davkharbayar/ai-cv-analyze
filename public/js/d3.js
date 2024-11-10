// Set up SVG canvas dimensions
const svgWidth = window.innerWidth;
const svgHeight = window.innerHeight;

// Select the SVG element and set its width and height
const svg = d3.select("#background-animation")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Number of circles
const numberOfCircles = 50;

// Retrieve saved circle positions from local storage, if available
let savedCircles = JSON.parse(localStorage.getItem("circlesData")) || [];

// Generate circle data: if no saved data is available, generate random values
let circlesData = savedCircles.length ? savedCircles : d3.range(numberOfCircles).map(() => ({
    cx: Math.random() * svgWidth,
    cy: Math.random() * svgHeight,
    r: Math.random() * 15 + 5,
    xSpeed: (Math.random() - 0.5) * 2, // Speed between -1 and 1
    ySpeed: (Math.random() - 0.5) * 2, // Speed between -1 and 1
}));

// Create the circles using the data
const circles = svg.selectAll("circle")
    .data(circlesData)
    .enter()
    .append("circle")
    .attr("cx", d => d.cx)
    .attr("cy", d => d.cy)
    .attr("r", d => d.r)
    .attr("fill", "url(#gradient)")
    .attr("opacity", 0.7);

// Add gradient fill to circles
svg.append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .selectAll("stop")
    .data([
        { offset: "0%", color: "#007bff" },
        { offset: "100%", color: "#6610f2" }
    ])
    .enter()
    .append("stop")
    .attr("offset", d => d.offset)
    .attr("stop-color", d => d.color);

// Animation loop with D3.js timer
d3.timer(() => {
    circles
        .attr("cx", d => {
            d.cx += d.xSpeed;
            if (d.cx > svgWidth || d.cx < 0) d.xSpeed *= -1;
            return d.cx;
        })
        .attr("cy", d => {
            d.cy += d.ySpeed;
            if (d.cy > svgHeight || d.cy < 0) d.ySpeed *= -1;
            return d.cy;
        });

    // Save the current positions to local storage at an interval
    saveCirclePositions();
});

// Function to save circle positions to local storage
function saveCirclePositions() {
    const updatedData = circles.data().map(d => ({
        cx: d.cx,
        cy: d.cy,
        r: d.r,
        xSpeed: d.xSpeed,
        ySpeed: d.ySpeed,
    }));
    localStorage.setItem("circlesData", JSON.stringify(updatedData));
}

// Save periodically every 2 seconds instead of every frame
setInterval(saveCirclePositions, 2000);
