const Tooltip = ({ children, title = '' }) => {
  return (
    <div className="relative group inline-flex w-fit h-fit">
      <div className="inline-block">
        {children}
      </div>
      <div className="absolute bottom-full left-1/2 z-10 mb-1 hidden group-hover:block
                      -translate-x-1/2 pointer-events-none">
        <div className="relative bg-gray-800 text-white text-sm px-3 py-1 rounded shadow whitespace-nowrap">
          {title}
          <div className="absolute top-full left-1/2 -translate-x-1/2 bg-gray-800 rotate-45"></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
