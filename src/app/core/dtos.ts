export class Wrapper<T> {
    constructor(data: any) {
        Object.assign(this, data);
    }

    data: T;
    success: boolean;
}

export class Task {
    constructor(data: any) {
        Object.assign(this, data);
    }

    application_id: string;
    task_id: number;
    task_name: string;
}

export class TaskPostRequest {
    constructor(data: any) {
        Object.assign(this, data);
    }

    name: string;
}

export class ErrorWrapper {
    constructor(data: any) {
        Object.assign(this, data);
    }

    errors: Error[];
}

export class Error {
    constructor(data: any) {
        Object.assign(this, data);
    }

    message: string;
    exception: string;
    status_code: number;
    success: boolean;
}
