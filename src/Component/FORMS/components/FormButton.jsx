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
        onClick={onReturn}
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