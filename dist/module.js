import {ReplaySubject as $hgUW1$ReplaySubject, map as $hgUW1$map, BehaviorSubject as $hgUW1$BehaviorSubject, mergeWith as $hgUW1$mergeWith, scan as $hgUW1$scan, distinctUntilChanged as $hgUW1$distinctUntilChanged, debounceTime as $hgUW1$debounceTime} from "rxjs";
import {produce as $hgUW1$produce} from "immer";



const $bf0aacc6f44750a2$var$currying2 = function(fn) {
    return function() {
        return fn;
    };
};
const $bf0aacc6f44750a2$export$e66db30819f3ba48 = (initial_state, reducers, getters)=>{
    let streams = {}, actions = {}, state$;
    Object.keys(reducers).forEach((action)=>{
        const subject$ = new $hgUW1$ReplaySubject(1);
        const streamAction = (args)=>$hgUW1$produce(reducers[action](...args))
        ;
        streams[`${action}$`] = subject$.pipe($hgUW1$map(streamAction));
        actions[action] = (...args)=>subject$.next(args)
        ;
    });
    state$ = new $hgUW1$BehaviorSubject(initial_state).pipe($hgUW1$mergeWith(...Object.values(streams)), $hgUW1$scan((state, reducer)=>reducer(state)
    ), $hgUW1$distinctUntilChanged((pre, cur)=>{
        return JSON.stringify(pre) === JSON.stringify(cur);
    }));
    const getters$ = state$.pipe($hgUW1$map((state)=>Object.assign({}, ...Object.keys(getters).map((key)=>{
            return {
                [key]: getters[key](state)
            };
        }))
    ), $hgUW1$distinctUntilChanged((pre, cur)=>JSON.stringify(pre) === JSON.stringify(cur)
    ));
    return {
        state$: state$,
        actions: actions,
        getters$: getters$
    };
};
const $bf0aacc6f44750a2$export$bbeb4471b36b7cae = (prefix, observable)=>{
    return observable.pipe($hgUW1$debounceTime(1000), $hgUW1$scan((prevState, nextState)=>{
        console.groupCollapsed(`${prefix}`);
        console.log(`%c prev state:`, `color: #999999; font-weight: bold`, prevState);
        console.log(`%c next state:`, `color: #4CAF50; font-weight: bold`, nextState);
        console.groupEnd();
        return nextState;
    })).subscribe();
};




export {$bf0aacc6f44750a2$export$e66db30819f3ba48 as createBrass, $bf0aacc6f44750a2$export$bbeb4471b36b7cae as brassLogger};
//# sourceMappingURL=module.js.map
