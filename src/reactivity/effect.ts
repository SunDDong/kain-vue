class reactiveEffect{
    private _fn: any
    constructor(fn:any,public scheduler?:any){
        this._fn = fn
    }
    run(){
        activeEffect = this;
        return this._fn()
    }
}

const targetMap = new Map()
export function track(target:any,key:any){
    // target => key=>dep
    let depsMap = targetMap.get(target) // target={age: 28}  key: "age"
    if(!depsMap){
        depsMap = new Map()
        targetMap.set(target, depsMap) // target 对应一个depsMap
    }
    let dep = depsMap.get(key)
    if(!dep){
        dep = new Set()
        depsMap.set(key,dep)
    }
    dep.add(activeEffect)
}

export function trigger(target:any,key:any){
    let depsMap = targetMap.get(target)
    let dep = depsMap.get(key)
    for(const effect of dep){
        if(effect.scheduler){
            effect.scheduler()
        }else{
            effect.run()
        }
    }
}

let activeEffect
export function effect(fn:any,options:any ={}){
    const _effect = new reactiveEffect(fn,options.scheduler)
    _effect.run()
    return _effect.run.bind(_effect)
}