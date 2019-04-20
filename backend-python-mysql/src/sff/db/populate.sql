USE salesforcefeup;
SET foreign_key_checks = 1;

INSERT INTO Role(name, description) VALUES('sales_person', 'A Sales person');
INSERT INTO Role(name, description) VALUES('sales_leader', 'A Sales leader, it is the leader of a sales team');

INSERT INTO User(salesmanCode,password,fullname) values('generic','generic','generic');


INSERT INTO Task(user_id,date,name) values(1,1542373200,'Visit Hospital S.Joao');
INSERT INTO Task(user_id,date,name, completed) values(1,1542362400,'Visit FEUP', 1);
INSERT INTO Task(user_id,date,name) values(1,1542358800,'Meeting Sr. Nelson Martins');
INSERT INTO Task(user_id,date,name, completed) values(1,1542367800,'Call ISEP', 1);
INSERT INTO Task(user_id,date,name) values(1,1542382200,'Reply Hospital Santa Maria');
INSERT INTO Task(user_id,date,name) values(1,1542385800,'CALL Sr Manuel Peixoto');
INSERT INTO Task(user_id,date,name) values(1,1542393000,'Send Quotation FDUP');
INSERT INTO Task(user_id,date,name) values(1,1542398400,'CALL FLUP');
INSERT INTO Task(user_id,date,name) values(1,1542400200,'CALL Hospital Santo António');
