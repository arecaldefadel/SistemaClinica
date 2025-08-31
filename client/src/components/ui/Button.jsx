import Icon from "./Icon";
const Button = ({
  title = "",
  onClick = () => {},
  variant = "default",
  icon,
  className,
  children,
  ...rest
}) => {
  const buttonVariants = {
    transparent:
      "text-[var(--button)] border-2 border-[var(--button)] hover:bg-[var(--button-hover)] hover:text-white ",
    default: "bg-[var(--button)] hover:bg-[var(--button-hover)]  text-white ",
    success: "bg-[var(--accent)] hover:bg-[var(--primary)]  text-white ",
    danger:
      "bg-[var(--button-danger)] hover:bg-[var(--button-danger-hover)]  text-white ",
    warning:
      "bg-[var(--button-warn)] hover:bg-[var(--button-warn-hover)]  text-white ",
  };

  return (
    <button
      onClick={onClick}
      className={`flex flex-row gap-2 px-4 py-2 rounded  hover:cursor-pointer items-center justify-center ${className} ${buttonVariants[variant]}`}
      {...rest}>
      {icon ? <Icon iconName={icon}></Icon> : null}
      {title}
      {children}
    </button>
  );
};
export default Button;
