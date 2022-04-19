import { BehaviorSubject, distinctUntilChanged, scan, map, mergeWith, Observable, ReplaySubject,debounceTime, combineLatest, shareReplay } from 'rxjs'
import { produce, current} from "immer"

export interface Store {
    state: {[key: string]: any},
    action: {[key: string]: any},
}

export interface Streams {
    [key: string]: Observable<any>
}
export interface DraftFn {
  (draft: any): any
}

// const currying2 = function (fn: any) {
//     return  function() {
//         return fn
//     }
// };
export const createBrass = (initial_state: any, reducers: any, getters: any) => { 			      
    let streams: Streams = {}, actions:any = {}, state$
    // 处理 setState 方法
    const initSetState = () => {
      const subject$ = new ReplaySubject(1) 
      const streamAction: any = (args:[DraftFn]) => {
        return produce(args[0])
      }
      streams['setState$'] = subject$.pipe(map(streamAction))
      return (...args: any) => subject$.next(args)
    }
    const setState = initSetState()
    // 处理 reducers
    Object.keys(reducers).forEach((action: any) =>{
        const subject$ = new ReplaySubject(1) 	
        const streamAction = (args: any) => produce(reducers[action](...args))
        actions[action] = (...args: any) => subject$.next(args)
        streams[`${action}$`] = subject$.pipe(map(streamAction))
    })
    state$ = new BehaviorSubject(initial_state).pipe(      
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
    return {state$, actions, getters$, setState, brassData$} 										               
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