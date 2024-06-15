import Database from 'better-sqlite3';
import path from 'path';

export type CLIENT = {
  id?: number;
  name: string;
  social_number: number;
  card_number: number
  total_amount: number;
};

export type CREDIT = {
  id?: number;
  name: string
  client_id: number
  date: Date;
  amount: number;
};


export function connect() {
  return Database(
    path.join(__dirname, '../../../', 'release/app', 'clients.db'),
    { verbose: console.log, fileMustExist: true },
  );
}

export function insertClient(client: CLIENT) {
  const db = connect();


  const stm = db.prepare(
    'INSERT INTO clients (name, social_number, card_number, total_amount) VALUES (@name, @social_number, @card_number, @total_amount)',
  );

  stm.run(client);
}


export function updateClient(client: CLIENT) {
  const db = connect();
  const { name, social_number, card_number, id } = client;

  const stm = db.prepare(
    'UPDATE clients SET title = @title, card_number = @card_number, social_number = @social_number WHERE id = @id',
  );

  stm.run({ name, social_number, card_number, id });
}

export function insertCredit(credit: CREDIT) {
  const db = connect();

  const { client_id } = credit;
  const stm = db.prepare(
    'INSERT INTO clients (client_id, amount, date) VALUES (@client_id, @amount, @date)',
  );
  const stm_client = db.prepare(
    'UPDATE clients SET total_amount = (SELECT COALESCE(SUM(amount), 0) FROM credits WHERE credits.client_id = @client_id ) WHERE EXISTS (SELECT 1 FROM credits WHERE credits.client_id = @client_id) AND clients.client_id = @client_id',
 );

  stm_client.run({ client_id})
  stm.run(credit);
}


export function updateCredit(credit: CREDIT) {
  const db = connect();
  const { client_id, amount, date, id } = credit;

  const stm = db.prepare(
    'UPDATE clients SET amount = @amount, client_id = @client_id, date = @date WHERE id = @id',
  );

  stm.run({ client_id, amount, date, id });

  const stm_client = db.prepare(
    'UPDATE clients SET total_amount = (SELECT COALESCE(SUM(amount), 0) FROM credits WHERE credits.client_id = @client_id ) WHERE EXISTS (SELECT 1 FROM credits WHERE credits.client_id = @client_id) AND clients.client_id = @client_id',
 );

  stm.run({ client_id, amount, date, id });
  stm_client.run({ client_id})
}

export function getOneCredit(id: number) {
  const db = connect();

  const stm = db.prepare('SELECT * FROM credits where id = @id');

  return stm.get({ id }) as CREDIT;
}


export function getAllCredit() {
  const db = connect();

  const stm = db.prepare('SELECT * FROM credits');

  return stm.all() as CREDIT[];
}

export function deleteCredit(id: number, client_id: number) {
  const db = connect();

  const stm = db.prepare('DELETE FROM credits WHERE id = @id');

  const stm_client = db.prepare(
    'UPDATE clients SET total_amount = (SELECT SUM(amount) FROM credits WHERE credits.client_id = @client_id ) WHERE EXISTS (SELECT 1 FROM credits WHERE credits.client_id = @client_id) AND clients.client_id = @client_id',
 );

  stm_client.run({ client_id})
  stm.run({ id });
}

export function deleteClient(id: number) {
  const db = connect();

  const stm = db.prepare('DELETE FROM clients WHERE id = @id');

  stm.run({ id });
}

export function getAllClient() {
  const db = connect();

  const stm = db.prepare('SELECT * FROM clients');

  return stm.all() as CLIENT[];
}

export function getOneClientByName(name: string) {
  const db = connect();

  const stm = db.prepare("SELECT * FROM clients WHERE name LIKE '%@name%'");

  return stm.get({ name }) as CLIENT;
}

export function getOneClientBySocialId(id: number) {
  const db = connect();

  const stm = db.prepare('SELECT * FROM clients where social_number = @id');

  return stm.get({ id }) as CLIENT;
}
export function getOneClientByCardId(id: number) {
  const db = connect();

  const stm = db.prepare('SELECT * FROM clients where card_number = @id');

  return stm.get({ id }) as CLIENT;
}

export function getOneClientByAmountRange(low: number, high:number) {
  const db = connect();

  const stm = db.prepare('SELECT * FROM clients where total_amount >= @low and total_amount <= @high');

  return stm.get({ low, high }) as CLIENT;
}




export function getOneCreditByName(name: string) {
  const db = connect();

  const stm = db.prepare("SELECT * FROM credits WHERE name LIKE '%@name%'");

  return stm.get({ name }) as CREDIT;
}


export function getOneCreditByAmountRange(low: number, high:number) {
  const db = connect();

  const stm = db.prepare('SELECT * FROM credits where amount >= @low and amount <= @high');

  return stm.get({ low, high }) as CREDIT;
}


export function getOneCreditByDate(date_low:Date, date_high:Date) {
  const db = connect();

  const stm = db.prepare('SELECT * FROM credits WHERE date >= @date_low AND date <= @date_high');

  return stm.get({ date_low, date_high }) as CREDIT;
}
