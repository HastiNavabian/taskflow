import Button from "./Button";
function Modal({ children }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">{children}</div>
    </div>
  );
}
export default Modal;
