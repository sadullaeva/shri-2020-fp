/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import {
    allPass,
    andThen,
    compose,
    F,
    gt,
    ifElse,
    length,
    lt,
    modulo,
    not,
    partial,
    partialRight,
    pipe,
    prop,
    tap,
    test,
    tryCatch,
    values,
} from 'ramda';

const api = new Api();

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    const checks = {
        isStrLengthLessThan10: compose(gt(10), length),
        isStrLengthGreaterThan2: compose(lt(2), length),
        isNumberPositive: compose(not, test(/^-/)),
        isNumber: test(/^\d*([.,]\d+)?$/),
    };
    const validate = compose(allPass, values)(checks);
    const pow2 = partialRight(Math.pow, [2]);
    const mod3 = partialRight(modulo, [3]);

    const convert10to2 = async number =>
        await api.get('https://api.tech/numbers/base', { from: 10, to: 2, number });
    const getAnimal = async id => await api.get(`https://animals.tech/${id}`, {});

    tryCatch(
        pipe(
            tap(writeLog),
            ifElse(
                validate,
                pipe(
                    parseFloat,
                    Math.round,
                    tap(writeLog),
                    convert10to2,
                    andThen(prop('result')),
                    andThen(tap(writeLog)),
                    andThen(length),
                    andThen(tap(writeLog)),
                    andThen(pow2),
                    andThen(tap(writeLog)),
                    andThen(mod3),
                    andThen(getAnimal),
                    andThen(prop('result')),
                    andThen(tap(handleSuccess))
                ),
                partial(handleError, ['ValidationError'])
            )
        ),
        F
    )(value);
};

export default processSequence;
