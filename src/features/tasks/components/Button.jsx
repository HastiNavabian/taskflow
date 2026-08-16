import { Children } from "react";

function Button({ onClick, children, variant = "primary", type = "button" }) {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}
export default Button;
