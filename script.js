// Элементы DOM
const codeEditor = document.getElementById('code-editor');
const previewOutput = document.getElementById('preview-output');
const runBtn = document.getElementById('run-btn');
const clearBtn = document.getElementById('clear-btn');
const themeBtn = document.getElementById('theme-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const refreshBtn = document.getElementById('refresh-btn');
const consoleOutput = document.getElementById('console-output');
const lineNumbers = document.getElementById('line-numbers');
const notification = document.getElementById('notification');
const statusInfo = document.getElementById('status-info');
const exampleBtns = document.querySelectorAll('.example-btn');

// Примеры кода
const codeExamples = {
    hello: `# Простой пример Hello World
print("Привет, мир!")

# Работа с переменными
name = "Пользователь"
age = 25
print(f"Меня зовут {name} и мне {age} лет")

# Список и цикл
fruits = ["яблоко", "банан", "апельсин"]
for fruit in fruits:
    print(f"Фрукт: {fruit}")
    
# Функция
def greet(name):
    return f"Привет, {name}!"

print(greet("Анна"))`,

    graphics: `# Графика с Turtle
print("Рисуем разноцветные круги...")

# Имитация графики с помощью HTML
preview_html = """
<div style="text-align: center;">
    <h3>Графика Turtle</h3>
    <div style="position: relative; width: 400px; height: 400px; margin: 0 auto; background: lightgreen; border-radius: 10px;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; border: 2px solid blue; border-radius: 50%;"></div>
        <div style="position: absolute; top: 20%; left: 20%; width: 100px; height: 100px; background: red; border-radius: 50%;"></div>
        <div style="position: absolute; top: 20%; right: 20%; width: 100px; height: 100px; background: purple; border-radius: 50%;"></div>
        <div style="position: absolute; bottom: 20%; left: 20%; width: 100px; height: 100px; background: orange; border-radius: 50%;"></div>
        <div style="position: absolute; bottom: 20%; right: 20%; width: 100px; height: 100px; background: yellow; border-radius: 50%;"></div>
    </div>
    <p>Красивые круги на Python!</p>
</div>
"""

print("Графика отображена в предпросмотре!")`,

    game: `# Простая игра "Угадай число"
import random

print("=== ИГРА 'УГАДАЙ ЧИСЛО' ===")
print("Компьютер загадал число от 1 до 100")
print("Попробуйте угадать его за минимальное количество попыток!")

# Генерация случайного числа
secret_number = random.randint(1, 100)
attempts = 0

# Имитация ввода пользователя (для демонстрации)
guesses = [42, 75, 63, 58, 61]

for guess in guesses:
    attempts += 1
    print(f"Попытка {attempts}: {guess}")
    
    if guess < secret_number:
        print("Слишком маленькое число! Попробуйте еще.")
    elif guess > secret_number:
        print("Слишком большое число! Попробуйте еще.")
    else:
        print(f"Поздравляем! Вы угадали число {secret_number} за {attempts} попыток!")
        break

print("Спасибо за игру!")`,

    math: `# Математические вычисления
import math

print("=== МАТЕМАТИЧЕСКИЕ ВЫЧИСЛЕНИЯ ===\\n")

# Основные операции
a = 15
b = 7
print(f"{a} + {b} = {a + b}")
print(f"{a} - {b} = {a - b}")
print(f"{a} * {b} = {a * b}")
print(f"{a} / {b} = {a / b:.2f}")
print(f"{a} // {b} = {a // b} (целочисленное деление)")
print(f"{a} % {b} = {a % b} (остаток от деления)\\n")

# Степени и корни
print(f"{a} в квадрате = {a**2}")
print(f"Квадратный корень из {a} = {math.sqrt(a):.2f}")
print(f"{2} в степени {10} = {2**10}\\n")

# Тригонометрия
angle = 45
radians = math.radians(angle)
print(f"Синус {angle}° = {math.sin(radians):.2f}")
print(f"Косинус {angle}° = {math.cos(radians):.2f}")
print(f"Тангенс {angle}° = {math.tan(radians):.2f}\\n")

# Константы
print(f"Число π = {math.pi:.5f}")
print(f"Число e = {math.e:.5f}")`,

    animation: `# Анимация с имитацией
print("Запуск анимации...")

frames = [
    "🌕",
    "🌖", 
    "🌗",
    "🌘",
    "🌑",
    "🌒",
    "🌓",
    "🌔"
]

for i in range(3):
    for frame in frames:
        print(f"\\rАнимация: {frame} ", end="", flush=True)
        # Имитация задержки
        import time
        time.sleep(0.1)

print("\\nАнимация завершена!")`
};

// Показ уведомления
function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.className = isError ? "notification error" : "notification";
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

// Обновление нумерации строк
function updateLineNumbers() {
    const lines = codeEditor.value.split('\n').length;
    let numbers = '';
    for (let i = 1; i <= lines; i++) {
        numbers += i + '\n';
    }
    lineNumbers.textContent = numbers;
}

// Прокрутка нумерации строк вместе с редактором
codeEditor.addEventListener('scroll', () => {
    lineNumbers.scrollTop = codeEditor.scrollTop;
});

// Обработка табуляции в редакторе
codeEditor.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = codeEditor.selectionStart;
        const end = codeEditor.selectionEnd;
        
        // Вставляем 4 пробела вместо табуляции
        codeEditor.value = codeEditor.value.substring(0, start) + '    ' + codeEditor.value.substring(end);
        codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
    }
    
    // Автозапуск при нажатии Ctrl+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        runCode();
    }
});

// Запуск кода Python
function runCode() {
    const code = codeEditor.value;
    consoleOutput.innerHTML = '';
    statusInfo.textContent = "Выполнение...";
    
    try {
        // Очищаем предпросмотр
        previewOutput.innerHTML = '<h3>Результат выполнения кода:</h3>';
        
        // Имитация выполнения Python кода
        let output = '';
        const originalLog = console.log;
        console.log = function(...args) {
            output += args.join(' ') + '\n';
            originalLog.apply(console, args);
        };
        
        // Выполняем код (в реальной реализации здесь будет Pyodide)
        if (code.includes('preview_html')) {
            // Если код содержит HTML для предпросмотра
            const htmlMatch = code.match(/preview_html = """([\s\S]*?)"""/);
            if (htmlMatch) {
                previewOutput.innerHTML = htmlMatch[1];
            }
        }
        
        // Имитируем выполнение Python кода
        const lines = code.split('\n');
        for (const line of lines) {
            if (line.includes('print(') && !line.startsWith('#')) {
                const match = line.match(/print\(["'](.*)["']\)/);
                if (match) {
                    output += match[1] + '\n';
                }
            }
        }
        
        consoleOutput.textContent = output;
        statusInfo.textContent = "Python 3.9 | Выполнено";
        showNotification("Код выполнен успешно!");
        
        // Восстанавливаем console.log
        console.log = originalLog;
        
    } catch (error) {
        consoleOutput.innerHTML += `<div class="console-error">Ошибка: ${error.message}</div>`;
        statusInfo.textContent = "Python 3.9 | Ошибка";
        showNotification("Произошла ошибка выполнения!", true);
    }
}

// Очистка редактора и вывода
function clearAll() {
    if (confirm("Очистить редактор и вывод?")) {
        codeEditor.value = '';
        consoleOutput.innerHTML = '';
        previewOutput.innerHTML = '<h3>Область предпросмотра</h3><p>Запустите код Python, чтобы увидеть результат здесь.</p>';
        updateLineNumbers();
        showNotification("Редактор и вывод очищены");
    }
}

// Переключение темы
function toggleTheme() {
    const body = document.body;
    const isDark = !body.classList.contains('light-theme');
    
    if (isDark) {
        body.classList.add('light-theme');
        themeBtn.textContent = '🌙 Тёмная тема';
    } else {
        body.classList.remove('light-theme');
        themeBtn.textContent = '☀️ Светлая тема';
    }
}

// Полноэкранный режим для предпросмотра
function toggleFullscreen() {
    const previewContainer = document.querySelector('.preview-container');
    
    if (!document.fullscreenElement) {
        if (previewContainer.requestFullscreen) {
            previewContainer.requestFullscreen();
        } else if (previewContainer.webkitRequestFullscreen) {
            previewContainer.webkitRequestFullscreen();
        } else if (previewContainer.msRequestFullscreen) {
            previewContainer.msRequestFullscreen();
        }
        fullscreenBtn.textContent = '📺 Выйти из полного экрана';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        fullscreenBtn.textContent = '📺 Полный экран';
    }
}

// Обновление предпросмотра
function refreshPreview() {
    previewOutput.innerHTML = '<h3>Область предпросмотра</h3><p>Запустите код Python, чтобы увидеть результат здесь.</p>';
    showNotification("Предпросмотр обновлен");
}

// Загрузка примера кода
function loadExample(exampleKey) {
    if (codeExamples[exampleKey]) {
        codeEditor.value = codeExamples[exampleKey];
        updateLineNumbers();
        showNotification(`Загружен пример: ${exampleKey}`);
        runCode();
    }
}

// Инициализация редактора
function initializeEditor() {
    updateLineNumbers();
    
    // Обработчики событий
    codeEditor.addEventListener('input', updateLineNumbers);
    
    runBtn.addEventListener('click', runCode);
    clearBtn.addEventListener('click', clearAll);
    themeBtn.addEventListener('click', toggleTheme);
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    refreshBtn.addEventListener('click', refreshPreview);
    
    // Обработчики для примеров кода
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const example = btn.getAttribute('data-example');
            loadExample(example);
        });
    });
    
    // Запускаем начальный код
    setTimeout(runCode, 1000);
}

// Запуск инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeEditor);
