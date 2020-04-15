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
    includes,
    any,
    omit,
    invert,
    propOr,
    not,
    all,
    uniq,
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
export const validateFieldN4 = obj => {
    const isCircleColorEqualsBlue = compose(equalsBlue, getCircleColor);
    const isStarColorEqualsRed = compose(equalsRed, getStarColor);
    const isSquareColorEqualsOrange = compose(equalsOrange, getSquareColor);

    const f = allPass([isCircleColorEqualsBlue, isStarColorEqualsRed, isSquareColorEqualsOrange]);
    return f(obj);
};

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = obj => {
    const countByIdentity = countBy(identity);
    const omitWhite = partial(omit, [[COLORS.WHITE]]);
    const greaterOrEqualThan3 = partialRight(gte, [3]);
    const isAnyItemGreaterOrEqualThan3 = any(greaterOrEqualThan3);

    const f = compose(isAnyItemGreaterOrEqualThan3, values, omitWhite, countByIdentity, values);
    return f(obj);
};

// 6. Две зеленые фигуры (одна из них треугольник), еще одна любая красная.
export const validateFieldN6 = obj => {
    const getGreenShapes = propOr([], COLORS.GREEN);
    const getRedShapes = propOr([], COLORS.RED);
    const includesTriangle = partial(includes, [SHAPES.TRIANGLE]);

    const isTriangleColorEqualsGreen = compose(includesTriangle, getGreenShapes);
    const lengthOfGreenShapesEquals2 = compose(equals(2), length, getGreenShapes);
    const lengthOfRedShapesEquals1 = compose(equals(1), length, getRedShapes);

    const f = compose(
        allPass([isTriangleColorEqualsGreen, lengthOfGreenShapesEquals2, lengthOfRedShapesEquals1]),
        invert
    );
    return f(obj);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = obj => {
    const getOrangeShapes = propOr([], COLORS.ORANGE);

    const f = compose(equals(4), length, getOrangeShapes, invert);
    return f(obj);
};

// 8. Не красная и не белая звезда.
export const validateFieldN8 = obj => {
    const notRed = compose(not, equals(COLORS.RED));
    const notWhite = compose(not, equals(COLORS.WHITE));

    const f = compose(allPass([notRed, notWhite]), prop(SHAPES.STAR));
    return f(obj);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = obj => {
    const getGreenShapes = propOr([], COLORS.GREEN);

    const f = compose(equals(4), length, getGreenShapes, invert);
    return f(obj);
};

// 10. Треугольник и квадрат одного цвета (не белого)
export const validateFieldN10 = obj => {
    const pickTriangleAndSquare = pick([SHAPES.TRIANGLE, SHAPES.SQUARE]);
    const allNotWhite = all(compose(not, equals(COLORS.WHITE)));
    const allEqual = compose(equals(1), length, uniq);

    const f = compose(allPass([allEqual, allNotWhite]), values, pickTriangleAndSquare);
    return f(obj);
};
