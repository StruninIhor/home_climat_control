import { Moment } from 'moment';

export class ClimatDataQuery {
    startDate : Moment;
    endDate : Moment;
    count : number
}

export class HistoricalDataQuery extends ClimatDataQuery {
    dataToGather: string[]
}

