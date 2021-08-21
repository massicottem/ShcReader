import { ShcHeader } from './shcHeader';
import { ShcPayload } from './shcPayload';

export interface SmartHealthCard {
    header: ShcHeader;
    payload: ShcPayload;
    trustable: boolean;
}
