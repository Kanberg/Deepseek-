// Основные функции редактора Python 3.14.0
// script-core.js - базовый функционал

// Элементы DOM
let codeEditor, previewOutput, runBtn, clearBtn, themeBtn, fullscreenBtn;
let refreshBtn, consoleOutput, lineNumbers, notification, statusInfo, exampleBtns;

// Примеры кода для Python 3.14.0
const codeExamples = {
    hello: `# Добро пожаловать в Python 3.14.0!
print("Привет, мир Python 3.14.0!")

# Новые возможности Python 3.14
from typing import TypeVar

# Улучшенный pattern matching
def process_data(data):
    match data:
        case int(x) if x > 0:
            return f"Положительное целое: {x}"
        case list(items) if len(items) > 0:
            return f"Список с {len(items)} элементами"
        case _:
            return "Неизвестный тип данных"

# Проверяем pattern matching
print(process_data(42))
print(process_data([1, 2, 3]))

# Улучшенная производительность
numbers = [i for i in range(1000)]
squares = [x*x for x in numbers]
print(f"Сумма квадратов: {sum(squares)}")`,

    graphics: `# Графика с улучшенной производительностью Python 3.14
print("Рисуем графику с помощью Python 3.14...")

# Имитация графики с помощью HTML
preview_html = """
<div style="text-align: center; padding: 20px;">
    <h3>Графика Python 3.14</h3>
    <p>Улучшенная производительность для графических приложений</p>
    <div style="position: relative; width: 400px; height: 400px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; overflow: hidden;">
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 300px; height: 300px; border: 3px solid rgba(255,255,255,0.5); border-radius: 50%;"></div>
        <div style="position: absolute; top: 20%; left: 20%; width: 80px; height: 80px; background: rgba(255,0,0,0.7); border-radius: 50%; animation: float 3s ease-in-out infinite;"></div>
        <div style="position: absolute; top: 20%; right: 20%; width: 80px; height: 80px; background: rgba(0,255,0,0.7); border-radius: 50%; animation: float 3s ease-in-out infinite 1s;"></div>
        <div style="position: absolute; bottom: 20%; left: 20%; width: 80px; height: 80px; background: rgba(0,0,255,0.7); border-radius: 50%; animation: float 3s ease-in-out infinite 2s;"></div>
        <div style="position: absolute; bottom: 20%; right: 20%; width: 80px; height: 80px; background: rgba(255,255,0,0.7); border-radius: 50%; animation: float 3s ease-in-out infinite 1.5s;"></div>
    </div>
    <style>
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
    </style>
    <p style="margin-top: 20px;">Python 3.14 обеспечивает плавную анимацию!</p>
</div>
"""

print("Графика отображена в предпросмотре!")`,

    game: `# Простая игра с улучшенной производительностью Python 3.14
import random

print("=== ИГРА 'УГАДАЙ ЧИСЛО' ===")
print("Версия Python 3.14.0 - улучшенная производительность!")
print("Компьютер загадал число от 1 до 100")
print("Попробуйте угадать его за минимальное количество попыток!")

# Генерация случайного числа с использованием новых возможностей
secret_number = random.randint(1, 100)
attempts = 0
max_attempts = 7

print(f"У вас есть {max_attempts} попыток!")

# Имитация игры с подсказками
for attempt in range(1, max_attempts + 1):
    # Имитация "умного" выбора числа
    if attempt == 1:
        guess = 50
    elif attempt == 2:
        if secret_number > 50:
            guess = 75
        else:
            guess = 25
    else:
        # "Умный" алгоритм бинарного поиска
        guess = random.randint(1, 100)
    
    print(f"Попытка {attempt}: {guess}")
    
    if guess < secret_number:
        print("   Слишком маленькое число! Попробуйте еще.")
    elif guess > secret_number:
        print("   Слишком большое число! Попробуйте еще.")
    else:
        print(f"🎉 Поздравляем! Вы угадали число {secret_number} за {attempt} попыток!")
        break
else:
    print(f"💔 К сожалению, вы не угадали. Загаданное число было: {secret_number}")

print("Спасибо за игру!")`
};

// Инициализация DOM элементов
function initializeDOMElements() {
    codeEditor = document.getElementById('code-editor');
    previewOutput = document.getElementById('preview-output');
    runBtn = document.getElementById('run-btn');
    clearBtn = document.getElementById('clear-btn');
    themeBtn = document.getElementById('theme-btn');
    fullscreenBtn = document.getElementById('fullscreen-btn');
    refreshBtn = document.getElementById('refresh-btn');
    consoleOutput = document.getElementById('console-output');
    lineNumbers = document.getElementById('line-numbers');
    notification = document.getElementById('notification');
    statusInfo = document.getElementById('status-info');
    exampleBtns = document.querySelectorAll('.example-btn');
}

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
function setupLineNumbersScroll() {
    codeEditor.addEventListener('scroll', () => {
        lineNumbers.scrollTop = codeEditor.scrollTop;
    });
}

// Обработка табуляции в редакторе
function setupTabHandler() {
    codeEditor.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = codeEditor.selectionStart;
            const end = codeEditor.selectionEnd;
            
            // Вставляем 4 пробела вместо табуляции
            codeEditor.value = codeEditor.value.substring(0, start) + 
                '    ' + codeEditor.value.substring(end);
            codeEditor.selectionStart = codeEditor.selectionEnd = start + 4;
        }
        
        // Автозапуск при нажатии Ctrl+Enter
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            runCode();
        }
    });
}

// Обработка print statements
function processPrintStatement(line) {
    let output = '';
    let previewContent = '';
    
    // Обычные строки
    const stringMatch = line.match(/print\(["']([^"']*)["']\)/);
    if (stringMatch) {
        const text = stringMatch[1];
        output += text + '\n';
        previewContent += text + '<br>';
    }
    
    // f-strings
    const fstringMatch = line.match(/print\(f["']([^"']*)["']\)/);
    if (fstringMatch) {
        const text = fstringMatch[1];
        output += text + '\n';
        previewContent += text + '<br>';
    }
    
    // Переменные в print
    const varMatch = line.match(/print\(([^)]+)\)/);
    if (varMatch && !varMatch[1].includes('"') && !varMatch[1].includes("'")) {
        try {
            const result = eval(varMatch[1].replace(/f['"]/g, ''));
            output += String(result) + '\n';
            previewContent += String(result) + '<br>';
        } catch (e) {
            // Игнорируем ошибки вычисления
        }
    }
    
    return { output, previewContent };
}

// Обработка переменных
function processVariable(line) {
    let previewContent = '';
    const varMatch = line.match(/(\w+)\s*=\s*(.+)/);
    
    if (varMatch) {
        const varName = varMatch[1];
        let value = varMatch[2].trim();
        
        // Убираем комментарии
        value = value.split('#')[0].trim();
        
        if (value && !value.includes('"') && !value.includes("'") && !value.includes('[')) {
            try {
                const calculated = eval(value);
                previewContent += `<strong>${varName}</strong> = ${calculated}<br>`;
            } catch (e) {
                previewContent += `<strong>${varName}</strong> = ${value}<br>`;
            }
        }
    }
    
    return previewContent;
}

// Обработка HTML блока
function processHTMLBlock(line, inHtmlBlock, htmlContent) {
    if (line.includes('preview_html = """')) {
        inHtmlBlock = true;
        return { inHtmlBlock, htmlContent, continueProcessing: true };
    }
    
    if (inHtmlBlock) {
        if (line.includes('"""')) {
            inHtmlBlock = false;
            return { inHtmlBlock, htmlContent, continueProcessing: true };
        }
        htmlContent += line + '\n';
        return { inHtmlBlock, htmlContent, continueProcessing: true };
    }
    
    return { inHtmlBlock, htmlContent, continueProcessing: false };
}

// Запуск кода Python
function runCode() {
    const code = codeEditor.value;
    consoleOutput.innerHTML = '';
    statusInfo.textContent = "Выполнение Python 3.14.0...";
    
    try {
        // Очищаем предпросмотр
        previewOutput.innerHTML = '<h3>Результат выполнения кода Python 3.14.0:</h3>';
        
        let output = '';
        let previewContent = '';
        
        // Имитация выполнения Python кода с поддержкой Python 3.14
        const lines = code.split('\n');
        let inHtmlBlock = false;
        let htmlContent = '';
        
        for (const line of lines) {
            // Обработка HTML блока
            const htmlResult = processHTMLBlock(line, inHtmlBlock, htmlContent);
            inHtmlBlock = htmlResult.inHtmlBlock;
            htmlContent = htmlResult.htmlContent;
            if (htmlResult.continueProcessing) continue;
            
            // Обработка print statements
            if (line.includes('print(') && !line.startsWith('#')) {
                const printResult = processPrintStatement(line);
                output += printResult.output;
                previewContent += printResult.previewContent;
            }
            
            // Обработка переменных
            if (line.includes('=') && !line.startsWith('#') && 
                !line.includes('print') && !line.includes('import')) {
                previewContent += processVariable(line);
            }
            
            // Обработка pattern matching (новое в Python 3.14)
            if (line.includes('match ') || line.includes('case ')) {
                output += `[Python 3.14] ${line}\n`;
            }
        }
        
        displayResults(htmlContent, previewContent, code);
        
    } catch (error) {
        handleExecutionError(error);
    }
}

// Отображение результатов выполнения
function displayResults(htmlContent, previewContent, code) {
    // Если есть HTML контент, используем его
    if (htmlContent) {
        previewOutput.innerHTML = htmlContent;
    } else if (previewContent) {
        // Иначе показываем текстовый вывод
        previewOutput.innerHTML += `
            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; 
                       margin-top: 10px; font-family: monospace; line-height: 1.5;">
                ${previewContent}
            </div>
        `;
    }
    
    // Добавляем информацию о Python 3.14
    if (code.includes('match ') || code.includes('case ')) {
        previewOutput.innerHTML += `
            <div style="margin-top: 20px; padding: 10px; background: #e8f4fd; 
                       border-radius: 5px; border-left: 4px solid #2575fc;">
                <strong>Python 3.14 Feature:</strong> Использован улучшенный Pattern Matching
            </div>
        `;
    }
    
    consoleOutput.innerHTML = previewContent.replace(/<br>/g, '\n');
    statusInfo.textContent = "Python 3.14.0 | Выполнено успешно";
    showNotification("Код Python 3.14 выполнен успешно!");
}

// Обработка ошибок выполнения
function handleExecutionError(error) {
    consoleOutput.innerHTML += `
        <div class="console-error">
            Ошибка выполнения: ${error.message}
        </div>
    `;
    statusInfo.textContent = "Python 3.14.0 | Ошибка выполнения";
    showNotification("Произошла ошибка выполнения!", true);
}

// Очистка редактора и вывода
function clearAll() {
    if (confirm("Очистить редактор и вывод?")) {
        codeEditor.value = '';
        consoleOutput.innerHTML = '';
        previewOutput.innerHTML = `
            <h3>Область предпросмотра Python 3.14.0</h3>
            <p>Запустите код Python, чтобы увидеть результат здесь.</p>
            <div class="python-version-info">
                <h4>Новое в Python 3.14.0:</h4>
                <ul>
                    <li>Улучшенный pattern matching</li>
                    <li>Оптимизированная производительность</li>
                    <li>Новые методы для строк и коллекций</li>
                    <li>Улучшенная поддержка асинхронности</li>
                </ul>
            </div>
        `;
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
        localStorage.setItem('theme', 'light');
    } else {
        body.classList.remove('light-theme');
        themeBtn.textContent = '☀️ Светлая тема';
        localStorage.setItem('theme', 'dark');
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
    previewOutput.innerHTML = `
        <h3>Область предпросмотра Python 3.14.0</h3>
        <p>Запустите код Python, чтобы увидеть результат здесь.</p>
        <div class="python-version-info">
            <h4>Новое в Python 3.14.0:</h4>
            <ul>
                <li>Улучшенный pattern matching</li>
                <li>Оптимизированная производительность</li>
                <li>Новые методы для строк и коллекций</li>
                <li>Улучшенная поддержка асинхронности</li>
            </ul>
        </div>
    `;
    showNotification("Предпросмотр обновлен");
}

// Загрузка примера кода
function loadExample(exampleKey) {
    if (codeExamples[exampleKey]) {
        codeEditor.value = codeExamples[exampleKey];
        updateLineNumbers();
        showNotification(`Загружен пример Python 3.14: ${exampleKey}`);
        runCode();
    }
}

// Сохранение кода в localStorage
function saveCode() {
    localStorage.setItem('pythonCode', codeEditor.value);
}

// Загрузка кода из localStorage
function loadCode() {
    const savedCode = localStorage.getItem('pythonCode');
    if (savedCode) {
        codeEditor.value = savedCode;
        updateLineNumbers();
    }
}

// Загрузка темы из localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        themeBtn.textContent = '🌙 Тёмная тема';
    }
}

// Настройка обработчиков событий
function setupEventHandlers() {
    codeEditor.addEventListener('input', () => {
        updateLineNumbers();
        saveCode();
    });
    
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
}

// Инициализация редактора
function initializeEditor() {
    initializeDOMElements();
    updateLineNumbers();
    
    // Настройка обработчиков
    setupLineNumbersScroll();
    setupTabHandler();
    setupEventHandlers();
    
    // Загружаем сохраненные данные
    loadCode();
    loadTheme();
    
    // Автосохранение каждые 30 секунд
    setInterval(saveCode, 30000);
    
    // Запускаем начальный код
    setTimeout(runCode, 1000);
}

// Запуск инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', initializeEditor);
