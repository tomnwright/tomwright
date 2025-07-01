export class CursorPopup {
  constructor(popupSelector) {
    this.popup = document.querySelector(popupSelector);
    this.isVisible = false;
    this.offset = { x: 0, y: 0 }; // Offset from cursor
  }

  showPopup(e) {
    this.isVisible = true;
    this.popup.classList.add("show");
    document.body.classList.add("popup-active");
    this.updatePosition(e);
  }

  hidePopup() {
    this.isVisible = false;
    this.popup.classList.remove("show");
    document.body.classList.remove("popup-active");
  }

  updatePosition(e) {
    if (!this.isVisible) return;

    const x = e.clientX + this.offset.x;
    const y = e.clientY + this.offset.y;

    // Get popup dimensions
    const popupRect = this.popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust position to keep popup in viewport
    let finalX = x;
    let finalY = y;

    // Check right edge
    if (x + popupRect.width > viewportWidth) {
      finalX = e.clientX - popupRect.width - 15;
    }

    // Check top edge
    if (y < 0) {
      finalY = e.clientY + 15;
    }

    // Check bottom edge
    if (y + popupRect.height > viewportHeight) {
      finalY = e.clientY - popupRect.height - 15;
    }

    this.popup.style.left = finalX + "px";
    this.popup.style.top = finalY + "px";
  }
}
