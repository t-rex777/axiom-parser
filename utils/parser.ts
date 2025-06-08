import { prettyPrintJson } from 'pretty-print-json';

export class AxiomParser {
    private table: HTMLTableElement;
    private messageElement: HTMLDivElement;
    private url: string;
    private message: string;

    constructor(private readonly page: Document) {
        this.table = this.getTable(this.page);
        this.messageElement = this.getMessageElement(this.table);

        const { url, message } = this.getUrlAndMessage(this.messageElement);

        this.url = url
        this.message = message
     }

    static EXTRACT_URL_AND_MESSAGE_REGEX = /(?<url>(https?[^\s]+))\s\d+\s(?<message>(.+))/gm
    static TABLE_SELECTOR = '.BT1bDaA_R_wDkeIDeYw1.CdSU7o64fEHtp5nh4O96._ZUt0haF5VLIfPQNA9lo.VEsRnaqAVcUaNlI1Va3w.fxQ6jSfl8vOY363gzBVL.HxQKoDRiqnUNb5gbvbN1.AZJXOtCZ7vEdvGS9WSnF.NKCK_xX58HltNNmmhi3A.eiFnGUsidwZ6JDTiNVSf.QunlokZWSKQTwhecvLXv';
    static MESSAGE_SELECTOR = '._3wNHZmXAlVclKlsy7Gs';


    private getTable(page: Document) {
        return page.querySelector(AxiomParser.TABLE_SELECTOR) as HTMLTableElement;
    }

    private getMessageElement(table: HTMLTableElement) {
        return table.querySelectorAll(AxiomParser.MESSAGE_SELECTOR)[2].firstChild as HTMLDivElement;
    }

    private getUrlAndMessage(messageElement: HTMLDivElement) {
        const matches = messageElement.textContent?.matchAll(AxiomParser.EXTRACT_URL_AND_MESSAGE_REGEX)
        if (matches) {
            const matchArray = Array.from(matches);
            if (matchArray.length > 0) {
                const match = matchArray[0];
                return { url: match.groups?.url ?? "", message: match.groups?.message ?? ""};
            }
        }
        return { url: "", message: "" };
    }

    private formatUrl(url: string) {
        return decodeURIComponent(url);
    }

    private storeMessage() {
        return this.messageElement.innerHTML = prettyPrintJson.toHtml(JSON.parse(this.message));
    }

    private storeUrl() {
        const urlElement = document.createElement('pre');
        urlElement.textContent = this.formatUrl(this.url);
        this.messageElement.prepend(urlElement);
    }

    store() {
        this.storeMessage();
        this.storeUrl();
    }
}