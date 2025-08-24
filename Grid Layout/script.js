const gridContainer = document.getElementById('gridContainer');
const addBtn = document.getElementById('addItem');
const removeBtn = document.getElementById('removeItem');

let itemCount = 0;
let draggedItem = null;

// Random color generator
function getRandomColor() {
  return `hsl(${Math.random() * 360}, 70%, 50%)`;
}

// Random height generator
function getRandomHeight() {
  return Math.floor(Math.random() * 100) + 100; // 100px - 200px
}

// Add new item
function addItem() {
  itemCount++;
  const item = document.createElement('div');
  item.classList.add('grid-item');
  item.textContent = `Item ${itemCount}`;
  item.setAttribute('draggable', true);
  item.style.backgroundColor = getRandomColor();
  item.style.height = `${getRandomHeight()}px`;

  // Drag events
  item.addEventListener('dragstart', () => {
    draggedItem = item;
    item.classList.add('dragging');
    setTimeout(() => item.style.display = 'none', 0);
  });

  item.addEventListener('dragend', () => {
    draggedItem = null;
    item.classList.remove('dragging');
    item.style.display = 'block';
  });

  gridContainer.appendChild(item);
  animateGrid();
}

// Remove last item with animation
function removeItem() {
  const lastItem = gridContainer.lastChild;
  if (!lastItem) return;

  lastItem.style.opacity = '0';
  lastItem.style.transform = 'scale(0.8)';
  setTimeout(() => {
    gridContainer.removeChild(lastItem);
    itemCount--;
    animateGrid();
  }, 300);
}

// Drag over
gridContainer.addEventListener('dragover', (e) => {
  e.preventDefault();
  const afterElement = getDragAfterElement(gridContainer, e.clientY);
  if (!afterElement) {
    gridContainer.appendChild(draggedItem);
  } else {
    gridContainer.insertBefore(draggedItem, afterElement);
  }
  animateGrid();
});

// Helper to find element after drag
function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('.grid-item:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset: offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Animate grid positions smoothly
function animateGrid() {
  const items = [...gridContainer.children];
  items.forEach(item => {
    item.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
  });
}

// Event listeners
addBtn.addEventListener('click', addItem);
removeBtn.addEventListener('click', removeItem);

// Add initial items
for (let i = 0; i < 6; i++) addItem();
