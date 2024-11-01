type ErrorEnitty = {
    headers: any;
    activityId: any;
    body: {
        code: string,
        message: string
    };
    code: number;
} & any;

export { ErrorEnitty }
