// app.js — My Daily Todo

const STORAGE_KEY = 'myDailyTodos';
const THEME_KEY   = 'myDailyTodosTheme';
const CATEGORIES  = ['업무', '개인', '공부'];

// ── 상태 ─────────────────────────────────────────────────────────────────────
let todos         = [];
let currentFilter = '전체';

// ── DOM 참조 ──────────────────────────────────────────────────────────────────
const todoInput       = document.querySelector('.todo-input');
const categorySelect  = document.querySelector('.category-select');
const addBtn          = document.querySelector('.add-btn');
const todoList        = document.querySelector('.todo-list');
const filterTabs      = document.querySelector('.filter-tabs');
const progressBarFill = document.querySelector('.progress-bar-fill');
const progressText    = document.querySelector('.progress-text');
const progressCat     = document.querySelector('.progress-category');
const themeBtn        = document.getElementById('themeBtn');

// ── 다크모드 ──────────────────────────────────────────────────────────────────
function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeBtn.textContent = isDark ? '라이트' : '다크';
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

themeBtn.addEventListener('click', () => {
  applyTheme(!document.body.classList.contains('dark'));
});

// ── localStorage ──────────────────────────────────────────────────────────────
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// ── 진행률 렌더링 ──────────────────────────────────────────────────────────────
function renderProgress() {
  const total = todos.length;
  const done  = todos.filter(t => t.completed).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  progressBarFill.style.width = `${pct}%`;
  progressBarFill.style.backgroundColor =
    pct <= 33 ? '#ef4444' :
    pct <= 66 ? '#f97316' : '#22c55e';

  progressText.textContent = `전체 ${pct}% (${done}/${total})`;

  progressCat.textContent = CATEGORIES.map(cat => {
    const items   = todos.filter(t => t.category === cat);
    const catDone = items.filter(t => t.completed).length;
    return `${cat} ${catDone}/${items.length}`;
  }).join(' · ');
}

// ── 추가 ──────────────────────────────────────────────────────────────────────
function addTodo() {
  const text = todoInput.value.trim();
  if (!text) return;
  if (text.length > 200) {
    shakeInput();
    return;
  }
  todos.push({
    id: Date.now(),
    text,
    category: categorySelect.value,
    completed: false,
    createdAt: new Date().toISOString(),
  });
  todoInput.value = '';
  renderTodos();
}

function shakeInput() {
  todoInput.classList.remove('shake');
  void todoInput.offsetWidth; // reflow — 같은 애니메이션을 재시작하기 위해 필요
  todoInput.classList.add('shake');
  todoInput.addEventListener('animationend', () => {
    todoInput.classList.remove('shake');
  }, { once: true });
}

// ── 완료 토글 ─────────────────────────────────────────────────────────────────
function toggleTodo(id) {
  todos = todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
  renderTodos();
}

// ── 삭제 ──────────────────────────────────────────────────────────────────────
function deleteTodo(id) {
  if (!confirm('이 항목을 삭제하시겠습니까?')) return;
  todos = todos.filter(t => t.id !== id);
  renderTodos();
}

// ── 수정 ──────────────────────────────────────────────────────────────────────
function applyEdit(id, newText, newCategory) {
  const trimmed = newText.trim();
  if (!trimmed) return false;
  todos = todos.map(t => t.id === id
    ? { ...t, text: trimmed, category: newCategory || t.category }
    : t
  );
  renderTodos();
  return true;
}

function startEdit(li, todo) {
  const textEl  = li.querySelector('.todo-text');
  const badgeEl = li.querySelector('.todo-badge');

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'todo-edit-input';
  input.value = todo.text;
  textEl.replaceWith(input);

  // 배지를 카테고리 select로 교체
  const select = document.createElement('select');
  select.className = 'todo-category-select';
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    opt.selected = cat === todo.category;
    select.appendChild(opt);
  });
  badgeEl.replaceWith(select);

  input.focus();
  input.select();

  // saved 플래그: renderTodos() 이후 blur가 재진입하는 것을 방지
  let saved = false;

  const save = () => {
    if (saved) return;
    const ok = applyEdit(todo.id, input.value, select.value);
    if (ok) saved = true;
  };

  const cancel = () => {
    if (saved) return;
    saved = true;
    renderTodos();
  };

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter')  save();
    if (e.key === 'Escape') cancel();
  });

  input.addEventListener('blur', () => {
    if (saved) return;
    if (input.value.trim()) {
      applyEdit(todo.id, input.value, select.value);
    } else {
      cancel();
    }
  });
}

// ── 필터 ──────────────────────────────────────────────────────────────────────
function setFilter(filter) {
  currentFilter = filter;
  filterTabs.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTodos();
}

// ── 렌더링 ────────────────────────────────────────────────────────────────────
function createTodoItem(todo) {
  const li = document.createElement('li');
  li.className = `todo-item${todo.completed ? ' todo-item--completed' : ''}`;
  li.dataset.id = todo.id;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'todo-checkbox';
  checkbox.dataset.action = 'toggle';
  checkbox.checked = todo.completed;

  const badge = document.createElement('span');
  badge.className = `todo-badge badge-${todo.category}`;
  badge.textContent = todo.category;

  const text = document.createElement('span');
  text.className = 'todo-text';
  text.textContent = todo.text;

  const actions = document.createElement('div');
  actions.className = 'todo-actions';

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.dataset.action = 'edit';
  editBtn.textContent = '수정';

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.dataset.action = 'delete';
  deleteBtn.textContent = '삭제';

  actions.append(editBtn, deleteBtn);
  li.append(checkbox, badge, text, actions);
  return li;
}

function renderTodos() {
  // setFilter 경유 호출 시에도 항상 저장·진행률 동기화
  saveTodos();
  renderProgress();

  todoList.innerHTML = '';

  const filtered = currentFilter === '전체'
    ? todos
    : todos.filter(t => t.category === currentFilter);

  if (filtered.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'todo-empty';
    empty.textContent = todos.length === 0
      ? '할 일이 없습니다. 새로 추가해보세요!'
      : '해당 카테고리에 할 일이 없습니다';
    todoList.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  filtered.forEach(todo => fragment.appendChild(createTodoItem(todo)));
  todoList.appendChild(fragment);
}

// ── 이벤트 위임 (목록 영역) ───────────────────────────────────────────────────
todoList.addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;

  const li = btn.closest('.todo-item');
  const id = Number(li.dataset.id);
  const todo = todos.find(t => t.id === id);
  if (!todo) return;

  if (btn.dataset.action === 'toggle') toggleTodo(id);
  if (btn.dataset.action === 'delete') deleteTodo(id);
  if (btn.dataset.action === 'edit')   startEdit(li, todo);
});

// ── 필터 탭 이벤트 ────────────────────────────────────────────────────────────
filterTabs.addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (btn) setFilter(btn.dataset.filter);
});

// ── 입력 이벤트 ───────────────────────────────────────────────────────────────
addBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTodo();
});

// ── 초기화 ────────────────────────────────────────────────────────────────────
applyTheme(localStorage.getItem(THEME_KEY) === 'dark');
todos = loadTodos();
renderTodos();
