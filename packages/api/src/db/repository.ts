import * as Datastore from 'nedb';
import { config } from '../config';
import { sleep } from '../utils/sleep';

export interface IStoredModel {
  _id: string;
}

export interface IFindOptions<T> {
  sort?: {
    key: keyof T;
    direction: 'asc' | 'desc';
  };
  limit?: number;
  skip?: number;
}

export type StoredModel<T> = IStoredModel & T;

export interface IRepository<T, S extends StoredModel<T>> {
  create(data: T): Promise<S>;
  find(data: Partial<S>, options?: IFindOptions<T>): Promise<S[]>;
  findOne(data: Partial<S>): Promise<S | undefined>;
  update(query: Partial<S>, data: T): Promise<number>;
  count(query: Partial<T>): Promise<number>;
  delete(query: Partial<S>): Promise<number>;
}

export abstract class Repository<T, S extends StoredModel<T>> implements IRepository<T, S> {
  private datastore: Datastore | undefined;

  public async create(data: T) {
    const datastore = await this.initialize();
    return new Promise<S>((resolve, reject) => {
      datastore.insert<T>(data, (err, doc) => {
        if (err) { return reject(err); }
        resolve(doc as S);
      });
    });
  }

  public async find(data: Partial<S>, options?: IFindOptions<T>) {
    const datastore = await this.initialize();
    return new Promise<S[]>((resolve, reject) => {
      let cursor = datastore.find<S>(data);
      if (options) {
        if (options.sort) {
          const sortParams: any = {};
          sortParams[options.sort.key] = options.sort.direction === 'asc' ? 1 : -1;
          cursor = cursor.sort(sortParams);
        }

        if (options.skip) {
          cursor = cursor.skip(options.skip);
        }

        if (options.limit) {
          cursor = cursor.limit(options.limit);
        }
      }

      cursor.exec((err, doc) => {
        if (err) { return reject(err); }
        resolve(doc);
      });
    });
  }

  public async findOne(data: Partial<S>) {
    const datastore = await this.initialize();
    return new Promise<S | undefined>((resolve, reject) => {
      datastore.findOne(data, (err: Error, doc: S) => {
        if (err) { return reject(err); }
        resolve(doc ? doc : undefined);
      });
    });
  }

  public async update(query: Partial<S>, data: T) {
    const datastore = await this.initialize();
    return new Promise<number>((resolve, reject) => {
      datastore.update(query, data, {}, (err: Error, numReplaced) => {
        if (err) { return reject(err); }
        resolve(numReplaced);
      });
    });
  }

  public async count(query: Partial<T>) {
    const datastore = await this.initialize();
    return new Promise<number>((resolve, reject) => {
      datastore.count(query, (err: Error, count: number) => {
        if (err) { return reject(err); }
        resolve(count);
      });
    });
  }

  public async delete(query: Partial<S>) {
    const datastore = await this.initialize();
    return new Promise<number>((resolve, reject) => {
      datastore.remove(query, (err: Error, numDeleted) => {
        if (err) { return reject(err); }
        resolve(numDeleted);
      });
    });
  }

  private async initialize() {
    if (this.datastore) { return this.datastore; }

    let directory: string;
    if (process.env.NODE_ENV === 'test') {
      directory = 'test-data';
    } else {
      while (!config.chain) {
        await sleep(1000);
      }
      directory = `${config.pwd}/data/${config.chain}`;
    }

    this.datastore = new Datastore({
      filename: `${directory}/${this.constructor.name.toLowerCase().replace('repository', '')}.db`,
      autoload: true
    });
    return this.datastore;
  }
}
