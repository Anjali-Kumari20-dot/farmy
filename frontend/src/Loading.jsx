function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      background: '#f5f1e8',
      color: '#2f3a2d',
      fontFamily: 'Segoe UI, sans-serif',
      textAlign: 'center',
    }}>
      <div
        style={{
          width: '56px',
          height: '56px',
          border: '5px solid #d4c5a3',
          borderTop: '5px solid #2d6a4f',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      />
      <p style={{ marginTop: '1rem', fontSize: '1.1rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
        Loading...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Loading;
