import {
    prop,
    equals,
    compose,
    allPass,
    filter,
    gte,
    values,
    length,
    partial,
    partialRight,
    countBy,
    identity,
    pick,
} from 'ramda';

import { COLORS, SHAPES } from '../constants';

/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

const equalsRed = equals(COLORS.RED);
const equalsGreen = equals(COLORS.GREEN);
const equalsOrange = equals(COLORS.ORANGE);
const equalsBlue = equals(COLORS.BLUE);
const equalsWhite = equals(COLORS.WHITE);

const getStarColor = prop(SHAPES.STAR);
const getSquareColor = prop(SHAPES.SQUARE);
const getTriangleColor = prop(SHAPES.TRIANGLE);
const getCircleColor = prop(SHAPES.CIRCLE);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = obj => {
    const isStarColorEqualsRed = compose(equalsRed, getStarColor);
    const isSquareColorEqualsGreen = compose(equalsGreen, getSquareColor);
    const isTriangleColorEqualsWhite = compose(equalsWhite, getTriangleColor);
    const isCircleColorEqualsWhite = compose(equalsWhite, getCircleColor);

    const f = allPass([
        isStarColorEqualsRed,
        isSquareColorEqualsGreen,
        isTriangleColorEqualsWhite,
        isCircleColorEqualsWhite,
    ]);
    return f(obj);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = obj => {
    const getGreenShapesObj = partial(filter, [equalsGreen]);
    const greaterOrEqualThan2 = partialRight(gte, [2]);

    const f = compose(greaterOrEqualThan2, length, values, getGreenShapesObj);
    return f(obj);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = obj => {
    const countByIdentity = countBy(identity);
    const isEqualNumberOfRedAndBlue = obj => equals(obj[COLORS.RED], obj[COLORS.BLUE]);

    const f = compose(
        isEqualNumberOfRedAndBlue,
        pick([COLORS.RED, COLORS.BLUE]),
        countByIdentity,
        values
    );
    return f(obj);
};

// 4. Синий круг, красная звезда, оранжевый квадрат
export const validateFieldN4 = () => false;

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = () => false;

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = () => false;

// 7. Все фигуры оранжевые.
export const validateFieldN7 = () => false;

// 8. Не красная и не белая звезда.
export const validateFieldN8 = () => false;

// 9. Все фигуры зеленые.
export const validateFieldN9 = () => false;

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = () => false;
