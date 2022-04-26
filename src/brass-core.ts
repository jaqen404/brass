import { BehaviorSubject, distinctUntilChanged, scan, map, mergeWith, Observable, ReplaySubject,debounceTime, combineLatest, shareReplay } from 'rxjs'
import { produce, current} from "immer"
import {Store, Streams, DraftFn, Stores} from "./brass"

// const currying2 = function (fn: any) {
//     return  function() {
//         return fn
//     }
// };
export const stores: Stores = {}
export const createStore = (name: string, initialState: any, getters: any, reducers: any, actionReducers: any ): Store => { 			      
    const streams: Streams = {}, mutations:any = {}
    // 处理 setState 方法
    const initSetState = () => {
      const subject$ = new ReplaySubject(1) 
      const streamAction: any = (args:[DraftFn]) => produce(args[0])
      streams['setState$'] = subject$.pipe(map(streamAction))
      return (...args: any) => subject$.next(args)
    }
    const setState = initSetState()
    // 处理 mutations
    Object.keys(reducers).forEach((reducer: any) =>{
        const subject$ = new ReplaySubject(1) 	
        const streamAction = (args: any) => produce(reducers[reducer](...args))
        mutations[reducer] = (...args: any) => subject$.next(args)
        streams[`${reducer}$`] = subject$.pipe(map(streamAction))
    })
    const state$ = new BehaviorSubject(initialState).pipe(      
        mergeWith(...Object.values(streams)),					          
        scan((state, reducer) => reducer(state)),
        distinctUntilChanged((pre, cur) => { 
            return JSON.stringify(pre) === JSON.stringify(cur)}),
        // share({replay:1})
        shareReplay(1)
    )	
    // 处理 getters
    const getters$ = state$.pipe(
        map((state) =>
            Object.assign(
                {},
                ...Object.keys(getters).map(key => {
                    return {[key]: getters[key](state)}
                })
            )
        ),
        distinctUntilChanged((pre, cur) => JSON.stringify(pre) === JSON.stringify(cur)),
    )
    const brassData$ = combineLatest({state: state$, getters: getters$})
    // 处理 actions
    const actions: any = {}
    Object.keys(actionReducers).forEach((key: any) => {
      actions[key] = (...args: any) => actionReducers[key](...args)(mutations)
    })
    const store: Store = {name, state$, mutations, getters$, setState, brassData$, initialState, actions} 	
    stores[name] = store
    return store								               
} 

export const brassLogger = (prefix: string, observable: Observable<any>) => {
    return observable.pipe(
        debounceTime(1000),
        scan((prevState, nextState) => {
            console.groupCollapsed(`${prefix}`)
        
            console.log(`%c prev state:`, `color: #999999; font-weight: bold`, prevState)
            console.log(`%c next state:`, `color: #4CAF50; font-weight: bold`, nextState)
        
            console.groupEnd()
            return nextState
        })
    ).subscribe()
}