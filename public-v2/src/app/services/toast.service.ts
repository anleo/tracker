import {Injectable, ViewContainerRef} from "@angular/core";
import {ToastsManager, Toast} from "ng2-toastr";

@Injectable()
export class ToastService {
  constructor(public toastManager: ToastsManager) {}

  setVcr(vcr) {
    this.toastManager.setRootViewContainerRef(vcr);
    return this.toastManager;
  }

  success(message:string, title: string = '', options?:any): Promise<Toast>{
    return this.toastManager.success(message, title, options);
  }

  info(message:string, title: string = '', options?:any): Promise<Toast>{
    return this.toastManager.info(message, title, options);
  }

  warning(message:string, title: string = '', options?:any): Promise<Toast>{
    return this.toastManager.warning(message, title, options);
  }

  error(message:string, title: string = '', options?:any): Promise<Toast>{
    return this.toastManager.error(message, title, options);
  }
}
