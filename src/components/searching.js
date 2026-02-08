import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    ['skipEmptyTargetValues'], // Используем только skipEmptyTargetValues из стандартных правил
        [
            // Добавляем кастомное правило для поиска по нескольким полям
            rules.searchMultipleFields(
                searchField,          // Ключ в целевом объекте (state.search)
                ['date', 'customer', 'seller'], // Поля, в которых ищем
                false                 // Без учета регистра
            )
        ];

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    }
}