import assert from 'assert/strict';

// 1 classic
const sum = (n: number[]): number => n.reduce((p, c) => p + c, 0)

const avg1 = (n: number[]) => sum(n) / n.length

assert.equal(avg1([1,5,3,0,7]), 3.2)
assert.equal(avg1([]), NaN)

// 2 T | Error

const avg2 = (n: number[]): number | Error =>
    (n.length)
        ? sum(n) / n.length
        : new Error('Unable to calculate avg from empty array')

// imperative

const isError = <T>(value: T | Error): value is Error => value instanceof Error

const avg2result1 = avg2([1,5,3,0,7])
const avg2result2 = avg2([])

if (isError(avg2result1)) {
    assert.equal(avg2result1.message, 'Unable to calculate avg from empty array')
} else {
    assert.equal(avg2result1, 3.2)
}

if (isError(avg2result2)) {
    assert.equal(avg2result2.message, 'Unable to calculate avg from empty array')
} else {
    assert.equal(avg2result2, 3.2)
}

// declarative

const handleError = <T, E, G>(value: T | Error, onError: (error: Error) => E, onValue: (value: T) => G) => value instanceof Error ? onError(value) : onValue(value)

assert.equal(
    handleError(
        avg2([]),
        (error) => error.message,
        (value) => value),
    'Unable to calculate avg from empty array'
) // string | number

assert.equal(
    handleError(
        avg2([1,5,3,0,7]),
        (error) => error.message,
        (value) => value),
    3.2
) // string | number

assert.equal(
    handleError(
        avg2([1,5,3,0,7]),
        (error) => error.message,
        (value) => value.toString()),
    '3.2'
) // string

// 3 Either

interface Left<E> {
    readonly _tag: 'Left'
    readonly left: E
}

interface Right<A> {
    readonly _tag: 'Right'
    readonly right: A
}

type Either<E, A> = Left<E> | Right<A>

const left = <E>(e: E): Left<E> => ({
    _tag: 'Left' as const,
    left: e,
})

const right = <A>(v: A): Right<A> => ({
    _tag: 'Right' as const,
    right: v,
})

const avg3 = (n: number[]): Either<Error, number> =>
    (n.length)
        ? right(sum(n) / n.length)
        : left(new Error('Unable to calculate avg from empty array'))

const eitherFold = <E, A, K, I>(value: Either<E, A>, onLeft: (error: E) => K, onRight: (value: A) => I) =>
    (value._tag === 'Left')
        ? onLeft(value.left)
        : onRight(value.right)

assert.equal(
    eitherFold(
        avg3([]),
        (error) => error.message,
        (value) => value),
    'Unable to calculate avg from empty array'
)

assert.equal(
    eitherFold(
        avg3([1,5,3,0,7]),
        (error) => error.message,
        (value) => value),
    3.2
)
