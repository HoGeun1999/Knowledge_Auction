CREATE TABLE knowledge (
id VARCHAR(100)  DEFAULT (UUID()),
name VARCHAR(30) NOT NULL,
level INT(4) NOT NULL,
rarity VARCHAR (30) NOT NULL
);


CREATE TABLE inventory (
id VARCHAR(100)  DEFAULT (UUID()) primary key,
itemId VARCHAR(100) NOT NULL,
foreign key(itemId) references knowledge (id)
);

CREATE TABLE userData (
id VARCHAR(100)  DEFAULT (UUID()) primary key,
holdings int(10) NOT NULL,
normalTicket int(4) NOT NULL,
specialTicket int(4) NOT NULL
);


CREATE TABLE enforce (
rarity VARCHAR(30) ,
level int(4) NOT NULL,
probability int(4) NOT NULL,
price int(4) NOT NULL,
PRIMARY KEY(rarity, level)
 );

CREATE TABLE colletion (
collectionName VARCHAR(30) NOT NULL,
name VARCHAR(30) NOT NULL,
level INT(4) NOT NULL,
getHistory BOOLEAN NOT NULL,
collectionId INT(4) NOT NULL,
rewardClear BOOLEAN NOT NULL,
PRIMARY KEY(name, level, collectionId)
);

CREATE TABLE editRecipe (
recipeId INT(4) NOT NULL PRIMARY KEY,
result VARCHAR(30) NOT NULL,
item1 VARCHAR(30) ,
item2 VARCHAR(30)
);