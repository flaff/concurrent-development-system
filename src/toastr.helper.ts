import * as toastr from 'toastr';

export class ToastrService {
    constructor() {

    }

    private static initOptions() {
        toastr.options = {'positionClass': 'toast-bottom-center'};
    }

    public static error(title: string, text: string = '') {
        this.initOptions();
        toastr.error(text, title);
    }

    public static success(title: string, text: string = '') {
        this.initOptions();
        toastr.success(text, title);
    }

    public static warning(title: string, text: string = '') {
        this.initOptions();
        toastr.warning(text, title);
    }
}