export default function ToastContainer({ toasts }) {
  const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

  return positions.map((pos) => {
    const [vertical, horizontal] = pos.split('-');

    return (
      <div
        key={pos}
        className={`fixed z-50 ${vertical === 'top' ? 'top-4' : 'bottom-4'} ${
          horizontal === 'left' ? 'left-4' : 'right-4'
        } space-y-2`}
      >
        {toasts
          .filter((t) => t.position === pos)
          .map((t) => (
            <div
              key={t.id}
              className={`w-100 px-4 py-2 rounded shadow text-[var(--text)] text-sm
                ${t.type === 'success' ? 'bg-green-300 border-2 border-green-500' : ''}
                ${t.type === 'error' ? 'bg-red-300 border-2  border-red-500' : ''}
                ${t.type === 'warn' ? 'bg-yellow-200 border-2 border-yellow-300 text-black' : ''}
                ${t.type === 'info' ? 'bg-blue-300 border-2 border-blue-500' : ''}
              `}
            >
              {t.title? <h2 className="text-lg font-bold">{'Titulo de toast'}</h2> : null }
              {t.message}
            </div>
          ))}
      </div>
    );
  });
}