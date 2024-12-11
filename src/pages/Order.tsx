import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, MenuItem, IconButton, Typography } from '@mui/material';
import { AddCircle, RemoveCircle } from '@mui/icons-material';
import { IOrder } from '../model/order';
import { IOrderdetails } from '../model/orderdetails';
import { IMenu } from '../model/menu';
import { ICustomer } from '../model/customer';
import { ITable } from '../model/table';
import { IEmployee } from '../model/employee';
import "../css/order.css";

import { getCustomer } from '../service/CustomerR';
import { getEmployee } from '../service/EmployeeR';
import { getMenu } from '../service/MenuR';
import { getTable } from '../service/TableR';
import axios from 'axios';

const AddOrderForm: React.FC = () => {
    const [order, setOrder] = useState<IOrder>({
        id: 0,
        orderDateTime: new Date(),
        customerId: 0,
        tableId: 0,
        employeeId: 0,
    });

    const [orderDetails, setOrderDetails] = useState<IOrderdetails[]>([
        { id: 0, orderId: 0, menuId: 0, amount: 1, price: 0, menu: { id: 0, dishName: "", description: "", price: 0, image: "" } }
    ]);

    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [tables, setTables] = useState<ITable[]>([]);
    const [employees, setEmployees] = useState<IEmployee[]>([]);
    const [menuItems, setMenuItems] = useState<IMenu[]>([]);

    const [totalPrice, setTotalPrice] = useState<number>(0);
    const formatDate = (date: Date): string => {
        return date.toISOString();
    };

    const calculateTotalPrice = () => {
        const total = orderDetails.reduce((acc, detail) => acc + (detail.price * detail.amount), 0);
        setTotalPrice(total);
    };

    useEffect(() => {
        const fetchData = async () => {
          try {
            const customerData = await getCustomer();
            console.log('Customer data:', customerData);
            
            setCustomers(customerData);
      
            const tableData = await getTable();
            console.log('Table data:', tableData);
            if (Array.isArray(tableData)) {
                setTables(tableData);
            } else {
                console.error("Unexpected response structure:", tableData);
            }
      
            const employeeData = await getEmployee();
            console.log('Employee data:', employeeData);     
            if (Array.isArray(employeeData)) {
                setEmployees(employeeData);
            } else {
                console.error("Unexpected response structure:", employeeData);
            }

            const menuData = await getMenu();
            console.log('Menu data:', menuData);
            if (Array.isArray(menuData)) {
                setMenuItems(menuData);
            } else {
                console.error("Unexpected response structure:", menuData);
            }
      
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
      
        fetchData();
      }, []);

    useEffect(() => {
        console.log('Customers state updated:', customers);
    }, [customers]);

    useEffect(() => {
        calculateTotalPrice();
    }, [orderDetails]);

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setOrder({ ...order, [e.target.name]: e.target.value });
    };

    const handleOrderDetailChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const updatedOrderDetails = [...orderDetails];
        
        if (name === 'amount') {
            updatedOrderDetails[index][name] = value === '' ? 0 : parseFloat(value);
        } else {
            updatedOrderDetails[index][name as keyof IOrderdetails] = value as any;
        }
    
        const menuItem = menuItems.find(item => item.id === updatedOrderDetails[index].menuId);
        if (menuItem) {
            updatedOrderDetails[index].price = menuItem.price;
            updatedOrderDetails[index].menu = {
                id: menuItem.id,
                dishName: menuItem.dishName,
                description: menuItem.description || "",
                price: menuItem.price,
                image: menuItem.image || ""
            };
        }
    
        setOrderDetails(updatedOrderDetails);
    };
    
    
    const addOrderDetail = () => {
        setOrderDetails([
            ...orderDetails,
            { id: 0, orderId: 0, menuId: 0, amount: 1, price: 0, menu: { id: 0, dishName: "", description: "", price: 0, image: "" } }
        ]);
    };
    
    const removeOrderDetail = (index: number) => {
        const updatedOrderDetails = orderDetails.filter((_, i) => i !== index);
        setOrderDetails(updatedOrderDetails);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        try {
            const orderData = {
                id: 0,
                orderDateTime: order.orderDateTime.toISOString(),
                customerId: order.customerId,
                tableId: order.tableId,
                employeeId: order.employeeId,
                orderDetails: orderDetails.map(detail => ({
                    menuId: detail.menuId,
                    amount: detail.amount,
                    price: detail.price
                }))
            };
            const response = await axios.post('https://localhost:7239/api/Order/Add', orderData);
            console.log('Order created successfully:', response.data);
        } catch (error) {
            console.error('Error while creating order:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>Add Order</Typography>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    select
                    label="Customer"
                    name="customerId"
                    value={order.customerId || ''}
                    onChange={handleOrderChange}
                    required
                >
                    {customers.length > 0 ? (
                        customers.map((customer) => (
                            <MenuItem key={customer.id} value={customer.id}>
                                {`${customer.name} ${customer.surname}`}
                            </MenuItem>
                        ))
                    ) : (
                        <MenuItem disabled>No Data</MenuItem>
                    )}
                </TextField>

                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Table"
                        name="tableId"
                        value={order.tableId || ''}
                        onChange={handleOrderChange}
                        required
                    >
                        {tables.length > 0 ? (
                            tables.map(table => (
                                <MenuItem key={table.id} value={table.id}>
                                    {`Table ${table.tableNumber}`}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No Data</MenuItem>
                        )}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        select
                        label="Employee"
                        name="employeeId"
                        value={order.employeeId || ''}
                        onChange={handleOrderChange}
                        required
                    >
                        {employees.length > 0 ? (
                            employees.map(employee => (
                                <MenuItem key={employee.id} value={employee.id}>
                                    {employee.name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No Data</MenuItem>
                        )}
                    </TextField>
                </Grid>

                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Date Order"
                        name="orderDateTime"
                        type="text"
                        value={formatDate(order.orderDateTime)}
                        disabled
                    />
                </Grid>

                {orderDetails.map((detail, index) => (
                    <Grid container spacing={2} key={index} alignItems="center">
                        <Grid item xs={12} sm={4}>
                            <TextField
                                fullWidth
                                select
                                label="Dish"
                                name="menuId"
                                value={detail.menuId || ''}
                                onChange={(e) => handleOrderDetailChange(index, e)}
                                required
                            >
                                {menuItems.length > 0 ? (
                                    menuItems.map(menuItem => (
                                        <MenuItem key={menuItem.id} value={menuItem.id}>
                                            {menuItem.dishName}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>No Data</MenuItem>
                                )}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Amount"
                                name="amount"
                                type="number"
                                value={detail.amount}
                                onChange={(e) => handleOrderDetailChange(index, e)}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={detail.price}
                                InputProps={{
                                    readOnly: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                            <IconButton color="secondary" onClick={() => removeOrderDetail(index)}>
                                <RemoveCircle />
                            </IconButton>
                        </Grid>
                    </Grid>
                ))}

                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={addOrderDetail} startIcon={<AddCircle />}>
                        Add Dish
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h6" align="right">
                        Total Sum: {totalPrice} $
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Send Order
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default AddOrderForm;
