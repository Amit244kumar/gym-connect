const Shimmer = ({ width = "100%", height = "20px", className = "" }) => (
  <div
    className={`shimmer ${className}`}
    style={{
      width,
      height,
      background: "linear-gradient(90deg, #334155 25%, #475569 50%, #334155 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.5s infinite",
      borderRadius: "4px"
    }}
  />
);
export default Shimmer;