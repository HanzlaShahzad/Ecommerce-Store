import { useEffect, useMemo, useRef } from "react";
import { useSelector } from "react-redux";
import * as d3 from "d3";

const RevenueChart = () => {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  // Get all orders from Redux
  const orders = useSelector((state) => state.totalOrders?.totalOrder);

  // =========================================================
  // CREATE PREVIOUS 7 DAYS REVENUE DATA
  // =========================================================
  const data = useMemo(() => {
    const dailyRevenue = {};

    // Create previous 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date();

      date.setDate(date.getDate() - i);

      const dateKey = date.toISOString().split("T")[0];

      dailyRevenue[dateKey] = 0;
    }

    // Add paid orders
    (Array.isArray(orders) ? orders : [])
      .filter((order) => order?.paymentStatus === "paid")
      .forEach((order) => {
        const date = new Date(order?.createdAt);

        const dateKey = date.toISOString().split("T")[0];

        if (dailyRevenue[dateKey] !== undefined) {
          dailyRevenue[dateKey] += Number(order?.totalPrice) || 0;
        }
      });

    return Object.entries(dailyRevenue).map(([date, revenue]) => ({
      date,
      day: d3.timeFormat("%a %d")(new Date(date)),
      revenue,
    }));
  }, [orders]);

  // =========================================================
  // DRAW D3 CHART
  // =========================================================
  useEffect(() => {
    if (!svgRef.current || !containerRef.current) {
      return;
    }

    const drawChart = () => {
      const container = containerRef.current;

      const containerWidth = container.clientWidth;

      const containerHeight = container.clientHeight;

      if (containerWidth <= 0 || containerHeight <= 0) {
        return;
      }

      // Clear previous chart
      const svg = d3.select(svgRef.current);

      svg.selectAll("*").remove();

      // Keep chart compact
      const width = containerWidth;

      const height = Math.max(containerHeight, 180);

      // Responsive margins
      const margin = {
        top: 10,
        right: 15,
        bottom: 35,
        left: 45,
      };

      const chartWidth = width - margin.left - margin.right;

      const chartHeight = height - margin.top - margin.bottom;

      // =====================================================
      // X SCALE
      // =====================================================
      const x = d3
        .scalePoint()
        .domain(data.map((d) => d.day))
        .range([0, chartWidth])
        .padding(0.5);

      // =====================================================
      // Y SCALE
      // =====================================================
      const maxRevenue = d3.max(data, (d) => d.revenue) || 0;

      const y = d3
        .scaleLinear()
        .domain([0, maxRevenue])
        .nice()
        .range([chartHeight, 0]);

      // =====================================================
      // MAIN GROUP
      // =====================================================
      const chart = svg
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("preserveAspectRatio", "none")
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      // =====================================================
      // X AXIS
      // =====================================================
      chart
        .append("g")
        .attr("transform", `translate(0,${chartHeight})`)
        .call(d3.axisBottom(x))
        .call((g) => g.select(".domain").attr("stroke", "#9aa9b8"))
        .selectAll("text")
        .style("font-size", "10px")
        .style("fill", "#718398");

      // =====================================================
      // Y AXIS
      // =====================================================
      chart
        .append("g")
        .call(
          d3
            .axisLeft(y)
            .ticks(5)
            .tickFormat((d) => (d >= 1000 ? `${d / 1000}k` : d)),
        )
        .call((g) => g.select(".domain").attr("stroke", "#9aa9b8"))
        .selectAll("text")
        .style("font-size", "9px")
        .style("fill", "#718398");

      // =====================================================
      // HORIZONTAL GRID LINES
      // =====================================================
      chart
        .append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y).ticks(5).tickSize(-chartWidth).tickFormat(""))
        .call((g) => g.select(".domain").remove())
        .selectAll("line")
        .attr("stroke", "#edf0f3")
        .attr("stroke-dasharray", "3,3");

      // =====================================================
      // CURVED LINE
      // =====================================================
      const line = d3
        .line()
        .x((d) => x(d.day))
        .y((d) => y(d.revenue))
        .curve(d3.curveCatmullRom.alpha(0.5));

      // =====================================================
      // DRAW LINE
      // =====================================================
      chart
        .append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "oklch(70.5% 0.213 47.604)")
        .attr("stroke-width", 3)
        .attr("stroke-linecap", "round")
        .attr("stroke-linejoin", "round")
        .attr("d", line);

      // =====================================================
      // DRAW POINTS
      // =====================================================
      const points = chart
        .selectAll(".point")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "point")
        .attr("cx", (d) => x(d.day))
        .attr("cy", (d) => y(d.revenue))
        .attr("r", 4)
        .attr("fill", "oklch(70.5% 0.213 47.604)");

      // =====================================================
      // TOOLTIP
      // =====================================================
      points
        .append("title")
        .text((d) => `${d.day}: Rs. ${d.revenue.toLocaleString()}`);
    };

    // Draw initially
    drawChart();

    // =========================================================
    // RESPONSIVE RESIZE
    // =========================================================
    const resizeObserver = new ResizeObserver(() => {
      drawChart();
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [data]);

  // =========================================================
  // UI
  // =========================================================
  return (
    <div
      ref={containerRef}
      className="
        h-full
        min-h-0
        w-full
        overflow-hidden
      "
    >
      {data.length > 0 ? (
        <svg
          ref={svgRef}
          className="
            block
            h-full
            w-full
          "
        />
      ) : (
        <div
          className="
            flex
            h-full
            min-h-[180px]
            items-center
            justify-center
            text-sm
            text-gray-500
          "
        >
          No paid orders available
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
