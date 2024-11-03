# W3Schools Database in Docker

Forked from https://github.com/AndrejPHP/w3schools-database for academic purposes.

This repository provides:

- a docker compose which sets up the DB on port 3309 (non-default, no clashes)
- initializes the database data from w3schools (provided by @AndrejPHP) 
- Visual Studio Code config

## Prerequisite
Make sure that the following software is installed:
- Docker
- If you are on Windows, please use WSL with Ubuntu for the setup and use the bash terminal

## Fork to your github account
Go to github.com, create a new account or login.
- Fork this repo (https://github.com/annalenagroos/w3schools-database-master.git)

Now you have a repository w3schools-database in your github account.
Clone that with:
```bash 
git clone https://github.com/YOURUSERNAME/w3schools-database
cd w3schools-database
code .
```

Run the database and rest-api

```bash
sudo docker compose up
```

Start the react app

```bash
cd my-app
npm install
npm start
```

## How to reset?

Execute:

```bash
docker compose down
rm -rf data
docker compose up -d
```

## Tables

When the docker container starts, it creates database named __w3schools__ with the following tables

    categories
    customers
    employees
    orders
    order_details
    products
    shippers
    suppliers
    
and inserts the respective data. 

## Existing Features
1. Get and list all Products
2. Get and list all Categories
3. Get and list all Suppliers
4. Create a new Product
5. Create a new Categorie
6. Create a new Supplier
7. Update an existing Product
8. Update an existing Categorie
9. Update an existing Supplier
10. Delete a Product
11. Delete a Categorie
12. Delete a Supplier
13. Filter by Category or Supplier
14. Search Entity by Name
15. Reset Filters and Search Term with a Button
16. Sort by Entity Fields
17. Pagination of the Table

## Added Features
1. Get and list all Orders
2. Get and list all Customers
3. Get and list all Shippers
4. Create a new Order
5. Create a new Customer
6. Create a new Shipper
7. Update an existing Order
8. Update an existing Customer
9. Update an existing Shipper
10. Delete a Order
11. Delete a Customer
12. Delete a Shipper
13. Added CSV-Export by Shippers
14. Added new Logo

## Journal
### 30.10.2024
The setup was difficult because I lacked Linux and Docker experience. After some trial and error, it finally worked.

### 31.10.2024
I tried to continue working, but I kept getting various error messages and had to recreate the Docker.

### 01.11.2024
Tried again but came not really far because I had to wait very long while saving.

### 02.11.2024
Made some reasearch about the whole project an topics. Tried many times to setup and creat something.

### 03.11.2024
Had to reset and setup the whole VM/wsl with Ismail again. Installed it using WSL.
Added the features listed above and updated the journal.
