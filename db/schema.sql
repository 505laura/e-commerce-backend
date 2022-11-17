-- DROP DATABASE
DROP DATABASE IF EXISTS ecommerce_db;

-- CREATE DATABASE
CREATE DATABASE ecommerce_db;

USE ecommerce_db;

DROP TABLE IF EXISTS category;
CREATE TABLE category (
    id INTEGER NOT NULL auto_increment,
    category_name VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS product;
CREATE TABLE product (
    id INTEGER NOT NULL auto_increment,
    product_name VARCHAR(255) NOT NULL,
    price DECIMAL NOT NULL,
    stock INTEGER NOT NULL DEFAULT 10,
    category_id INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS tag;
CREATE TABLE tag (
    id INTEGER NOT NULL auto_increment,
    tag_name VARCHAR(255),
    PRIMARY KEY (id)
);

DROP TABLE IF EXISTS product_tag;
CREATE TABLE product_tag (
    id INTEGER NOT NULL auto_increment,
    product_id INTEGER,
    tag_id INTEGER,
    UNIQUE product_tag_tagId_productId_unique (product_id, tag_id),
    PRIMARY KEY (id),
    FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tag (id) ON DELETE CASCADE ON UPDATE CASCADE
);