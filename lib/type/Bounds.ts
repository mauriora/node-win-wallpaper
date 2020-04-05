import {Rectangle} from 'electron';

export default interface Bounds extends Rectangle {
    displayId: number;
};
