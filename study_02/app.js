// app.js — 미넌이의 오늘의 할일

const STORAGE_KEY = 'myDailyTodos';
const THEME_KEY   = 'myDailyTodosTheme';
const CATEGORIES  = ['업무', '개인', '공부'];

const CATEGORY_EMOJI = { '업무': '🐻', '개인': '🐰', '공부': '🦔' };

const KEYWORDS = {
  '업무': [
    '회의', '미팅', '보고서', '발표', '기획', '업무', '출장',
    '마감', '프로젝트', '메일', '이메일', '계획서', '제안서',
    '클라이언트', '거래처', '결재', '검토', '피드백', '협의',
  ],
  '개인': [
    '운동', '헬스', '요가', '친구', '가족', '여행', '영화',
    '쇼핑', '청소', '요리', '병원', '약속', '산책', '드라마',
    '게임', '취미', '음악', '카페', '식사', '장보기',
  ],
  '공부': [
    '공부', '강의', '책', '시험', '과제', '숙제', '학습',
    '강좌', '수업', '복습', '예습', '문제', '퀴즈', '코딩',
    '프로그래밍', '알고리즘', '개념', '정리', '독서', '노트',
  ],
};

const QUOTES = [
  '오늘도 반짝반짝 빛나는 하루 돼요 ✨',
  '작은 한 걸음이 큰 변화를 만들어요 🌱',
  '할 수 있어요, 미넌이는 충분해요 🌸',
  '오늘의 나는 어제보다 더 멋져요 🦋',
  '하나씩 해내다 보면 어느새 다 됩니다 🍀',
  '오늘도 수고 많았어요 🌙',
  '작은 것들이 모여 큰 행복이 돼요 🎀',
  '지금 이 순간도 충분히 잘하고 있어요 💕',
  '꾸준함이 최고의 능력이에요 🐾',
  '오늘도 미넌이 화이팅! 🌷',
  '매일매일이 새로운 시작이에요 🐣',
  '할 일을 하나 지울 때마다 뿌듯함을 느껴요 🎉',
  '느려도 괜찮아요, 방향이 맞으면 돼요 🐢',
  '오늘 할 일을 오늘 해요, 내일의 나를 위해 💌',
];

// ── 상태 ─────────────────────────────────────────────────────────────────────
let todos         = [];
let currentFilter = '전체';
let currentSort   = '최신순';

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
const sortSelect      = document.getElementById('sortSelect');
const exportBtn       = document.getElementById('exportBtn');
const importBtn       = document.getElementById('importBtn');
const importFile      = document.getElementById('importFile');
const dailyQuote      = document.getElementById('dailyQuote');

// ── 다크모드 ──────────────────────────────────────────────────────────────────
function applyTheme(isDark) {
  document.body.classList.toggle('dark', isDark);
  themeBtn.textContent = isDark ? '라이트' : '다크';
  localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
}

themeBtn.addEventListener('click', () => {
  applyTheme(!document.body.classList.contains('dark'));
});

// ── 감성 문구 ─────────────────────────────────────────────────────────────────
function renderQuote() {
  dailyQuote.textContent = QUOTES[new Date().getDate() % QUOTES.length];
}

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

// ── 내보내기 / 가져오기 ───────────────────────────────────────────────────────
function exportTodos() {
  const dateStr = new Date().toISOString().slice(0, 10);
  const json    = JSON.stringify(todos, null, 2);
  const blob    = new Blob([json], { type: 'application/json' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href        = url;
  a.download    = `미넌이할일_${dateStr}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importTodos(file) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!Array.isArray(imported)) throw new Error();
      if (!confirm(`${imported.length}개의 할 일을 불러올까요?\n현재 목록은 덮어씌워집니다.`)) return;
      todos = imported;
      renderTodos();
    } catch {
      alert('올바른 파일이 아닙니다. JSON 형식만 가능해요.');
    }
  };
  reader.readAsText(file);
}

exportBtn.addEventListener('click', exportTodos);
importBtn.addEventListener('click', () => importFile.click());
importFile.addEventListener('change', e => {
  if (e.target.files[0]) importTodos(e.target.files[0]);
  e.target.value = ''; // 같은 파일 재선택 가능하도록 초기화
});

// ── 진행률 렌더링 ──────────────────────────────────────────────────────────────
function renderProgress() {
  const total = todos.length;
  const done  = todos.filter(t => t.completed).length;
  const pct   = total === 0 ? 0 : Math.round((done / total) * 100);

  progressBarFill.style.width = `${pct}%`;
  progressBarFill.style.backgroundColor =
    pct <= 33 ? '#f48fb1' :   // 파스텔 핑크
    pct <= 66 ? '#b8a9e8' :   // 파스텔 보라
    '#5ec4a0';                 // 파스텔 민트

  progressText.textContent = `전체 ${pct}% (${done}/${total})`;

  progressCat.textContent = CATEGORIES.map(cat => {
    const items   = todos.filter(t => t.category === cat);
    const catDone = items.filter(t => t.completed).length;
    return `${CATEGORY_EMOJI[cat]} ${catDone}/${items.length}`;
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

  const select = document.createElement('select');
  select.className = 'todo-category-select';
  CATEGORIES.forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = `${CATEGORY_EMOJI[cat]} ${cat}`;
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

  // relatedTarget 확인: 카테고리 select 클릭 시에는 저장하지 않고 유지
  input.addEventListener('blur', e => {
    if (saved) return;
    if (e.relatedTarget === select) return;
    if (input.value.trim()) {
      applyEdit(todo.id, input.value, select.value);
    } else {
      cancel();
    }
  });

  // select에서 포커스가 나갈 때 저장
  select.addEventListener('blur', e => {
    if (saved) return;
    if (e.relatedTarget === input) return;
    if (input.value.trim()) {
      applyEdit(todo.id, input.value, select.value);
    } else {
      cancel();
    }
  });
}

// ── 키워드 기반 자동 카테고리 분류 ───────────────────────────────────────────
function detectCategory(text) {
  const lower = text.toLowerCase();
  let best = null;
  let bestScore = 0;

  for (const [cat, keywords] of Object.entries(KEYWORDS)) {
    const score = keywords.filter(kw => lower.includes(kw)).length;
    if (score > bestScore) {
      bestScore = score;
      best = cat;
    }
  }
  return best;
}

function flashCategorySelect() {
  categorySelect.classList.remove('auto-detected');
  void categorySelect.offsetWidth; // 같은 애니메이션 재시작을 위한 reflow
  categorySelect.classList.add('auto-detected');
  categorySelect.addEventListener('animationend', () => {
    categorySelect.classList.remove('auto-detected');
  }, { once: true });
}

todoInput.addEventListener('input', () => {
  const detected = detectCategory(todoInput.value);
  if (detected && detected !== categorySelect.value) {
    categorySelect.value = detected;
    flashCategorySelect();
  }
});

// ── 필터 ──────────────────────────────────────────────────────────────────────
function setFilter(filter) {
  currentFilter = filter;
  filterTabs.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  renderTodos();
}

// ── 정렬 ──────────────────────────────────────────────────────────────────────
function sortedTodos(list) {
  switch (currentSort) {
    case '오래된순':   return [...list].sort((a, b) => a.id - b.id);
    case '미완료먼저': return [...list].sort((a, b) => a.completed - b.completed);
    case '카테고리순': return [...list].sort((a, b) => a.category.localeCompare(b.category));
    default:           return [...list].sort((a, b) => b.id - a.id); // 최신순
  }
}

sortSelect.addEventListener('change', () => {
  currentSort = sortSelect.value;
  renderTodos();
});

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
  badge.textContent = `${CATEGORY_EMOJI[todo.category]} ${todo.category}`;

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
  // setFilter·sortSelect 경유 호출 시에도 항상 저장·진행률 동기화
  saveTodos();
  renderProgress();

  todoList.innerHTML = '';

  const filtered = currentFilter === '전체'
    ? todos
    : todos.filter(t => t.category === currentFilter);

  const displayed = sortedTodos(filtered);

  if (displayed.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'todo-empty';
    empty.textContent = todos.length === 0
      ? '🌷 할 일이 없어요. 새로 추가해봐요!'
      : '🌸 해당 카테고리에 할 일이 없습니다';
    todoList.appendChild(empty);
    return;
  }

  const fragment = document.createDocumentFragment();
  displayed.forEach(todo => fragment.appendChild(createTodoItem(todo)));
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
renderQuote();
todos = loadTodos();
renderTodos();
