import { Injectable, ViewContainerRef, ComponentFactoryResolver, ReflectiveInjector, Output, EventEmitter, ComponentRef, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
interface kuxModal {
    id: string;
    subject: Subject<subAtc>;
    componentRef: ComponentRef<any>;
    close:(data?:any)=>void
}
interface subAtc {
    action: string;
    data?: any
}
interface kuxModalOpt {
    animate?: string;
    zIndex?: number;
}
@Injectable()
export class KuxModalService {
    public data: any = { showMask: false }
    public fn: any = {};
    public viewContainer: ViewContainerRef;
    public includeBox: any;
    private modals: any = {};
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver
    ) {
        this.fn.showMask = this.showMask.bind(this);
        this.fn.hideMask = this.hideMask.bind(this);
    }
    private showMask() {
        this.data.showMask = true;
    }
    private hideMask() {
        this.data.showMask = false;
    }
    private S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    private guid() {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    }
    open(dialogComponent: any, opt: kuxModalOpt = {}): kuxModal {
        let sub = new Subject()
        this.showMask();
        this.includeBox.clear();
        if (this.viewContainer === undefined) {
            throw new Error(`You can call 'open()' method of modalService just when youer Root Component after OnInit`)
        }
        this.addBodyClass('kux-modal-opened')
        let factory = this.componentFactoryResolver.resolveComponentFactory(dialogComponent);
        let injector = ReflectiveInjector.fromResolvedProviders([], this.viewContainer.parentInjector);
        let tmp: ComponentRef<any> = this.includeBox.createComponent(factory, 0, injector, []);
        let id = this.guid();
        this.modals[id] = {
            id: id,
            subject: sub,
            componentRef: tmp,
            close:(data?:any)=>{
                let e:any ={action:'$close'}
                if(data){e.data=data};
                tmp.instance.$emitter.next(e)
            }
        }
        if (opt.animate) {
            tmp.instance.$kuxAniSta = opt.animate;
        } else {
            tmp.instance.$kuxAniSta = 'leftIn';
        }
        if (opt.zIndex !== undefined) {
            tmp.instance.$kuxZIndex = 1010 + opt.zIndex;
        }
        let isClose
        if (tmp.instance.$emitter) {
            tmp.instance.$emitter.subscribe((e: any) => {
                let action = e.action;
                if (action == undefined) {
                    return;
                }
                if (action == '$close') {
                    isClose = true;
                    let ids = Object.keys(this.modals);
                    tmp.destroy();
                    this.hideMask();
                    sub.next(e);
                    return;
                }
                if (action == '$aniEnd') {
                    if (isClose) {
                        sub.next({ action: '$destroyed' })
                        delete this.modals[id];
                        if (Object.keys(this.modals).length === 0) {
                            this.removeBodyClass('kux-modal-opened')
                        }
                    } else {
                        sub.next({ action: '$opened' })
                    }
                } else {
                    sub.next(e);
                }
            })
        } else {
            throw new Error(`You'r Component should implement kuxModalContent`)
        }
        return this.modals[id];
    }
    addBodyClass(name: string) {
        let _className = document.body.className
        let className = _className == '' ? [] : _className.split(' ');
        if (className.indexOf(name) == -1) {
            className.push(name);
            document.body.className = className.join(' ');
        }
    }
    removeBodyClass(name: string) {
        let _className = document.body.className
        let className = _className == '' ? [] : _className.split(' ');
        className = className.filter((item) => {
            return item != name;
        })
        document.body.className = className.join(' ');
    }
}