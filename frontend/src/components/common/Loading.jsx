import "./Loading.css";

// Full-page loading spinner shown during auth verification
function Loading() {
  return (
    <div className="loading-container">
      <div className="loading-spinner" />
      <p className="loading-label">Loading...</p>
    </div>
  );
}

export default Loading;
