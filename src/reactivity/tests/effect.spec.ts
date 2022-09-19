
import {reactive} from '../reactive'
import {effect} from '../effect'
describe('effect', () => { 
    it(("happy path"),()=>{ //happy path 核心逻辑
        const kain = reactive({
            age: 28
        })
        let nextAge
        effect(()=>{
            nextAge = kain.age + 1
        })
        expect(nextAge).toBe(29)

        kain.age++
        expect(nextAge).toBe(30)
    })

    it("should return runner when call effect",()=>{
        let foo = 10;
        const runner = effect(()=>{
            foo++;
            return 'foo'
        })
        expect(foo).toBe(11)
        const r = runner();
        expect(foo).toBe(12)
        expect(r).toBe("foo")
    })

    it("test effect scheduler",()=>{
        let dummy;
        let run;
        const scheduler = jest.fn(()=>{
            run = runner
        });
        const obj = reactive({foo: 1})
        const runner = effect(()=>{
            dummy = obj.foo
        },{scheduler})
        expect(scheduler).not.toHaveBeenCalled();
        expect(dummy).toBe(1)
        obj.foo++
        expect(scheduler).toHaveBeenCalledTimes(1);
        expect(dummy).toBe(1)
        run();
        expect(dummy).toBe(2)
    })
 })