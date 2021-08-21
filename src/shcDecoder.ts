import { inflateRaw } from 'pako';
import jose from 'node-jose';
import { SmartHealthCard } from '../model/smartHealthCard';
import { ShcHeader } from '../model/shcHeader';
import { ShcPayload } from '../model/shcPayload';
import { NotSHCException } from '../exceptions/NotSHCException';
const Buffer = require('buffer/').Buffer;

export class ShcDecoder {
    public async decode(rawData: string): Promise<SmartHealthCard> {
        if (rawData.substring(0, 5) !== 'shc:/') {
            throw new NotSHCException();
        }

        const jwt = this.numericShcToJwt(rawData);
        const splitJwt = jwt.split('.');

        const header = this.parseJwtHeader(splitJwt[0]);
        const payload = this.parseJwtPayload(splitJwt[1]);
        const trustable = await this.verifySignature(jwt);

        return {
            header: header,
            payload: payload,
            trustable: trustable
        } as SmartHealthCard;
    }

    private numericShcToJwt(rawData: string): string {
        return ((rawData
            .split('/')[1]
            .match(/(..?)/g)) as RegExpMatchArray)
            .map((number: any) => String.fromCharCode(parseInt(number, 10) + 45))
            .join('');
    }

    private parseJwtHeader(header: string): ShcHeader {
        const headerData = Buffer.from(header, 'base64');
        return JSON.parse(headerData);
    }

    private parseJwtPayload(payload: string): ShcPayload {
        const payloadData = Buffer.from(payload, 'base64');
        const inflatedPayload = inflateRaw(payloadData, { to: 'string' });
        return new ShcPayload(JSON.parse(inflatedPayload));
    }

    private async verifySignature(jwt: string): Promise<boolean> {
        const qcKey = {
            kid: 'kid',
            alg: 'ES256',
            kty: 'EC',
            crv: 'P-256',
            use: 'sig',
            x: 'XSxuwW_VI_s6lAw6LAlL8N7REGzQd_zXeIVDHP_j_Do',
            y: '88-aI4WAEl4YmUpew40a9vq_w5OcFvsuaKMxJRLRLL0',
        };
        const key = await jose.JWK.asKey(qcKey);

        try {
            await jose.JWS.createVerify(key).verify(jwt);
            return true;
        } catch (e) {
            return false;
        }
    }
}
