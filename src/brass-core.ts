import { BehaviorSubject, distinctUntilChanged, scan, map, mergeWith, Observable, ReplaySubject,debounceTime, skip } from 'rxjs'
import { produce, current} from "immer"

export interface Store {
    state: {[key: string]: any},
    action: {[key: string]: any},
}

export interface Streams {
    [key: string]: Observable<any>
}
const currying2 = function (fn: any) {
    return  function() {
        return fn
    }
};
export const createBrass = (initial_state: any, reducers: any, getters: any) => { 			      
    let streams: Streams = {}, actions:any = {}, state$
    Object.keys(reducers).forEach((action: any) =>{
        const subject$ = new ReplaySubject(1) 	
        const streamAction = (args: any) => produce(reducers[action](...args))
        streams[`${action}$`] = subject$.pipe(map(streamAction))	
        actions[action] = (...args: any) => subject$.next(args)
    })
    state$ = new BehaviorSubject(initial_state).pipe(      
        mergeWith(...Object.values(streams)),					          
        scan((state: any, reducer: any) => reducer(state)),
        distinctUntilChanged((pre: any, cur: any) => { 
            return JSON.stringify(pre) === JSON.stringify(cur)}),
    )	

    const getters$ = state$.pipe(
        map((state: any) =>
            Object.assign(
                {},
                ...Object.keys(getters).map(key => {
                    return {[key]: getters[key](state)}
                })
            )
        ),
        distinctUntilChanged((pre: any, cur: any) => JSON.stringify(pre) === JSON.stringify(cur)),
    ) 
    return {state$, actions, getters$} 										               
} 

export const brassLogger = (prefix: string, observable: Observable<any>) => {
    return observable.pipe(
        debounceTime(1000),
        scan((prevState: any, nextState: any) => {
            console.groupCollapsed(`${prefix}`)
        
            console.log(`%c prev state:`, `color: #999999; font-weight: bold`, prevState)
            console.log(`%c next state:`, `color: #4CAF50; font-weight: bold`, nextState)
        
            console.groupEnd()
            return nextState
        })
    ).subscribe()
}