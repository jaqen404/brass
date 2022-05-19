import {
  BehaviorSubject,
  distinctUntilChanged,
  scan,
  map,
  mergeWith,
  Observable,
  ReplaySubject,
  debounceTime,
  combineLatest,
  shareReplay,
} from "rxjs"
import { produce, current } from "immer"
import { Store, Streams, DraftFn, Stores } from "./brass"
// import * as R from "ramda"
// import partial from "ramda/src/partial"
import { partial, pipe, compose, add } from "ramda"

export const stores: Stores = {}
export const createStore = (
  name: string,
  initialState: any,
  initialGetters: any,
  reducers: any,
  actionReducers: any
): Store => {
  const streams: Streams = {},
    mutations: any = {}
  // 处理 setState 方法
  const initSetState = () => {
    const subject$ = new ReplaySubject(1)
    const streamAction: any = (args: [DraftFn]) => produce(args[0])
    streams["setState$"] = subject$.pipe(map(streamAction))
    return (...args: any) => subject$.next(args)
  }
  const setState = initSetState()
  // 处理 mutations
  Object.keys(reducers).forEach((key: any) => {
    const subject$ = new ReplaySubject(1)
    const streamAction = (args: any) => produce(partial(reducers[key], args))
    mutations[key] = (...args: any) => subject$.next(args)
    streams[`${key}$`] = subject$.pipe(map(streamAction))
  })
  const state$ = new BehaviorSubject(initialState).pipe(
    mergeWith(...Object.values(streams)),
    scan((state, reducer) => reducer(state)),
    distinctUntilChanged((pre, cur) => {
      return JSON.stringify(pre) === JSON.stringify(cur)
    }),
    // share({replay:1})
    shareReplay(1)
  )
  // 处理 getters
  const getters$ = state$.pipe(
    map((state) =>
      Object.assign(
        {},
        ...Object.keys(initialGetters).map((key) => {
          return { [key]: initialGetters[key](state) }
        })
      )
    ),
    distinctUntilChanged(
      (pre, cur) => JSON.stringify(pre) === JSON.stringify(cur)
    )
  )
  const brassData$ = combineLatest({ state: state$, getters: getters$ })

  let state: any = initialState
  let getters: any = {}
  brassData$.subscribe((data: any) => {
    state = data.state
    getters = data.getters
  })
  const actions: any = {}
  const store: Store = {
    name,
    state$,
    mutations,
    getters$,
    setState,
    brassData$,
    initialState,
    actions,
    state,
    getters,
  }
  // 处理 actions
  Object.keys(actionReducers).forEach((key: any) => {
    actions[key] = (...args: any) =>
      partial(actionReducers[key], args)({ ...store })
  })
  stores[name] = store
  return store
}

export const brassLogger = (prefix: string, observable: Observable<any>) => {
  return observable
    .pipe(
      debounceTime(1000),
      scan((prevState, nextState) => {
        console.groupCollapsed(`${prefix}`)

        console.log(
          "%c prev state:",
          "color: #999999; font-weight: bold",
          prevState
        )
        console.log(
          "%c next state:",
          "color: #4CAF50; font-weight: bold",
          nextState
        )

        console.groupEnd()
        return nextState
      })
    )
    .subscribe()
}
