import { ref, inject } from "vue";

export function useDragAndDrop() {
  const kanbanBoard = inject("kanbanBoard");

  const isDragging = ref(false);
  const draggedItem = ref(null);

  const startCardDrag = (event, cardId, columnId) => {
    if (kanbanBoard.isDisabledGlobal.value) {
      event.preventDefault();
      return;
    }

    isDragging.value = true;
    draggedItem.value = { cardId, columnId };

    // Set drag data
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", "dragging");
    event.dataTransfer.setData("cardId", String(cardId));
    event.dataTransfer.setData("columnId", String(columnId));

    // Create custom drag image
    const dragImage = createDragImage(event.target);
    event.dataTransfer.setDragImage(
      dragImage,
      dragImage.offsetWidth / 2,
      dragImage.offsetHeight / 2
    );

    // Remove the drag image after delay
    setTimeout(() => {
      if (document.body.contains(dragImage)) {
        document.body.removeChild(dragImage);
      }
    }, 0);

    event.target.classList.add("dragging");
    event.target.addEventListener(
      "dragend",
      () => {
        event.target.classList.remove("dragging");
        isDragging.value = false;
        draggedItem.value = null;
      },
      { once: true }
    );
  };
  const handleDragOver = (event, isDisabled = false) => {
    if (kanbanBoard.isDisabledGlobal.value || isDisabled) return;

    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event) => {
    if (kanbanBoard.isDisabledGlobal.value) return null;

    event.preventDefault();

    const cardId = parseInt(event.dataTransfer.getData("cardId"), 10);
    const fromColumnId = parseInt(event.dataTransfer.getData("columnId"), 10);

    if (isNaN(cardId) || isNaN(fromColumnId)) {
      console.warn("Invalid drag data received");
      return null;
    }

    return {
      cardId,
      fromColumnId,
    };
  };

  const createDragImage = (sourceNode) => {
    const node = sourceNode.cloneNode(true);

    // Style the drag image
    Object.assign(node.style, {
      position: "absolute",
      top: "-9999px",
      left: "-9999px",
      width: "300px",
      minHeight: "80px",
      opacity: "1",
      pointerEvents: "none",
      boxShadow:
        "0 16px 48px 0 rgba(0,123,255,0.55), 0 2px 8px 0 rgba(0,0,0,0.18)",
      border: "3px solid #007bff",
      background: "#eaf4ff",
      transform: "scale(1.07)",
      zIndex: "9999",
      borderRadius: "8px",
    });

    document.body.appendChild(node);
    return node;
  };

  return {
    startCardDrag,
    handleDragOver,
    handleDrop,
  };
}
