type Peano<N extends number, A extends any[] = []> =
    A['length'] extends N
        ? A
        : Peano<N, [1, ...A]>

type p1 = Peano<5>
type p2 = Peano<5>['length']

type Plus<L extends number, R extends number> =
    [...Peano<L>, ...Peano<R>]['length'] extends infer N
        ? N extends number
            ? N : never
            : never

type p3 = Plus<3, 2>

type Seq<F extends number, T extends number, A extends any[] = []> =
    F extends T
        ? A
        : [F, ...Seq<Plus<F, 1>, T, A>]

type SeqIncluded<F extends number, T extends number, A extends any[] = []> =
    F extends T
        ? [...A, T]
        : [F, ...SeqIncluded<Plus<F, 1>, T, A>]

type SeqDesc<F extends number, T extends number, A extends any[] = []> =
    F extends T
        ? A
        : [...SeqDesc<Plus<F, 1>, T, A>, F]

type s1 = Seq<0, 5>             // 0, 1, 2, 3, 4
type s2 = SeqIncluded<0, 5>     // 0, 1, 2, 3, 4, 5
type s3 = SeqDesc<0, 5>         // 4, 3, 2, 1

type LteRaw = [1, 1, 1] extends [1, 1, 1] ? true : false

type lter = LteRaw

type Lte<L extends number, R extends number> = Peano<L> extends [...Peano<R>, ...infer _] ? true : false

type lte = Lte<1, 6>

type Minus<L extends number, R extends number> =
    Peano<L> extends Peano<R>
        ? 0
        : Peano<L> extends [...Peano<R>, ...infer Rest]
            ? Rest['length']
            : never

type m = Lte<1, Minus<Minus<Minus<5, 1>, 1>, 1>>
type m2 = Lte<1, Minus<Minus<Minus<Minus<5, 1>, 1>, 1>, 1>>

/*
type Fib<N extends number> =
    N extends Lte<1, N>
        ? N
        : Plus<Fib<Minus<N, 1>>, Fib<Minus<N, 2>>>

type f1 = Fib<10>
*/