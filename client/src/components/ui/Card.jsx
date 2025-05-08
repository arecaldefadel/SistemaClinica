const Card = ({ children, title, subtitle }) => {
  return (
    <div className="bg-[var(--background)] text-[var(--text)] p-6 rounded-lg border border-[var(--gray)] shadow">
      <div>
      {title ? <h2 className="text-xl max-sm:text-lg font-semibold mb-2">{title}</h2> : null}
      {subtitle? <p className="text-[var(--muted)]">{subtitle}</p> : null}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default Card
