import {createComparison, defaultRules} from "../lib/compare.js";

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
        // Очистка поля
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.closest('.filter-wrapper');
            const input = parent.querySelector('input[type="text"]');
            
            if (input) {
                input.value = '';
                state[field] = '';
            }
        }

        if (state.seller === '' || state.seller === '—') {
            return [];
        }

        // ПРОСТО используем compare
        return data.filter(row => compare(row, state));
    };
}