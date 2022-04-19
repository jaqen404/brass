var $8zHUo$rxjs = require("rxjs");
var $8zHUo$immer = require("immer");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}

$parcel$export(module.exports, "createBrass", () => $4921c9a37380b27d$export$e66db30819f3ba48);
$parcel$export(module.exports, "brassLogger", () => $4921c9a37380b27d$export$bbeb4471b36b7cae);


const $4921c9a37380b27d$var$currying2 = function(fn) {
    return function() {
        return fn;
    };
};
const $4921c9a37380b27d$export$e66db30819f3ba48 = (initial_state, reducers, getters)=>{
    let streams = {}, actions = {}, state$;
    Object.keys(reducers).forEach((action)=>{
        const subject$ = new $8zHUo$rxjs.ReplaySubject(1);
        const streamAction = (args)=>$8zHUo$immer.produce(reducers[action](...args))
        ;
        streams[`${action}$`] = subject$.pipe($8zHUo$rxjs.map(streamAction));
        actions[action] = (...args)=>subject$.next(args)
        ;
    });
    state$ = new $8zHUo$rxjs.BehaviorSubject(initial_state).pipe($8zHUo$rxjs.mergeWith(...Object.values(streams)), $8zHUo$rxjs.scan((state, reducer)=>reducer(state)
    ), $8zHUo$rxjs.distinctUntilChanged((pre, cur)=>{
        return JSON.stringify(pre) === JSON.stringify(cur);
    }));
    const getters$ = state$.pipe($8zHUo$rxjs.map((state)=>Object.assign({}, ...Object.keys(getters).map((key)=>{
            return {
                [key]: getters[key](state)
            };
        }))
    ), $8zHUo$rxjs.distinctUntilChanged((pre, cur)=>JSON.stringify(pre) === JSON.stringify(cur)
    ));
    return {
        state$: state$,
        actions: actions,
        getters$: getters$
    };
};
const $4921c9a37380b27d$export$bbeb4471b36b7cae = (prefix, observable)=>{
    return observable.pipe($8zHUo$rxjs.debounceTime(1000), $8zHUo$rxjs.scan((prevState, nextState)=>{
        console.groupCollapsed(`${prefix}`);
        console.log(`%c prev state:`, `color: #999999; font-weight: bold`, prevState);
        console.log(`%c next state:`, `color: #4CAF50; font-weight: bold`, nextState);
        console.groupEnd();
        return nextState;
    })).subscribe();
};




//# sourceMappingURL=main.js.map
