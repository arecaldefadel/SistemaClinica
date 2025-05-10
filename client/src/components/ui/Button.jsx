import Icon from "./Icon";
const Button = ({title = "", onClick = ()=>{} , variant='default', icon,className  }) => {
  
  const buttonVariants = {
    default: "bg-[var(--button)] hover:bg-[var(--button-hover)]",
    danger: "bg-[var(--button-danger)] hover:bg-[var(--button-danger-hover)]",
    warning: "bg-[var(--button-warn)] hover:bg-[var(--button-warn-hover)]"
  }


  return (
    <button onClick={onClick} className={`flex flex-row gap-2 text-white px-4 py-2 rounded  hover:cursor-pointer ${className} ${buttonVariants[variant]}`}>
      {
        icon? <Icon iconName={icon} ></Icon> : null
      }
      {title}
    </button>
  );
};
export default Button;
