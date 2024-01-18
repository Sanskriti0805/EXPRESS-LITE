import { IncomingMessage } from 'http';
import accepts from 'accepts';

const reqPrototype: typeof IncomingMessage = Object.create(IncomingMessage.prototype);

export default class Request extends reqPrototype {
    public header(name: string) {

        const lc = name.toLowerCase();

         switch (lc) {
            case 'referer':
            case 'referrer':
                return this.headers.referrer
                    || this.headers.referer;
            default:
                return this.headers[lc];
        }

    }
    accepts (name:string|Array<string>){
            const accept = accepts(this);
            return accept.types.apply(accept, name);
    }

    
    
    }
