export default function ReactMultiEmailLabel({ email, index, removeEmail }) {
  return (
    <div
      data-tag
      key={index}
    >
      <div data-tag-item>{email}</div>
      <button
        data-tag-handle
        onClick={(e) => {
          e.preventDefault();
          removeEmail(index);
        }}
      >
        ×
      </button>
    </div>
  );
}
