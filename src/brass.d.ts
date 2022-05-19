export interface Streams {
  [key: string]: Observable<any>
}
export interface DraftFn {
  (draft: any): any
}
export interface Stores {
  [key: string]: Brass
}
export interface Store {
  name: string
  state$: Observable<any>
  mutations: { [key: string]: any }
  actions: { [key: string]: any }
  getters$: Observable<any>
  setState: any
  brassData$: Observable<any>
  initialState: any
  state: any
  getters: any
}
