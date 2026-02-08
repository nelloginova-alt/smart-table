import {createComparison, defaultRules} from "../lib/compare.js";

// Используем стандартные правила
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // Заполнение select'ов (оставляем как есть)
    Object.keys(indexes).forEach((elementName) => {
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
        // Обработка очистки поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.closest('.filter-wrapper');
            const input = parent.querySelector('input[type="text"]');
            
            if (input) {
                input.value = '';
                state[field] = '';
            }
        }

        // Создаем копию состояния для модификации
        const filterState = { ...state };
        
        // КРИТИЧЕСКОЕ ИСПРАВЛЕНИЕ:
        // Если seller пустой ("" или "—") - фильтруем строки с пустым seller
        if (filterState.seller === '' || filterState.seller === '—' || !filterState.seller) {
            // УДАЛЯЕМ поле seller из состояния, чтобы compare его игнорировал
            delete filterState.seller;
            // ВРУЧНУЮ фильтруем только строки с пустым продавцом
            return data.filter(row => {
                const rowSeller = row.seller;
                return !rowSeller || rowSeller === '' || rowSeller === '—';
            });
        }
        
        // Преобразование totalFrom/totalTo в массив для arrayAsRange
        if (filterState.totalFrom || filterState.totalTo) {
            const from = filterState.totalFrom ? parseFloat(filterState.totalFrom) : null;
            const to = filterState.totalTo ? parseFloat(filterState.totalTo) : null;
            filterState.total = [from, to];
            
            delete filterState.totalFrom;
            delete filterState.totalTo;
        }
        
        // Используем компаратор для всех остальных случаев
        return data.filter(row => compare(row, filterState));
    };
}