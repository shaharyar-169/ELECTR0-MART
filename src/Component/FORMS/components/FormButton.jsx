import { useNavigate } from "react-router-dom";

export default function FormButtons({
  saveText = "Save",
  returnText = "Return",
  newText = "New",
  onSave,
  onReturn,
  onNew,
  saveButtonRef,
  disabled = false,
}) {
  const navigate = useNavigate();

  const handleReturnClick = () => {
    // If a custom onReturn handler is provided, run it first
    if (typeof onReturn === "function") {
      onReturn();
    }
    // Then navigate to "/"
    navigate("/MainPage");
  };

  return (
    <div className="el-form-actions">
      <button
        ref={saveButtonRef}
        type="submit"
        className="el-btn el-btn-save"
        onClick={onSave}
        disabled={disabled}
      >
        {saveText}
      </button>

      <button
        type="button"
        className="el-btn el-btn-return"
        onClick={handleReturnClick}
      >
        {returnText}
      </button>

      <button
        type="button"
        className="el-btn el-btn-new"
        onClick={onNew}
      >
        {newText}
      </button>
    </div>
  );
}