import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)
        .forEach((elementName) => {
            elements[elementName].append(
                ...Object.values(indexes[elementName])
                    .map(name => {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        return option;
                    })
            );
        });

    Object.keys(elements).forEach(elementName => {
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Все';
        defaultOption.selected = true;
        elements[elementName].prepend(defaultOption);
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.closest('.filter-wrapper');
            const input = parent.querySelector('input[type="text"]');
            
            if (input) {
                input.value = '';
                state[field] = '';
            }
        }

        // Создаем модифицированное состояние для фильтрации
        const modifiedState = { ...state };
        
        // Для select'ов: заменяем "—" на пустую строку
    if (modifiedState.seller === '—') {
        modifiedState.seller = '';
    }
    if (modifiedState.customer === '—') {
        modifiedState.customer = '';
    }
    
    // Преобразуем totalFrom/totalTo в массив [from, to] для правила arrayAsRange
    if (modifiedState.totalFrom || modifiedState.totalTo) {
        const from = modifiedState.totalFrom ? parseFloat(modifiedState.totalFrom) : null;
        const to = modifiedState.totalTo ? parseFloat(modifiedState.totalTo) : null;
        modifiedState.total = [from, to];
        
        // Удаляем исходные поля, чтобы они не мешали
        delete modifiedState.totalFrom;
        delete modifiedState.totalTo;
    }
    
    // ДЛЯ ОТЛАДКИ - посмотрим что в состоянии
    console.log('=== FILTERING DEBUG ===');
    console.log('Original state:', state);
    console.log('Modified state:', modifiedState);
    console.log('First row to compare:', data[0]);
    console.log('Compare result for first row:', compare(data[0], modifiedState));

    // @todo: #4.5 — отфильтровать данные используя компаратор
    const filtered = data.filter(row => compare(row, modifiedState));
    console.log('Filtered count:', filtered.length, 'of', data.length);
    
    return filtered;
}}