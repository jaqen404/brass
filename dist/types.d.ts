import { Observable } from "rxjs";
export const createBrass: (initial_state: any, reducers: any, getters: any) => {
    state$: Observable<any>;
    actions: any;
    getters$: Observable<any>;
};
export const brassLogger: (prefix: string, observable: Observable<any>) => import("rxjs").Subscription;

//# sourceMappingURL=types.d.ts.map
