import { connection, connect, Error } from 'mongoose';
import { databaseUrl } from '../getConfig';

export default () => {
  return new Promise((resolve, reject) => {
    const db = connect(databaseUrl);
    resolve(db);
    connection.on('error', (e) => {
      // eslint-disable-next-line prefer-promise-reject-errors
      reject(`MongoDB 连接错误\n${e}`);
      throw new Error(e);
    });
  });
};
