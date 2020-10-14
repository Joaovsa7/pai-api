import 'reflect-metadata';
import {createConnection} from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import {Request, Response} from 'express';

createConnection().then(async connection => {

    // create express app
    const app = express();
    app.use(bodyParser.json());

    app.get('*', (req: Request, res: Response) => res.send('Pai api'))

    app.listen(3000);

}).catch(error => console.log(error));
