export class WrongStatusTransitionException extends Error {
    constructor() {
        super(`Cannot transition task!`);
        this.name = 'WrongStatusTransitionException';
    }

}